const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { initGridFS } = require('./config/gridfs');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

require('dotenv').config();

const app = express();

// Connect to Database and Initialize GridFS
const startApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Initialize GridFS
    await initGridFS();
    console.log('✅ GridFS initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    process.exit(1);
  }
};

startApp();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));


// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Stricter rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 authentication attempts
  message: 'Too many authentication attempts, please try again later'
});
app.use('/api/auth', authLimiter);

// Stricter rate limiter for file uploads
const fileUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: 'Too many uploads from this IP, please try again later'
});
app.use('/api/files/upload', fileUploadLimiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' })); // Increased for file metadata
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth routes
app.use('/api/auth', authRoutes);

// File routes
app.use('/api/files', fileRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Handle Mongoose Duplicate Key Errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Handle GridFS Errors
  if (err.name === 'GridFSError' || err.message.includes('GridFS')) {
    return res.status(400).json({
      success: false,
      message: 'File storage error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle Multer Errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the limit';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }
    return res.status(400).json({
      success: false,
      message: message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Default Error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;