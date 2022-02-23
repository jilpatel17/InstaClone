const express = require('express')
const getUserName = require('../middleware/getUserName')
const postController = require('../controller/postController')
const user = require('../models/user');

// initialized route
const route = express.Router()

route.post("/", getUserName, postController)

route.get("/:id", async(req, res) => {
    let userData = await user.findOne({ _id: req.params.id });
    res.json(userData);
});


module.exports = route