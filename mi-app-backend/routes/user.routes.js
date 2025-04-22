// --- routes/user.routes.js ---
// Definición de las rutas Express para las operaciones CRUD de usuarios

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Importa el controlador

// --- Definición de Rutas CRUD ---

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', userController.createUser);

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', userController.findAllUsers);

// GET /api/usuarios/:id - Obtener un usuario por su ID
router.get('/:id', userController.findUserById);

// PUT /api/usuarios/:id - Actualizar un usuario por su ID
router.put('/:id', userController.updateUser);

// DELETE /api/usuarios/:id - Eliminar un usuario por su ID
router.delete('/:id', userController.deleteUser);

module.exports = router; // Exporta el router con las rutas definidas
