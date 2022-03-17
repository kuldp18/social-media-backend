const express = require('express');
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getFollowingPosts,
  updateCaption,
  commentOnPost,
  deleteComment,
} = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/post/upload', isAuthenticated, createPost);
router.post('/post/like/:id', isAuthenticated, likeAndUnlikePost);
router.delete('/post/delete/:id', isAuthenticated, deletePost);
router.put('/post/update/:id', isAuthenticated, updateCaption);
router.get('/posts/following', isAuthenticated, getFollowingPosts);
router.put('/post/comment/:id', isAuthenticated, commentOnPost);
router.delete('/post/comment/:id', isAuthenticated, deleteComment);
module.exports = router;
