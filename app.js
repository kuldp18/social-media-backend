const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'config/config.env' });
}

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const postRoutes = require('./routes/post');

// using routes
app.use('/api', post);
module.exports = app;
