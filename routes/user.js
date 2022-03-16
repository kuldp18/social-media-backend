const express = require('express');
const {
  register,
  login,
  followAndUnfollowUser,
} = require('../controllers/user');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/follow/:id', isAuthenticated, followAndUnfollowUser);
module.exports = router;
