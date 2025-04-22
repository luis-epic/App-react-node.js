import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserItem from './UserItem';
import { User } from '../types';

interface UserListProps {
  users: User[];
  onDeleteUser: (id: number) => void;
  onEditUser: (user: User) => void;
  onAddUser: () => void;
  onRefresh: () => void;
  onToggleUserStatus: (id: number, isActive: boolean) => void;
  isLoading?: boolean;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  onDeleteUser, 
  onEditUser, 
  onAddUser,
  onRefresh,
  onToggleUserStatus,
  isLoading = false 
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; userId: number | null }>({
    open: false,
    userId: null
  });

  const itemsPerPage = 5;

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDeleteClick = (userId: number) => {
    setDeleteConfirmation({ open: true, userId });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.userId) {
      onDeleteUser(deleteConfirmation.userId);
    }
    setDeleteConfirmation({ open: false, userId: null });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Lista de Usuarios
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          <Tooltip title="Refrescar lista">
            <IconButton 
              onClick={onRefresh}
              disabled={isLoading}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddUser}
            color="primary"
          >
            Nuevo Usuario
          </Button>
        </Box>
      </Box>

      <Fade in={!isLoading}>
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: 'transparent',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {displayedUsers.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography color="text.secondary">
                {searchTerm 
                  ? 'No se encontraron usuarios que coincidan con la búsqueda'
                  : 'No hay usuarios registrados'}
              </Typography>
            </Box>
          ) : (
            <List>
              {displayedUsers.map((user) => (
                <UserItem
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteClick}
                  onEdit={onEditUser}
                  onToggleStatus={onToggleUserStatus}
                />
              ))}
            </List>
          )}
        </Paper>
      </Fade>

      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 3,
          pb: 2
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, userId: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmation({ open: false, userId: null })}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList; 