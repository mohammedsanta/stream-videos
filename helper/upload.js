const { GridFsStorage } = require('multer-gridfs-storage')
const multer = require('multer');

const upload = () => {

    const storage = new GridFsStorage({
        url: 'mongodb://127.0.0.1:27017/videos',
        file: (req,file) => {
            return new Promise((resolve,reject) => {
                const fileInfo = {
                    filename: file.originalname.split('.')[0]
                }
                console.log(fileInfo)
                resolve(fileInfo);
            })
        }
    })

    return multer({ storage });
}

module.exports = { upload }