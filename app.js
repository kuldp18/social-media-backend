const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'config/.env' });
}

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// routes
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

// using routes
app.use('/api', postRoutes);
app.use('/api', userRoutes);
module.exports = app;
