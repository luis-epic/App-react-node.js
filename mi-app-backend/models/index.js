// --- models/index.js ---
// Configuración de Sequelize y definición de modelos

const { Sequelize } = require('sequelize');

// --- ¡IMPORTANTE! ---
// Reemplaza con tus propias credenciales de base de datos PostgreSQL
// Asegúrate de que la base de datos 'gestion_usuarios_db' exista
const DB_NAME = 'gestion_usuarios_db';
const DB_USER = 'postgres'; // Usuario por defecto de PostgreSQL
const DB_PASSWORD = 'tu_password_aqui'; // Cambia esto por tu contraseña
const DB_HOST = 'localhost'; // O la dirección de tu servidor de BD
const DB_PORT = 5432; // Puerto por defecto de PostgreSQL

// Crea una instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres', // Especifica que usaremos PostgreSQL
  logging: false, // Desactiva los logs de SQL en la consola (puedes activarlo para depurar)
  pool: { // Configuración opcional del pool de conexiones
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Objeto para almacenar los modelos
const db = {};

db.Sequelize = Sequelize; // Exporta la clase Sequelize
db.sequelize = sequelize; // Exporta la instancia configurada

// Importa y define el modelo User
db.User = require('./user.model.js')(sequelize, Sequelize);

// Aquí podrías definir relaciones entre modelos si tuvieras más
// Ejemplo: db.Post.belongsTo(db.User); db.User.hasMany(db.Post);

module.exports = db; // Exporta el objeto db con la instancia y los modelos