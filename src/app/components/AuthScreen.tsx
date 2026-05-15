import { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { 
  Error as ErrorIcon, 
  Visibility, 
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  PersonOutline
} from '@mui/icons-material';
import { api } from '../services/api';
import { toast } from 'sonner';

interface AuthScreenProps {
  onLogin: (user: any) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setGeneralError('');
  };

  const validateInputs = () => {
    clearErrors();
    let isValid = true;

    // Sanitización básica para prevenir XSS en campos de texto
    const sanitize = (text: string) => text.replace(/[<>]/g, '');

    const sanitizedEmail = sanitize(email.trim());
    const sanitizedUsername = sanitize(username.trim());

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail) {
      setEmailError('El correo es obligatorio.');
      isValid = false;
    } else if (sanitizedEmail.length > 100) {
      setEmailError('Máximo 100 caracteres.');
      isValid = false;
    } else if (!emailRegex.test(sanitizedEmail)) {
      setEmailError('Ingresa un correo válido.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Mínimo 8 caracteres.');
      isValid = false;
    } else if (password.length > 64) {
      setPasswordError('Máximo 64 caracteres.');
      isValid = false;
    }

    if (!isLogin) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!sanitizedUsername) {
        setUsernameError('El usuario es obligatorio.');
        isValid = false;
      } else if (sanitizedUsername.length < 3) {
        setUsernameError('Mínimo 3 caracteres.');
        isValid = false;
      } else if (sanitizedUsername.length > 30) {
        setUsernameError('Máximo 30 caracteres.');
        isValid = false;
      } else if (!usernameRegex.test(sanitizedUsername)) {
        setUsernameError('Solo letras, números y guiones bajos (_).');
        isValid = false;
      }
    }

    // Actualizamos los estados con los valores limpios
    setEmail(sanitizedEmail);
    if (!isLogin) setUsername(sanitizedUsername);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const user = await api.login({ correo: email.trim(), contrasena: password });
        toast.success(`¡Bienvenido de nuevo, ${user.nombre_usuario}!`);
        onLogin(user);
      } else {
        await api.register({
          nombre_usuario: username.trim(),
          correo: email.trim(),
          contrasena: password,
        });
        toast.success('¡Cuenta creada con éxito!');
        setIsLogin(true);
        clearErrors();
      }
    } catch (err: any) {
      setGeneralError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        pt: 'env(safe-area-inset-top)',
        pb: 'env(safe-area-inset-bottom)',
        px: 2,
        overflowY: 'auto'
      }}
    >
      <Container 
        disableGutters
        maxWidth={false} 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          width: '100%',
          maxWidth: { xs: '100%', sm: '450px', md: '500px' }
        }}
      >
        <Card
          elevation={10}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 3, sm: 4 },
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            width: '100%'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800, 
                color: 'primary.main',
                mb: 1,
                letterSpacing: -1,
                fontSize: { xs: '2.5rem', sm: '3rem' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <span>🦜</span> Loromon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {isLogin ? '¡Captúralos a todos en tu facultad!' : 'Únete a la aventura de LoroMon'}
            </Typography>
          </Box>

          {generalError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {generalError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              {!isLogin && (
                <TextField
                  label="Nombre de usuario"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!usernameError}
                  helperText={usernameError || "Usa entre 3 y 30 letras, números o guiones bajos."}
                  disabled={loading}
                  autoComplete="username"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline color={usernameError ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                    },
                    htmlInput: {
                      maxLength: 30
                    }
                  }}
                />
              )}

              <TextField
                label="Correo electrónico"
                placeholder="ejemplo@correo.com"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                disabled={loading}
                autoComplete="email"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color={emailError ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: {
                    maxLength: 100
                  }
                }}
              />

              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError || (!isLogin ? "Debe tener entre 8 y 64 caracteres." : "")}
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color={passwordError ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                  htmlInput: {
                    maxLength: 64
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 2, 
                  py: 1.8, 
                  borderRadius: 3,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
                }}
              >
                {loading ? 'Cargando...' : (isLogin ? 'Iniciar sesión' : 'Registrarme')}
              </Button>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="text"
                  disabled={loading}
                  onClick={() => {
                    setIsLogin(!isLogin);
                    clearErrors();
                  }}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 600,
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': { 
                      textDecoration: 'underline',
                      bgcolor: 'transparent',
                      color: 'primary.dark'
                    }
                  }}
                >
                  {isLogin ? '¿Eres nuevo? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
