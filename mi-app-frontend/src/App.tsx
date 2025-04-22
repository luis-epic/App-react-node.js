import React, { useState, useEffect } from 'react';
import { 
  Container, 
  CssBaseline, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Snackbar, 
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddUser from './components/AddUser';
import UserList from './components/UserList';
import { userService } from './services/api';
import { User } from './types';

interface Notification {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeApp = async () => {
    try {
      await userService.testConnection();
      await fetchUsers();
    } catch (err) {
      setError('No se pudo conectar con el servidor. Por favor, verifique que el servidor esté en ejecución.');
      console.error('Connection test failed:', err);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsAddUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsAddUserOpen(true);
  };

  const handleCloseAddUser = () => {
    setIsAddUserOpen(false);
    setEditingUser(null);
  };

  const handleSubmitUser = async (user: User) => {
    try {
      setIsSubmitting(true);
      if (editingUser?.id) {
        await userService.update(editingUser.id, user);
        showNotification('Usuario actualizado exitosamente', 'success');
      } else {
        await userService.create(user);
        showNotification('Usuario creado exitosamente', 'success');
      }
      await fetchUsers();
      handleCloseAddUser();
    } catch (err) {
      setError('Error al guardar el usuario. Por favor, intente nuevamente.');
      console.error('Error saving user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await userService.delete(id);
      showNotification('Usuario eliminado exitosamente', 'success');
      await fetchUsers();
    } catch (err) {
      setError('Error al eliminar el usuario. Por favor, intente nuevamente.');
      console.error('Error deleting user:', err);
    }
  };

  const handleToggleUserStatus = async (id: number, isActive: boolean) => {
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, isActive } : user
        )
      );

      await userService.toggleStatus(id, isActive);
      
      showNotification(
        `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
    } catch (err) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, isActive: !isActive } : user
        )
      );
      
      setError('Error al cambiar el estado del usuario. Por favor, intente nuevamente.');
      console.error('Error toggling user status:', err);
    }
  };

  const handleRetry = () => {
    initializeApp();
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión de Usuarios
          </Typography>
          <Button
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            disabled={loading}
          >
            Actualizar
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 4, 
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Gestión de Usuarios
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    Reintentar
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <UserList
                users={users}
                onDeleteUser={handleDeleteUser}
                onEditUser={handleEditUser}
                onAddUser={handleAddUser}
                onRefresh={fetchUsers}
                onToggleUserStatus={handleToggleUserStatus}
                isLoading={loading}
              />
            )}

            <AddUser
              open={isAddUserOpen}
              onClose={handleCloseAddUser}
              onSubmit={handleSubmitUser}
              editUser={editingUser}
              isLoading={isSubmitting}
            />
          </Box>
        </Container>
      </Box>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
