const express = require('express');
const {
  register,
  login,
  logout,
  followAndUnfollowUser,
} = require('../controllers/user');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/follow/:id', isAuthenticated, followAndUnfollowUser);
module.exports = router;
