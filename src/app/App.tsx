import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthScreen } from './components/AuthScreen';
import { MapScreen } from './components/MapScreen';
import { ARCameraScreen } from './components/ARCameraScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Map, Person } from '@mui/icons-material';
import { Toaster } from 'sonner';
import { Usuario } from './services/api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Indigo moderno
    },
    secondary: {
      main: '#ec4899', // Rosa vibrante
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

type Screen = 'auth' | 'map' | 'camera' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<Usuario | null>(null);
  const [bottomNavValue, setBottomNavValue] = useState(0);

  // Recuperar sesión al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('loromon_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setCurrentScreen('map');
    }
  }, []);

  const handleLogin = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem('loromon_user', JSON.stringify(userData));
    setCurrentScreen('map');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loromon_user');
    setCurrentScreen('auth');
    setBottomNavValue(0);
  };

  const handleOpenCamera = () => {
    setCurrentScreen('camera');
  };

  const handleCapture = () => {
    setCurrentScreen('map');
  };

  const handleCloseCamera = () => {
    setCurrentScreen('map');
  };

  const handleBottomNavChange = (_: any, newValue: number) => {
    setBottomNavValue(newValue);
    if (newValue === 0) setCurrentScreen('map');
    if (newValue === 1) setCurrentScreen('profile');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" richColors />
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!user && currentScreen === 'auth' && (
          <AuthScreen onLogin={handleLogin} />
        )}

        {user && currentScreen === 'map' && (
          <>
            <MapScreen onOpenCamera={handleOpenCamera} user={user} />
            <Paper
              sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
              elevation={3}
            >
              <BottomNavigation
                value={bottomNavValue}
                onChange={handleBottomNavChange}
                showLabels
              >
                <BottomNavigationAction label="Mapa" icon={<Map />} />
                <BottomNavigationAction label="Perfil" icon={<Person />} />
              </BottomNavigation>
            </Paper>
          </>
        )}

        {user && currentScreen === 'camera' && (
          <ARCameraScreen onCapture={handleCapture} onClose={handleCloseCamera} />
        )}

        {user && currentScreen === 'profile' && (
          <>
            <ProfileScreen onLogout={handleLogout} user={user} />
            <Paper
              sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
              elevation={3}
            >
              <BottomNavigation
                value={bottomNavValue}
                onChange={handleBottomNavChange}
                showLabels
              >
                <BottomNavigationAction label="Mapa" icon={<Map />} />
                <BottomNavigationAction label="Perfil" icon={<Person />} />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}