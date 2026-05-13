import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CameraAlt, Close, FlipCameraIos } from '@mui/icons-material';

interface ARCameraScreenProps {
  onCapture: () => void;
  onClose: () => void;
}

export function ARCameraScreen({ onCapture, onClose }: ARCameraScreenProps) {
  const [showHint, setShowHint] = useState(true);
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Activar la cámara al montar el componente
  useEffect(() => {
    async function startCamera() {
      try {
        setLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', // Usar cámara trasera por defecto
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara. Por favor, asegúrate de dar los permisos necesarios.");
        setLoading(false);
      }
    }

    startCamera();

    // Limpiar el stream al desmontar
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
        bgcolor: 'black',
        overflow: 'hidden',
      }}
    >
      {/* Feed de la Cámara Real */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {/* Overlay de Carga o Error */}
      {(loading || error) && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            p: 3,
            textAlign: 'center'
          }}
        >
          {loading && !error && (
            <>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography color="white">Iniciando cámara AR...</Typography>
            </>
          )}
          {error && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              <Fab variant="extended" color="primary" onClick={onClose}>
                <Close sx={{ mr: 1 }} /> Volver al mapa
              </Fab>
            </>
          )}
        </Box>
      )}

      {/* Capa de Realidad Aumentada (3D placeholder) */}
      {!loading && !error && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none', // Permite que los clics pasen a través si es necesario
            zIndex: 10,
          }}
        >
          {/* Aquí irá el Canvas de Three.js próximamente */}
          <Box
            sx={{
              position: 'absolute',
              top: '45%',
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
              pointerEvents: 'auto'
            }}
          >
            {/* Personaje temporal (Emoji) */}
            <Box
              sx={{
                fontSize: '140px',
                filter: captured ? 'brightness(1.5) scale(0)' : 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.6))',
                transition: 'all 0.5s ease-in',
                transform: captured ? 'scale(0)' : 'scale(1)',
              }}
            >
              🦜
            </Box>
          </Box>

          {/* Grid de enfoque AR */}
          <Box
            sx={{
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 260,
              height: 260,
              border: '2px dashed rgba(255, 255, 255, 0.5)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        </Box>
      )}

      {/* Banner superior con instrucción */}
      <Snackbar
        open={showHint && !captured && !loading && !error}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 100, sm: 120 } }}
      >
        <Alert
          severity="info"
          onClose={() => setShowHint(false)}
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            '& .MuiAlert-icon': { color: 'primary.light' },
          }}
        >
          Apunta con la cámara para capturar al LoroMon
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
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 100,
        }}
      >
        <Typography variant="h6" color="white" fontWeight="800">
          LoroMon Salvaje
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
          Tipo: Ingeniero • Ubicación: Facultad de Telemática
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
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          zIndex: 110,
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
        }}
      >
        <Close />
      </Fab>

      {/* Controles inferiores */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          zIndex: 100
        }}
      >
        <Fab
          color="primary"
          aria-label="capturar"
          onClick={handleCapture}
          disabled={captured || loading || !!error}
          sx={{
            width: 90,
            height: 90,
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
            '& .MuiSvgIcon-root': { fontSize: 45 }
          }}
        >
          <CameraAlt />
        </Fab>
      </Box>

      {/* Mensaje de éxito */}
      <Snackbar
        open={captured}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: 4,
            px: 4,
            py: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}
        >
          ¡CAPTURADO! 🎉
        </Alert>
      </Snackbar>
    </Box>
  );
}
