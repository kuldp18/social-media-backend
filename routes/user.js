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
  getProfileById,
  getAllUsers,
  forgotPassword,
  resetPassword,
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
router.get('/profile/:id', isAuthenticated, getProfileById);
router.get('/users', isAuthenticated, getAllUsers);
router.post('/forgot/password', forgotPassword);
router.put('/reset/password/:token', resetPassword);
module.exports = router;
