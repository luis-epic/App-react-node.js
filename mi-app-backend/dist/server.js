"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const database_1 = require("./config/database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas
app.use('/api/users', userRoutes_1.default);
// Verificar conexión a la base de datos y sincronizar modelos
database_1.sequelize.sync({ force: false })
    .then(() => {
    console.log('Base de datos conectada y sincronizada');
})
    .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
