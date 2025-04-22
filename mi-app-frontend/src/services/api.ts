import axios, { AxiosError } from 'axios';
import { User } from '../types';

/**
 * URL base de la API
 * @constant
 */
const API_URL = 'http://localhost:3001/api';

/**
 * Instancia de axios configurada
 * @constant
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para manejar errores globalmente
 * @function
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const status = error.response.status;
      const data = error.response.data as any;
      
      let errorMessage = 'Error en la operación';
      
      switch (status) {
        case 400:
          errorMessage = data.message || 'Solicitud inválida';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = data.message || 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${status}: ${data.message || 'Error desconocido'}`;
      }
      
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return Promise.reject(new Error('No se pudo conectar con el servidor. Por favor, verifique su conexión.'));
    } else {
      // Algo sucedió al configurar la solicitud
      return Promise.reject(new Error('Error al configurar la solicitud'));
    }
  }
);

/**
 * Servicio para manejar las operaciones de usuarios
 * @namespace
 */
export const userService = {
  /**
   * Obtiene todos los usuarios
   * @async
   * @returns {Promise<User[]>} Lista de usuarios
   * @throws {Error} Si hay un error al obtener los usuarios
   */
  async getAll(): Promise<User[]> {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por su ID
   * @async
   * @param {number} id - ID del usuario
   * @returns {Promise<User>} Usuario encontrado
   * @throws {Error} Si hay un error al obtener el usuario
   */
  async getById(id: number): Promise<User> {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo usuario
   * @async
   * @param {Omit<User, 'id'>} user - Datos del usuario a crear
   * @returns {Promise<User>} Usuario creado
   * @throws {Error} Si hay un error al crear el usuario
   */
  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const response = await api.post('/usuarios', user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Actualiza un usuario existente
   * @async
   * @param {number} id - ID del usuario a actualizar
   * @param {Partial<User>} user - Datos a actualizar
   * @returns {Promise<User>} Usuario actualizado
   * @throws {Error} Si hay un error al actualizar el usuario
   */
  async update(id: number, user: Partial<User>): Promise<User> {
    try {
      const response = await api.put(`/usuarios/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un usuario
   * @async
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise<void>}
   * @throws {Error} Si hay un error al eliminar el usuario
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cambia el estado de un usuario
   * @async
   * @param {number} id - ID del usuario
   * @param {boolean} isActive - Nuevo estado
   * @returns {Promise<User>} Usuario actualizado
   * @throws {Error} Si hay un error al cambiar el estado
   */
  async toggleStatus(id: number, isActive: boolean): Promise<User> {
    try {
      const response = await api.put(`/usuarios/${id}`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`Error toggling status for user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Prueba la conexión con el servidor
   * @async
   * @returns {Promise<boolean>} true si la conexión es exitosa
   * @throws {Error} Si hay un error al conectar con el servidor
   */
  async testConnection(): Promise<boolean> {
    try {
      await api.get('/usuarios');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
};

export default userService; 