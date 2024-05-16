const express = require('express');
const connectDB = require('../helpers/databases/connection'); // Import your database connection function
const authRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');
const articleRoutes = require('./routes/article');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Mount auth routes
app.use('/api/auth', authRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/article', articleRoutes);

module.exports = app;