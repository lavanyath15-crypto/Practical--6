const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve Static Frontend UI & Documentation
app.use(express.static(path.join(__dirname, 'public')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'OK',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    service: 'Student Records REST API',
    database: {
      connected: isConnected,
      state: ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState] || 'Unknown',
      host: mongoose.connection.host || 'none',
      name: mongoose.connection.name || 'none',
    },
  });
});

// API Routes
app.use('/api/students', studentRoutes);

// Fallback for root route if public/index.html is not served
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Student Records RESTful API (Practical 6)',
    version: '1.0.0',
    endpoints: {
      getAllStudents: 'GET /api/students',
      getStudentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
      healthCheck: 'GET /api/health',
    },
    docs: 'Open the root URL / in your browser for the interactive web UI.',
  });
});

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Student Records REST API Server running on port ${PORT}`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Health:    http://localhost:${PORT}/api/health`);
  console.log(` API Docs:  http://localhost:${PORT}/api`);
  console.log(`=================================================`);
});

module.exports = app;
