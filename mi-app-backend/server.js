// --- server.js ---
// Punto de entrada principal para la aplicación backend

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Importa la instancia de Sequelize y modelos
const userRoutes = require('./routes/user.routes'); // Importa las rutas de usuario

const app = express();
const PORT = process.env.PORT || 3001; // Puerto para el servidor

// Middleware para CORS
app.use(cors());

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Middleware para parsear datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// Rutas base para las operaciones de usuarios
app.use('/api/usuarios', userRoutes);

// Ruta simple para verificar que el servidor está corriendo
app.get('/api', (req, res) => {
  res.json({ message: '¡Bienvenido a la API de gestión de usuarios!' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ocurrió un error interno en el servidor.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Sincronización con la base de datos y arranque del servidor
sequelize.sync({ alter: true }) // Usar { force: true } solo en desarrollo para recrear tablas
  .then(() => {
    console.log('Base de datos sincronizada.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}.`);
      console.log(`Accede a la API en http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });