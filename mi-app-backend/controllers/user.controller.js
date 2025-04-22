// --- controllers/user.controller.js ---
// Lógica de negocio (controladores) para manejar las solicitudes de las rutas de usuarios

const { User } = require('../models'); // Importa el modelo User desde el index de modelos

// Controlador para crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'El nombre y el email son requeridos.' });
    }

    const newUser = await User.create({ name, email, role });

    res.status(201).json(newUser);

  } catch (error) {
    console.error("Error al crear usuario:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: 'Error de validación.', errors: messages });
    }
    res.status(500).json({ message: 'Ocurrió un error interno al crear el usuario.' });
  }
};

// Controlador para obtener todos los usuarios
exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: 'Ocurrió un error interno al obtener los usuarios.' });
  }
};

// Controlador para obtener un usuario por su ID
exports.findUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` });
    }
    res.status(200).json(user);

  } catch (error) {
    console.error(`Error al obtener usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Ocurrió un error interno al obtener el usuario.' });
  }
};

// Controlador para actualizar un usuario por su ID
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` });
    }

    if (name === "" || email === "") {
      return res.status(400).json({ message: 'El nombre y el email no pueden estar vacíos para actualizar.' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    await user.save();

    res.status(200).json(user);

  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${req.params.id}:`, error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: 'Error de validación al actualizar.', errors: messages });
    }
    res.status(500).json({ message: 'Ocurrió un error interno al actualizar el usuario.' });
  }
};

// Controlador para eliminar un usuario por su ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` });
    }

    await user.destroy();

    res.status(200).json({ message: `Usuario con ID ${userId} eliminado exitosamente.` });

  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Ocurrió un error interno al eliminar el usuario.' });
  }
};