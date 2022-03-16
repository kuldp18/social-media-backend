const express = require('express');
const {
  register,
  login,
  logout,
  followAndUnfollowUser,
  updatePassword,
  updateProfile,
  deleteProfile,
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
module.exports = router;
