import { useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { CameraAlt, Close } from '@mui/icons-material';

interface ARCameraScreenProps {
  onCapture: () => void;
  onClose: () => void;
}

export function ARCameraScreen({ onCapture, onClose }: ARCameraScreenProps) {
  const [showHint, setShowHint] = useState(true);
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured(true);
    setTimeout(() => {
      onCapture();
    }, 1500);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        position: 'relative',
        bgcolor: '#1a1a2e',
        overflow: 'hidden',
      }}
    >
      {/* Simulación de vista de cámara */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 100%)',
          position: 'relative',
        }}
      >
        {/* Modelo 3D simulado (Low-poly) */}
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: captured ? 'none' : 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0px)' },
              '50%': { transform: 'translate(-50%, -50%) translateY(-20px)' },
            },
          }}
        >
          {/* Personaje Low-Poly simulado */}
          <Box
            sx={{
              fontSize: '140px',
              filter: captured ? 'brightness(1.5)' : 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.6))',
              transition: 'all 0.3s ease',
            }}
          >
            🦜
          </Box>
        </Box>

        {/* Grid de enfoque AR */}
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 240,
            height: 240,
            border: '2px dashed rgba(100, 200, 255, 0.5)',
            borderRadius: 2,
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Banner superior con instrucción */}
      <Snackbar
        open={showHint && !captured}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 80, sm: 100 } }}
      >
        <Alert
          severity="info"
          onClose={() => setShowHint(false)}
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              color: 'primary.light',
            },
          }}
        >
          Mantén al LoroMon en el centro para capturarlo
        </Alert>
      </Snackbar>

      {/* Información del LoroMon */}
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          p: 2,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h6" color="white" gutterBottom>
          LoroMon Salvaje Apareció
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
          Tipo: Ingeniero • Rareza: ⭐⭐⭐
        </Typography>
      </Paper>

      {/* Botón de cerrar */}
      <Fab
        size="small"
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Close />
      </Fab>

      {/* Botón de captura */}
      <Fab
        color="primary"
        aria-label="capturar"
        onClick={handleCapture}
        disabled={captured}
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 80,
        }}
      >
        <CameraAlt sx={{ fontSize: 40 }} />
      </Fab>

      {/* Mensaje de captura exitosa */}
      <Snackbar
        open={captured}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: '50%' }}
      >
        <Alert
          severity="success"
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            bgcolor: 'success.main',
            color: 'white',
          }}
        >
          ¡LoroMon Capturado! 🎉
        </Alert>
      </Snackbar>
    </Box>
  );
}
