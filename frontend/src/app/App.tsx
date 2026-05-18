import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthScreen } from './components/AuthScreen';
import { MapScreen } from './components/MapScreen';
import { ARCameraScreen } from './components/ARCameraScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Map, Person } from '@mui/icons-material';
import { Toaster, toast } from 'sonner';
import { Usuario, Lugar, api } from './services/api';
import { useGeolocation } from './hooks/useGeolocation';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // Indigo 600 - Pasa ratio 4.5:1 sobre #e0e7ff y blanco
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' },
      },
    },
  },
});

type Screen = 'auth' | 'map' | 'camera' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<Usuario | null>(null);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [currentLugar, setCurrentLugar] = useState<Lugar | null>(null);

  const { latitude, longitude, error: locationError } = useGeolocation();

  // Sincronizar el color del body con la pantalla actual para iOS
  useEffect(() => {
    if (currentScreen === 'auth') {
      // Color sólido original para el Login
      document.body.style.backgroundColor = '#6366f1';
      document.body.style.background = '#6366f1';
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#6366f1');
    } else if (currentScreen === 'profile') {
      // Técnica definitiva para iOS: html = arriba, body = abajo
      document.documentElement.style.backgroundColor = '#6366f1';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.background = '#f8fafc';
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#6366f1');
    } else {
      document.documentElement.style.backgroundColor = '#f8fafc';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.background = '#f8fafc';
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f8fafc');
    }
  }, [currentScreen]);

  // Función para sincronizar los puntos del usuario desde el ranking
  const refreshUserPoints = async (currentUser: Usuario) => {
    try {
      console.log('Sincronizando puntos para:', currentUser.nombre_usuario);
      const ranking = await api.getRanking();
      console.log('Ranking recibido:', ranking);
      
      const userInRanking = ranking.find(r => 
        r.nombre_usuario.toLowerCase() === currentUser.nombre_usuario.toLowerCase()
      );
      
      console.log('Usuario encontrado en ranking:', userInRanking);

      if (userInRanking) {
        console.log('Actualizando puntos a:', userInRanking.puntos);
        const updatedUser = { ...currentUser, puntos: userInRanking.puntos };
        setUser(updatedUser);
        localStorage.setItem('loromon_user', JSON.stringify(updatedUser));
      } else {
        console.warn('El usuario no se encontró en el ranking actual.');
      }
    } catch (error) {
      console.error('Error al sincronizar puntos:', error);
    }
  };

  useEffect(() => {
    if (locationError && user) {
      toast.error(locationError, { id: 'location-error' });
    }
  }, [locationError, user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('loromon_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setCurrentScreen('map');
      // Sincronizar puntos al cargar la app
      refreshUserPoints(parsedUser);
    }
  }, []);

  const handleLogin = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem('loromon_user', JSON.stringify(userData));
    setCurrentScreen('map');
    refreshUserPoints(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loromon_user');
    setCurrentScreen('auth');
    setBottomNavValue(0);
  };

  const handleOpenCamera = (lugar: Lugar) => {
    setCurrentLugar(lugar);
    setCurrentScreen('camera');
  };

  const handleCapture = (puntosObtenidos: number) => {
    setCurrentScreen('map');
    if (user) {
      toast.success(`¡Has ganado ${puntosObtenidos} puntos!`);
      refreshUserPoints(user);
    }
  };

  const handleCloseCamera = () => setCurrentScreen('map');

  const handleBottomNavChange = (_: any, newValue: number) => {
    setBottomNavValue(newValue);
    if (newValue === 0) {
      setCurrentScreen('map');
      if (user) refreshUserPoints(user);
    }
    if (newValue === 1) {
      setCurrentScreen('profile');
      if (user) refreshUserPoints(user);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" richColors />
      
      <Box sx={{ 
        height: '100dvh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: (currentScreen === 'auth') ? '#6366f1' : 'background.default',
        overflow: 'hidden'
      }}>
        
        {/* Área de Contenido Principal */}
        <Box 
          component="main"
          sx={{ 
            flex: 1, 
            position: 'relative', 
            overflowY: (currentScreen === 'profile' || currentScreen === 'auth') ? 'auto' : 'hidden' 
          }}
        >
          {!user && currentScreen === 'auth' && (
            <AuthScreen onLogin={handleLogin} />
          )}

          {user && currentScreen === 'map' && (
            <MapScreen 
              onOpenCamera={handleOpenCamera} 
              user={user} 
              location={{ latitude, longitude }} 
            />
          )}

          {user && currentScreen === 'camera' && currentLugar && (
            <ARCameraScreen 
              onCapture={handleCapture} 
              onClose={handleCloseCamera} 
              user={user}
              lugar={currentLugar}
            />
          )}

          {user && currentScreen === 'profile' && (
            <ProfileScreen onLogout={handleLogout} user={user} />
          )}
        </Box>

        {/* Menú de Navegación Inferior (Solo visible si hay usuario y no está en cámara) */}
        {user && currentScreen !== 'auth' && currentScreen !== 'camera' && (
          <Paper 
            component="nav"
            elevation={10} 
            sx={{ 
              borderRadius: 0, 
              pb: 'env(safe-area-inset-bottom)',
              bgcolor: 'background.paper',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              '& .MuiBottomNavigation-root': {
                bgcolor: 'background.paper'
              }
            }}
          >
            <BottomNavigation
              value={bottomNavValue}
              onChange={handleBottomNavChange}
              showLabels
              sx={{ height: 65 }}
            >
              <BottomNavigationAction label="Mapa" icon={<Map />} />
              <BottomNavigationAction label="Perfil" icon={<Person />} />
            </BottomNavigation>
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
}
