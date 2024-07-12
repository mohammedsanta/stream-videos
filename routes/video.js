const express = require('express');
const Router = express.Router()
const mongoose = require('mongoose')
const { upload } = require('../helper/upload');

// start MONGO

try {
  mongoose.connect('mongodb://127.0.0.1:27017/videos');
} catch (error) {
  console.log(error);
}
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});
 
//creating bucket
let bucket;
mongoose.connection.on("connected", async () => {
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db);
});

// End Mongo

Router.post('/api/upload', upload().single('file'),async (req, res) => {  
    try {
        res.status(200).json({ success: "file upload successful" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// Streaming video
Router.get('/video/:filename', async (req, res) => {

  const { filename } = req.params;

  try {
    // check if file exists
    const file = await bucket
      .find({ filename })
      .toArray()

    if(!file.length) {
      return res.status(404).json("File Not Found");
    }

    // set headers
    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `attachment; filename=${file[0].filename}.mp4`);

    // create a stream to read from bucket
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(file[0]._id)
    )

    console.log(new mongoose.Types.ObjectId(file[0]._id))

    // pipe the stream to the response
    downloadStream.pipe(res)

  } catch (err) {
    console.log(err)
    res.status(404).json(res.status(400).json({
      error: { text: `Unable to download file`, error },
    }))
  }

});

// Streaming videos
Router.get('/videos', async (req, res) => {

  const files = bucket.find()
  const cursor = await files.toArray();

  res.json(cursor);
  
});

Router.get('/delete/:filename',async (req,res) => {
  const { filename } = req.params;
  try {
    const file = await bucket.find({ filename }).toArray()
    if(!file.length) return res.status(404).json("File not Found"); 
    bucket.delete( new mongoose.Types.ObjectId(file[0]._id) );
    res.status(200).json({ text: "File Delete Successfuly" })
  } catch (err) {
    console.log(err);
    res.status(500).json({ text: "Unable to Delete File:", err })
  }
})

// app.put("/rename/file/:fileId", async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const { filename } = req.body;
//     await bucket.rename(new mongoose.Types.ObjectId(fileId), filename);
//     res.status(200).json({ text: "File renamed successfully !" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       error: { text: `Unable to rename file`, error },
//     });
//   }
// });

// // Delete a file
// app.delete("/delete/file/:fileId", async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     await bucket.delete(new mongoose.Types.ObjectId(fileId));
//     res.status(200).json({ text: "File deleted successfully !" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       error: { text: `Unable to delete file`, error },
//     });
//   }
// });

module.exports = Router