import { useState, useEffect, useRef, Suspense } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CameraAlt, Close } from '@mui/icons-material';
<<<<<<< Updated upstream
import { Usuario, Lugar, api } from '../services/api';
import { toast } from 'sonner';
=======
import { Usuario, api, Lugar, Personaje } from '../services/api';
import { toast } from 'sonner';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
>>>>>>> Stashed changes

interface ARCameraScreenProps {
  onCapture: (puntos: number) => void;
  onClose: () => void;
  user: Usuario;
<<<<<<< Updated upstream
  lugar: Lugar;
}

export function ARCameraScreen({ onCapture, onClose, user, lugar }: ARCameraScreenProps) {
  const [showHint, setShowHint] = useState(true);
  const [captured, setCaptured] = useState(false);
=======
  lugar: Lugar | null;
}

// Componente para cargar y mostrar el modelo 3D
function Model({ url, capturing }: { url: string; capturing: boolean }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Animación de rotación y flotación
  useFrame((state) => {
    if (modelRef.current) {
      if (capturing) {
        // Animación de captura (encoger y rotar rápido)
        modelRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        modelRef.current.rotation.y += 0.2;
      } else {
        // Asegurar que regrese a su escala original (0.7) si no se está capturando
        modelRef.current.scale.lerp(new THREE.Vector3(0.7, 0.7, 0.7), 0.1);
        modelRef.current.rotation.y += 0.01;
        modelRef.current.position.y = (Math.sin(state.clock.elapsedTime) * 0.1) - 1.2;
      }
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={0.7} 
      position={[0, -1.2, 0]} 
    />
  );
}

export function ARCameraScreen({ onCapture, onClose, user, lugar }: ARCameraScreenProps) {
  const [capturing, setCapturing] = useState(false);
>>>>>>> Stashed changes
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personajeActual, setPersonajeActual] = useState<Personaje | null>(null);
  const [indexPersonaje, setIndexPersonaje] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

<<<<<<< Updated upstream
  // El personaje a mostrar será el personaje1 del lugar por defecto
  const personaje = lugar.personaje1;

  // Activar la cámara al montar el componente
=======
  useEffect(() => {
    if (lugar) {
      setPersonajeActual(lugar.personaje1);
    }
  }, [lugar]);

>>>>>>> Stashed changes
  useEffect(() => {
    async function startCamera() {
      try {
        setLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
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
<<<<<<< Updated upstream
        setError("No se pudo acceder a la cámara. Por favor, asegura los permisos.");
=======
        setError("No se pudo acceder a la cámara. Asegúrate de dar permisos HTTPS.");
>>>>>>> Stashed changes
        setLoading(false);
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
<<<<<<< Updated upstream
    if (capturing) return;
    
    try {
      setCapturing(true);
      // Llamada real a la API para registrar la captura
      const response = await api.capturar(user.id_usuario, personaje.id_personaje);
      
      setCaptured(true);
      
      // Esperar la animación y notificar éxito
      setTimeout(() => {
        onCapture(response.puntosObtenidos);
      }, 2000);
      
    } catch (err: any) {
      console.error("Error en captura:", err);
      toast.error(err.message || "Error al capturar LoroMon");
      setCapturing(false);
    }
=======
    if (!personajeActual || capturing) return;

    try {
      console.log("Iniciando captura:", {
        id_usuario: user.id_usuario,
        id_personaje: personajeActual.id_personaje
      });
      
      setCapturing(true);
      const result = await api.capturar(user.id_usuario, personajeActual.id_personaje);
      
      console.log("Resultado captura:", result);
      toast.success(`¡${personajeActual.nombre_personaje} capturado! +${result.puntosObtenidos} pts`);
      
      // Esperar a que termine la animación de encogimiento
      setTimeout(() => {
        if (indexPersonaje === 0 && lugar?.personaje2) {
          setIndexPersonaje(1);
          setPersonajeActual(lugar.personaje2);
          setCapturing(false);
        } else {
          onCapture();
        }
      }, 1000);

    } catch (err: any) {
      console.error("Error detallado en handleCapture:", err);
      setCapturing(false);
      
      if (err.message.includes('ya ha sido capturado')) {
        toast.error("Ya capturaste a este personaje aquí.");
        if (indexPersonaje === 0 && lugar?.personaje2) {
          setIndexPersonaje(1);
          setPersonajeActual(lugar.personaje2);
        } else {
            setTimeout(onClose, 1000);
        }
      } else {
        toast.error(err.message || "Error al capturar");
      }
    }
  };

  // La URL del modelo debe ser absoluta apuntando al backend de Railway
  const getModelUrl = (path: string) => {
    const baseUrl = (import.meta as any).env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/${path}`;
>>>>>>> Stashed changes
  };

  return (
    <Box sx={{ height: '100vh', position: 'relative', bgcolor: 'black', overflow: 'hidden' }}>
      {/* Feed de la Cámara */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
      />

<<<<<<< Updated upstream
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
              <Typography color="white">Buscando LoroMons...</Typography>
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

      {/* Capa de Realidad Aumentada */}
      {!loading && !error && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
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
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
          Apunta con la cámara para capturar a {personaje.nombre_personaje}
        </Alert>
      </Snackbar>

      {/* Información del LoroMon */}
=======
      {/* Visor 3D (Three.js) */}
      {!loading && !error && personajeActual && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 3]} />
            <ambientLight intensity={0.7} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <Suspense fallback={null}>
              <Model url={getModelUrl(personajeActual.ruta_modelo)} capturing={capturing} />
              <Environment preset="city" />
              <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={5} blur={2} far={1} />
            </Suspense>

            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </Box>
      )}

      {/* Mensajes de carga */}
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.8)', zIndex: 2000 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography color="white">Iniciando visor AR...</Typography>
        </Box>
      )}

      {/* Información del Lugar y Personaje */}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          {personaje.nombre_personaje} Salvaje
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
          Valor: {personaje.valor_puntos} pts • Ubicación: {lugar.nombre}
=======
          {lugar?.nombre || 'Ubicación Desconocida'}
        </Typography>
        <Typography variant="body2" color="primary.light" fontWeight="bold">
          {personajeActual?.nombre_personaje} ({indexPersonaje + 1}/2)
>>>>>>> Stashed changes
        </Typography>
      </Paper>

      <Fab
        size="small"
        onClick={onClose}
        sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0, 0, 0, 0.5)', color: 'white', zIndex: 110 }}
      >
        <Close />
      </Fab>

      {/* Botón de Captura */}
      <Box sx={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 100 }}>
        <Fab
          color="primary"
          onClick={handleCapture}
<<<<<<< Updated upstream
          disabled={captured || loading || !!error || capturing}
          sx={{
            width: 90,
            height: 90,
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
            '& .MuiSvgIcon-root': { fontSize: 45 }
          }}
        >
          {capturing ? <CircularProgress size={40} color="inherit" /> : <CameraAlt />}
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
          ¡{personaje.nombre_personaje.toUpperCase()} CAPTURADO! 🎉
        </Alert>
      </Snackbar>
=======
          disabled={capturing || loading || !!error}
          sx={{ width: 90, height: 90, boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }}
        >
          {capturing ? <CircularProgress size={40} color="inherit" /> : <CameraAlt sx={{ fontSize: 45 }} />}
        </Fab>
      </Box>
>>>>>>> Stashed changes
    </Box>
  );
}
