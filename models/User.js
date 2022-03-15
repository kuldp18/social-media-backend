const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name.'],
  },
  avatar: {
    public_id: String,
    url: String,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email.'],
    unique: [true, 'Given email already exists.'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minlength: [6, 'Password must be atleast 6 characters long.'],
    select: false,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
