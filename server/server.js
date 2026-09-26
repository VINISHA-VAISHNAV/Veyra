require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');
const seedDatabase = require('./utils/seed');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'VEYRA E-Commerce API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/veyra';

// Connect to MongoDB and start HTTP Server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('--------------------------------------------------');
    console.log(' VEYRA — A smarter way to shop.');
    console.log(' Connected successfully to MongoDB Database.');
    console.log('--------------------------------------------------');

    // Run database seeder
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`[VEYRA Server] Listening on port ${PORT}`);
      console.log(`[VEYRA API] http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('[VEYRA Server Error] MongoDB connection failed:', err.message);
    console.error('Please verify your MONGODB_URI in server/.env');
  });

module.exports = app;
