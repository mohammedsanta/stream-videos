const { MongoClient, GridFSBucket } = require("mongodb");
const fs = require('fs');

// initialize video upload to MongoDB GridFS
const initVideo = async (res,path,name) => {

    const client = new MongoClient(process.env.MONGO_URL);

    await client.connect();

    const db = client.db(process.env.FILE_DB_NAME);
    const bucket = new GridFSBucket(db);

    const videoUploadStream = bucket.openUploadStream(name);
    const videoReadStream = fs.createReadStream(path);

    videoReadStream.pipe(videoUploadStream);

    // erro handel

    videoUploadStream.on('error', () => {
        return res.status(500).send('Error uploading file');
    });

    videoUploadStream.on('finish', () => {
        res.status(200).send('File uploaded successfully');
    });

};

module.exports = { initVideo }