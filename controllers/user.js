const User = require('../models/User');
const Post = require('../models/Post');
const { sendEmail } = require('../middlewares/sendResetEmail');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });

    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: 'sample_id',
        url: 'sample-url',
      },
    });

    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(201).cookie('token', token, options).json({
      success: true,
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password!',
      });
    }

    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie('token', token, options).json({
      success: true,
      message: 'User logged in successfully',
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
    res.status(200).cookie('token', '', options).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.followAndUnfollowUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (userToFollow.id === loggedInUser.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexFollowing, 1);
      userToFollow.followers.splice(indexFollowers, 1);
      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: 'User unfollowed successfully',
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: 'User followed successfully',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both old and new password',
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from old password',
      });
    }
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect old password',
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, email } = req.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    // TODO: update avatar

    await user.save();
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userId = user._id;
    const following = user.following;
    const posts = user.posts;
    await user.remove();

    // remove user id from followers and following
    for (let i = 0; i < following.length; i++) {
      const user = await User.findById(following[i]);
      const followersIndex = user.followers.indexOf(userId);
      const followingIndex = user.following.indexOf(userId);
      user.followers.splice(followersIndex, 1);
      user.following.splice(followingIndex, 1);
      await user.save();
    }

    // logout user after deleting profile
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
    res.cookie('token', '', options);

    if (posts.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        const post = await Post.findById(posts[i]);
        await post.remove();
      }
    }
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// view profile
exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('posts');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get profile by user id
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('posts');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email',
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetPasswordToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/reset/password/${resetPasswordToken}`;

    function capitalize(str) {
      const lower = str.toLowerCase();
      return str.charAt(0).toUpperCase() + lower.slice(1);
    }

    const resetMessage = `${capitalize(
      user.name
    )}, you are receiving this email because you (or someone else) has requested to reset your password. Reset your account password here: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset Password',
        message: resetMessage,
      });
      res.status(200).json({
        success: true,
        message: `Checkout your email ${user.email} to reset your password!`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({
        success: false,
        message: 'Error sending reset email, please try again',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Password reset token is invalid or has expired',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
