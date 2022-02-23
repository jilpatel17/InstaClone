const multer = require('multer')

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "_" + file.originalname)
    }
})

const upload = multer({ storage: imageStorage })

module.exports = upload