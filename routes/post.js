const express = require('express');
const { createPost } = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/post/upload', isAuthenticated, createPost);

module.exports = router;
