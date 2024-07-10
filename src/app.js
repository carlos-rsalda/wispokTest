const express = require('express');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const swaggerDocs = require('./config/swagger');
const initData = require('./initData'); // Importar initData

const app = express();

// Middleware
app.use(express.json());

// Conectar a la base de datos
connectDB().then(async () => {
  // Inicializar datos básicos después de la conexión a la base de datos
  await initData();
});

// Redirigir a /api-docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Inicializar Swagger
swaggerDocs(app);

module.exports = app;