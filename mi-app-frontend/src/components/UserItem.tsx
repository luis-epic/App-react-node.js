import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  useTheme,
  Switch
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { User } from '../types';

/**
 * Props para el componente UserItem
 * @interface UserItemProps
 * @property {User} user - Datos del usuario a mostrar
 * @property {function} onDelete - Función para manejar la eliminación del usuario
 * @property {function} onEdit - Función para manejar la edición del usuario
 * @property {function} onToggleStatus - Función para manejar el cambio de estado del usuario
 */
interface UserItemProps {
  user: User;
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
}

/**
 * Obtiene el color correspondiente al rol del usuario
 * @param {string} role - Rol del usuario
 * @returns {string} Color de Material-UI
 */
const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'error';
    case 'editor':
      return 'primary';
    case 'user':
      return 'success';
    default:
      return 'default';
  }
};

/**
 * Obtiene la etiqueta en español para el rol del usuario
 * @param {string} role - Rol del usuario
 * @returns {string} Etiqueta en español del rol
 */
const getRoleLabel = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'Administrador';
    case 'editor':
      return 'Editor';
    case 'user':
      return 'Usuario';
    default:
      return role;
  }
};

/**
 * Formatea la fecha en formato localizado
 * @param {string} dateString - Fecha en formato string
 * @returns {string} Fecha formateada
 */
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return 'Fecha no disponible';
  }
};

/**
 * Componente que representa un elemento de usuario en la lista
 * @component
 * @param {UserItemProps} props - Props del componente
 * @returns {JSX.Element} Elemento de usuario
 */
const UserItem: React.FC<UserItemProps> = ({ user, onDelete, onEdit, onToggleStatus }) => {
  const theme = useTheme();
  const formattedDate = formatDate(user.createdAt || '');

  /**
   * Maneja el cambio de estado del usuario
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio
   */
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user.id) {
      event.preventDefault();
      onToggleStatus(user.id, event.target.checked);
    }
  };

  return (
    <ListItem
      sx={{
        mb: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: theme.shadows[1],
        transition: 'all 0.2s ease-in-out',
        opacity: user.isActive ? 1 : 0.7,
        '&:hover': {
          bgcolor: 'action.hover',
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <PersonIcon color="action" sx={{ fontSize: 32 }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 0.5 }}>
            <Typography 
              variant="subtitle1" 
              component="div"
              sx={{ fontWeight: 500 }}
            >
              {user.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              component="div"
            >
              {user.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip
              label={getRoleLabel(user.role)}
              size="small"
              color={getRoleColor(user.role)}
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={user.isActive ? 'Activo' : 'Inactivo'}
              size="small"
              color={user.isActive ? 'success' : 'default'}
              sx={{ fontWeight: 500 }}
            />
            <Typography 
              variant="caption" 
              color="text.secondary"
              component="span"
            >
              Creado el {formattedDate}
            </Typography>
          </Box>
        </Box>
      </Box>
      <ListItemSecondaryAction>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}>
            <Switch
              edge="end"
              checked={user.isActive}
              onChange={handleStatusChange}
              color="success"
            />
          </Tooltip>
          <Tooltip title="Editar usuario">
            <IconButton
              edge="end"
              aria-label="editar usuario"
              onClick={() => onEdit(user)}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar usuario">
            <IconButton
              edge="end"
              aria-label="eliminar usuario"
              onClick={() => user.id && onDelete(user.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default UserItem; 