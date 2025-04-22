// --- models/user.model.js ---
// Definición del modelo Sequelize para la tabla 'users'

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      // ID (Clave primaria) - Sequelize lo añade por defecto, pero lo definimos explícitamente
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      // Nombre del usuario
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre no puede estar vacío."
          }
        }
      },
      // Email del usuario
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Este email ya está registrado."
        },
        validate: {
          isEmail: {
            msg: "Debe proporcionar un email válido."
          },
          notEmpty: {
            msg: "El email no puede estar vacío."
          }
        }
      },
      // Rol del usuario
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
          isIn: {
            args: [['admin', 'editor', 'user']],
            msg: "El rol debe ser 'admin', 'editor' o 'user'"
          }
        }
      }
    }, {
      // Opciones adicionales del modelo
      tableName: 'users',
      timestamps: true
    });
  
    return User;
  };