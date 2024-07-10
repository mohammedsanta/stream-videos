// Multer

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file)
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  // fix problem can't save arabic strings
  file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
  callback(null, true);
};

const upload = multer({ storage: storage,fileFilter })

module.exports = { upload }