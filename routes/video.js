const express = require('express');
const Router = express.Router()
const { MongoClient, GridFSBucket } = require('mongodb');
const mongodb = require('mongodb');
const { upload } = require('../helper/multer');
const { initVideo } = require('../helper/initiateVideo');

Router.post('/api/upload', upload.single('file'),async (req, res) => {
    
    const video = req.file;
    const videoName = (video.filename).split('.')[0]
    const path = `${video.destination}${video.filename}`

    await initVideo(res,path,videoName);

    try {
        res.status(200).json({ success: "file upload successful" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// Streaming video
Router.get('/mongo-video', async (req, res) => {

    const client = new MongoClient(process.env.MONGO_URL);

    const db = client.db(process.env.FILE_DB_NAME);
    const bucket = new mongodb.GridFSBucket(db);

    const video = bucket.openDownloadStreamByName('output-video-with-audio')

    video.pipe(res);
  
});

// Streaming videos
Router.get('/videos', async (req, res) => {

    const client = new MongoClient(process.env.MONGO_URL);

    await client.connect();
    const db = client.db(process.env.FILE_DB_NAME);
    const collection = db.collection('fs.files');

    const findResult = await collection.find({}).toArray()

    res.json(findResult);
  
});

Router.get('/video', async (req, res) => {

    const name = req.query.video;

    console.log(name)

    const client = new MongoClient(process.env.MONGO_URL);

    const db = client.db(process.env.FILE_DB_NAME);
    const bucket = new mongodb.GridFSBucket(db);

    const video = bucket.openDownloadStreamByName(name)

    video.pipe(res);
  
});

Router.get('/delete',async (req,res) => {

    const name = req.query.video;
    console.log(name);

    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    const db = client.db(process.env.FILE_DB_NAME);
    const collection = db.collection('fs.files');
    const result = await collection.find({ filename: name  }).toArray()

    console.log(result.length)

    if(!result.length) return res.status(400).send("Video Not Found to Delete");

    const video = result[0]

    const bucket = new mongodb.GridFSBucket(db);
    const deleteFile = await bucket.delete(new mongodb.ObjectId(video._id));


    console.log(deleteFile);

    res.send("Video has been Deleted");
})

module.exports = Router