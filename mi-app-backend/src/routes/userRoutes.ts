import { Router } from 'express';
import User from '../models/User';

const router = Router();

// Función para crear usuarios de prueba
const createInitialUsers = async () => {
  try {
    const usersCount = await User.count();
    if (usersCount === 0) {
      await User.bulkCreate([
        {
          name: 'Admin Usuario',
          email: 'admin@example.com',
          role: 'admin',
          isActive: true
        },
        {
          name: 'Editor Usuario',
          email: 'editor@example.com',
          role: 'editor',
          isActive: true
        },
        {
          name: 'Usuario Normal',
          email: 'user@example.com',
          role: 'user',
          isActive: true
        }
      ]);
      console.log('Usuarios de prueba creados exitosamente');
    }
  } catch (error) {
    console.error('Error al crear usuarios de prueba:', error);
  }
};

// Crear usuarios de prueba al iniciar
createInitialUsers();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      message: 'Error al obtener usuarios',
      error: error.message 
    });
  }
});

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    // Validaciones básicas
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Nombre y email son requeridos' 
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Ya existe un usuario con ese email' 
      });
    }

    const user = await User.create({
      name,
      email,
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error('Error al crear usuario:', error);
    res.status(400).json({ 
      message: 'Error al crear usuario',
      error: error.message 
    });
  }
});

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar el usuario
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    // Si se está actualizando el email, verificar que no exista
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: updateData.email } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Ya existe un usuario con ese email' 
        });
      }
    }

    // Si se está actualizando el nombre o email, verificar que no estén vacíos
    if (updateData.name === '' || updateData.email === '') {
      return res.status(400).json({ 
        message: 'El nombre y el email no pueden estar vacíos' 
      });
    }

    // Actualizar solo los campos proporcionados
    await user.update(updateData);
    res.json(user);
  } catch (error: any) {
    console.error('Error al actualizar usuario:', error);
    res.status(400).json({ 
      message: 'Error al actualizar usuario',
      error: error.message 
    });
  }
});

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      message: 'Error al eliminar usuario',
      error: error.message 
    });
  }
});

export default router; 