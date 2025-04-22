# Sistema de Gestión de Usuarios

Un sistema completo de gestión de usuarios desarrollado con React, TypeScript, Material-UI en el frontend y Node.js, Express, PostgreSQL en el backend.

## 🚀 Características

- **Gestión de Usuarios**
  - Crear, leer, actualizar y eliminar usuarios (CRUD)
  - Activar/desactivar usuarios
  - Asignar roles (Administrador, Editor, Usuario)
  - Validación de datos en tiempo real

- **Interfaz de Usuario**
  - Diseño moderno y responsivo con Material-UI
  - Búsqueda de usuarios en tiempo real
  - Paginación de resultados
  - Notificaciones de acciones
  - Confirmación de eliminación

- **Seguridad**
  - Validación de datos en frontend y backend
  - Manejo de errores robusto
  - Protección contra inyección SQL

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript
- Material-UI
- Axios
- React Router DOM
- Vite

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- CORS

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/sistema-gestion-usuarios.git
   cd sistema-gestion-usuarios
   ```

2. **Configurar el Backend**
   ```bash
   cd mi-app-backend
   npm install
   ```

3. **Configurar la Base de Datos**
   - Crear una base de datos PostgreSQL llamada `user_management`
   - Configurar las variables de entorno en `.env`:
     ```
     PORT=3001
     DB_HOST=localhost
     DB_USER=postgres
     DB_PASSWORD=tu_contraseña
     DB_NAME=user_management
     NODE_ENV=development
     ```

4. **Inicializar la Base de Datos**
   ```bash
   npm run init-db
   ```

5. **Configurar el Frontend**
   ```bash
   cd ../mi-app-frontend
   npm install
   ```

## 🚀 Ejecución

1. **Iniciar el Backend**
   ```bash
   cd mi-app-backend
   npm run dev
   ```

2. **Iniciar el Frontend**
   ```bash
   cd mi-app-frontend
   npm start
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## 📁 Estructura del Proyecto

```
sistema-gestion-usuarios/
├── mi-app-frontend/          # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Servicios API
│   │   ├── types/          # Definiciones TypeScript
│   │   └── App.tsx         # Componente principal
│   └── package.json
│
└── mi-app-backend/           # Backend Node.js
    ├── src/
    │   ├── config/         # Configuración
    │   ├── controllers/    # Controladores
    │   ├── models/         # Modelos Sequelize
    │   ├── routes/         # Rutas API
    │   └── server.ts       # Punto de entrada
    └── package.json
```

## 🔍 API Endpoints

- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener un usuario específico
- `POST /api/usuarios` - Crear un nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar un usuario
- `DELETE /api/usuarios/:id` - Eliminar un usuario

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Características Futuras

- [ ] Autenticación y autorización
- [ ] Recuperación de contraseña
- [ ] Perfiles de usuario
- [ ] Historial de cambios
- [ ] Exportación de datos
- [ ] Filtros avanzados
- [ ] Temas personalizables

## 📧 Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/tu-usuario/sistema-gestion-usuarios](https://github.com/tu-usuario/sistema-gestion-usuarios) 