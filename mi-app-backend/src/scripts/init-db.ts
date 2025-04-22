import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres', // Conectamos a la base de datos por defecto
  logging: false
});

async function initDatabase() {
  try {
    // Conectamos a la base de datos por defecto
    await sequelize.authenticate();
    console.log('Conexión exitosa a PostgreSQL');

    // Creamos la base de datos si no existe
    await sequelize.query(`CREATE DATABASE ${process.env.DB_NAME} WITH OWNER = ${process.env.DB_USER} ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' TEMPLATE template0;`)
      .catch(err => {
        if (err.message.includes('already exists')) {
          console.log(`La base de datos ${process.env.DB_NAME} ya existe`);
        } else {
          throw err;
        }
      });

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

initDatabase(); 