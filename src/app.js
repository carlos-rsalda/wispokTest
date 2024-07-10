const express = require('express');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const swaggerDocs = require('./config/swagger');
const initData = require('./initData'); 

const app = express();

// Middleware
app.use(express.json());

connectDB().then(async () => {
  await initData();
  });

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

swaggerDocs(app);

module.exports = app;