const express = require('express');
const video = require('./routes/video');
const dotenv = require('dotenv');


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.use('/',video);

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/upload',(req,res) => {
    res.sendFile(__dirname + '/public/upload.html');
})

app.listen(3000,() => {
    console.log("Server Working");
})