const express = require('express');
const { createPost, likeAndUnlikePost } = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/post/upload', isAuthenticated, createPost);
router.post('/post/like/:id', isAuthenticated, likeAndUnlikePost);
module.exports = router;
