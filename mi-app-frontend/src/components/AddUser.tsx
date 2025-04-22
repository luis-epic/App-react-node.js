import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { User } from '../services/api';

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>;
  editUser?: User | null;
  isLoading?: boolean;
}

const initialUserState: User = {
  name: '',
  email: '',
  role: 'user',
};

const AddUser: React.FC<AddUserProps> = ({
  open,
  onClose,
  onSubmit,
  editUser,
  isLoading = false
}) => {
  const [user, setUser] = useState<User>(initialUserState);
  const [errors, setErrors] = useState<Partial<User>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (editUser) {
      setUser(editUser);
    } else {
      setUser(initialUserState);
    }
    setErrors({});
    setSubmitError(null);
  }, [editUser, open]);

  const validateForm = () => {
    const newErrors: Partial<User> = {};
    
    // Validación de nombre
    if (!user.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (user.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (user.name.length > 50) {
      newErrors.name = 'El nombre no puede tener más de 50 caracteres';
    }

    // Validación de email
    if (!user.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Email inválido';
    } else if (user.email.length > 100) {
      newErrors.email = 'El email no puede tener más de 100 caracteres';
    }

    // Validación de rol
    if (!user.role) {
      newErrors.role = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(user);
        onClose();
      } catch (error) {
        setSubmitError('Error al guardar el usuario. Por favor, intente nuevamente.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof User]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setUser((prev) => ({
      ...prev,
      role: e.target.value,
    }));
    if (errors.role) {
      setErrors((prev) => ({
        ...prev,
        role: undefined,
      }));
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={isLoading}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                name="name"
                label="Nombre"
                value={user.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
                disabled={isLoading}
                inputProps={{
                  maxLength: 50
                }}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={user.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
                disabled={isLoading}
                inputProps={{
                  maxLength: 100
                }}
              />
              <FormControl fullWidth required error={!!errors.role} disabled={isLoading}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={user.role}
                  label="Rol"
                  onChange={handleRoleChange}
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="user">Usuario</MenuItem>
                </Select>
                {errors.role && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.role}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={onClose} 
              disabled={isLoading}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {editUser ? 'Guardar Cambios' : 'Agregar Usuario'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={!!submitError}
        autoHideDuration={6000}
        onClose={() => setSubmitError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSubmitError(null)} 
          severity="error" 
          variant="filled"
        >
          {submitError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddUser; 