const express = require('express');
const {
  register,
  login,
  logout,
  followAndUnfollowUser,
  updatePassword,
  updateProfile,
  deleteProfile,
  viewProfile,
} = require('../controllers/user');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/follow/:id', isAuthenticated, followAndUnfollowUser);
router.put('/update/password', isAuthenticated, updatePassword);
router.put('/update/profile', isAuthenticated, updateProfile);
router.delete('/delete/profile', isAuthenticated, deleteProfile);
router.get('/profile', isAuthenticated, viewProfile);
module.exports = router;
