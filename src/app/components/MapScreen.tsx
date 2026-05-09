import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Fab,
  Chip,
  Paper,
} from '@mui/material';
import { CameraAlt, MyLocation } from '@mui/icons-material';
import { Usuario } from '../services/api';

interface MapScreenProps {
  onOpenCamera: () => void;
  user: Usuario;
}

const faculties = [
  { id: 1, name: 'Facultad de Ingeniería', lat: -12.0564, lng: -77.0844 },
  { id: 2, name: 'Facultad de Medicina', lat: -12.0574, lng: -77.0834 },
  { id: 3, name: 'Facultad de Derecho', lat: -12.0554, lng: -77.0854 },
  { id: 4, name: 'Facultad de Economía', lat: -12.0584, lng: -77.0824 },
];

export function MapScreen({ onOpenCamera, user }: MapScreenProps) {
  const [isNearFaculty] = useState(true);

  return (
    <Box
      sx={{
        height: '100vh',
        position: 'relative',
        bgcolor: '#E8F4EA',
        overflow: 'hidden',
      }}
    >
      {/* Mapa simulado */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundImage: 'linear-gradient(45deg, #E8F4EA 25%, #D4E9D7 25%, #D4E9D7 50%, #E8F4EA 50%, #E8F4EA 75%, #D4E9D7 75%, #D4E9D7)',
          backgroundSize: '50px 50px',
        }}
      >
        {/* Ubicación del usuario */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <MyLocation sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>

        {/* Marcadores de facultades */}
        {faculties.map((faculty) => (
          <Box
            key={faculty.id}
            sx={{
              position: 'absolute',
              top: `${30 + faculty.id * 10}%`,
              left: `${20 + faculty.id * 15}%`,
              zIndex: 1,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 1,
                bgcolor: 'secondary.light',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'secondary.main',
                },
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                📍 {faculty.name}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Cabecera - Perfil y puntos */}
      <Card
        elevation={4}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              fontWeight: 700
            }}
          >
            {user.nombre_usuario[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="700">
              {user.nombre_usuario}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Entrenador LoroMon
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${user.puntos || 0} pts`}
          color="primary"
          sx={{ fontWeight: 'bold', fontSize: '1rem', borderRadius: 2 }}
        />
      </Card>

      {/* Botón FAB para abrir cámara */}
      <Fab
        color="primary"
        aria-label="abrir cámara AR"
        disabled={!isNearFaculty}
        onClick={onOpenCamera}
        sx={{
          position: 'absolute',
          bottom: 70, // Ajustado para que esté justo encima de la barra (aprox 56px) con un margen pequeño
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 80,
          zIndex: 1100,
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)',
          '&:hover': {
            transform: 'translateX(-50%) scale(1.05)',
          }
        }}
      >
        <CameraAlt sx={{ fontSize: 40 }} />
      </Fab>

      {/* Indicador de estado */}
      {!isNearFaculty && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 165, // Ajustado proporcionalmente
            left: '50%',
            transform: 'translateX(-50%)',
            px: 3,
            py: 1,
            borderRadius: 2,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1100,
          }}
        >
          <Typography variant="body2" color="white">
            Acércate a una facultad para capturar
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
