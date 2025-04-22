"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// Función para crear usuarios de prueba
const createInitialUsers = async () => {
    try {
        const usersCount = await User_1.default.count();
        if (usersCount === 0) {
            await User_1.default.bulkCreate([
                {
                    name: 'Admin Usuario',
                    email: 'admin@example.com',
                    role: 'admin'
                },
                {
                    name: 'Editor Usuario',
                    email: 'editor@example.com',
                    role: 'editor'
                },
                {
                    name: 'Usuario Normal',
                    email: 'user@example.com',
                    role: 'user'
                }
            ]);
            console.log('Usuarios de prueba creados exitosamente');
        }
    }
    catch (error) {
        console.error('Error al crear usuarios de prueba:', error);
    }
};
// Crear usuarios de prueba al iniciar
createInitialUsers();
// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User_1.default.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    }
    catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
});
// POST /api/users - Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        // Validaciones básicas
        if (!name || !email) {
            return res.status(400).json({
                message: 'Nombre y email son requeridos'
            });
        }
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: 'Ya existe un usuario con ese email'
            });
        }
        const user = await User_1.default.create({
            name,
            email,
            role: role || 'user'
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({
            message: 'Error al crear usuario',
            error: error.message
        });
    }
});
// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        // Validaciones básicas
        if (!name || !email) {
            return res.status(400).json({
                message: 'Nombre y email son requeridos'
            });
        }
        const user = await User_1.default.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }
        // Verificar si el nuevo email ya existe en otro usuario
        if (email !== user.email) {
            const existingUser = await User_1.default.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Ya existe un usuario con ese email'
                });
            }
        }
        await user.update({ name, email, role });
        res.json(user);
    }
    catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(400).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
});
// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }
        await user.destroy();
        res.status(204).send();
    }
    catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
});
exports.default = router;
