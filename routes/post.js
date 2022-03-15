const express = require('express');
const { createPost } = require('../controllers/post');
const router = express.Router();

router.post('/post/upload', createPost);

module.exports = router;
