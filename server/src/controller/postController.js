const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const post = require('../models/post');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const postController = async(req, res) => {
    try {
        const data = req.body;
        let files = req.files.photo;
        console.log(`File : ${files}`);
        const length = files.length;
        if (length) {
            let postImages = [];
            for (i = 0; i < length; i++) {
                await cloudinary.uploader.upload(files[i].tempFilePath, (err, result) => {
                    if (result) {
                        postImages.push(result.secure_url)
                    }
                    if (err) {
                        console.log(err);
                        res.json({ success: 0, error: err });
                    }
                })

<<<<<<< HEAD
            const result = new post({
                postBy: data.user._id,
                location: data.location,
                postDescription: data.description,
                post: postImages
            });
=======
                const result = new post({
                    postBy: req.user._id,
                    location: data.location,
                    postDescription: data.description,
                    post: postImages
                });
>>>>>>> 7574e8fd3f2578cd07ae3affaf68e26769a44fff

                await result.save();
                res.json({ success: 1 });
            }
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = postController;