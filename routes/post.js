const express = require('express');
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
} = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/post/upload', isAuthenticated, createPost);
router.post('/post/like/:id', isAuthenticated, likeAndUnlikePost);
router.delete('/post/delete/:id', isAuthenticated, deletePost);
module.exports = router;
