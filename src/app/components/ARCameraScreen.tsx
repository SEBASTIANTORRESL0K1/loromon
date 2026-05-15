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
import { Usuario, api, Lugar, Personaje } from '../services/api';
import { toast } from 'sonner';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface ARCameraScreenProps {
  onCapture: (puntos: number) => void;
  onClose: () => void;
  user: Usuario;
  lugar: Lugar;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personajeActual, setPersonajeActual] = useState<Personaje | null>(null);
  const [indexPersonaje, setIndexPersonaje] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (lugar) {
      setPersonajeActual(lugar.personaje1);
    }
  }, [lugar]);

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
        setError("No se pudo acceder a la cámara. Asegúrate de dar permisos HTTPS.");
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
    if (!personajeActual || capturing) return;

    try {
      console.log("Iniciando captura:", {
        id_usuario: user.id_usuario,
        id_personaje: personajeActual.id_personaje
      });
      
      setCapturing(true);
      const result = await api.capturar(user.id_usuario, personajeActual.id_personaje);
      
      console.log("Resultado captura:", result);
      
      // Esperar a que termine la animación de encogimiento
      setTimeout(() => {
        if (indexPersonaje === 0 && lugar?.personaje2) {
          setIndexPersonaje(1);
          setPersonajeActual(lugar.personaje2);
          setCapturing(false);
          toast.success(`¡${personajeActual.nombre_personaje} capturado! +${result.puntosObtenidos} pts`);
        } else {
          onCapture(result.puntosObtenidos);
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
          {lugar?.nombre || 'Ubicación Desconocida'}
        </Typography>
        <Typography variant="body2" color="primary.light" fontWeight="bold">
          {personajeActual?.nombre_personaje} ({indexPersonaje + 1}/2)
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
          disabled={capturing || loading || !!error}
          sx={{ width: 90, height: 90, boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }}
        >
          {capturing ? <CircularProgress size={40} color="inherit" /> : <CameraAlt sx={{ fontSize: 45 }} />}
        </Fab>
      </Box>
    </Box>
  );
}
