import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Card,
  Alert
} from '@mui/material';
import { 
  CameraAlt, 
  Close, 
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
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

// Componente para cargar y mostrar el modelo 3D con normalización automática
function Model({ url, capturing }: { url: string; capturing: boolean }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Normalizar el modelo al cargar (Escalado y centrado automático)
  const normalizedScene = useMemo(() => {
    const clone = scene.clone();
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Calcular escala para que el modelo tenga un tamaño consistente (aprox 1.8 unidades de altura)
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = 1.8 / maxDim;
    clone.scale.setScalar(targetScale);
    
    // Centrar en X y Z, pero alinear el suelo (mínimo Y) a 0
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.x = -center.x * targetScale;
    clone.position.z = -center.z * targetScale;
    
    // Alinear la base del modelo (pies) exactamente en y = 0
    clone.position.y = -box.min.y * targetScale;

    // Parche manual: Si es la trabajadora2, la bajamos un poco más extra porque su modelo tiene mucho espacio vacío abajo
    if (url.includes('trabajadora2.glb')) {
      clone.position.y -= 0.5;
    }

    // Desactivar frustum culling para evitar que desaparezca en ciertos ángulos
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.frustumCulled = false;
      }
    });

    return clone;
  }, [scene, url]);

  // Animación de rotación y flotación
  useFrame((state) => {
    if (modelRef.current) {
      if (capturing) {
        // Animación de captura (encoger y rotar rápido)
        modelRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        modelRef.current.rotation.y += 0.2;
      } else {
        // Regresar a escala normal si no está capturando
        modelRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        modelRef.current.rotation.y += 0.01;
        // Efecto sutil de flotación (sobre el eje corregido)
        modelRef.current.position.y = -1.6 + (Math.sin(state.clock.elapsedTime) * 0.05);
      }
    }
  });

  return (
    <group ref={modelRef} position={[0, -1.6, 0]}>
      <primitive object={normalizedScene} />
    </group>
  );
}

// Componente para la Pokebola con animación de lanzamiento
function PokeballModel({ thrown, onHit, url, capturing }: { thrown: boolean, onHit: () => void, url: string, capturing: boolean }) {
  const { scene } = useGLTF(url);
  const ballRef = useRef<THREE.Group>(null);
  
  // Posiciones: de abajo (cerca de la cámara) hacia el personaje
  const initialPos = new THREE.Vector3(0, -1, 1.5);
  const targetPos = new THREE.Vector3(0, -0.5, 0);

  useFrame(() => {
    if (!ballRef.current) return;

    if (thrown) {
      // Movimiento hacia el objetivo
      ballRef.current.position.lerp(targetPos, 0.1);
      // Rotación de lanzamiento
      ballRef.current.rotation.x -= 0.3;
      // Escala se reduce al alejarse
      ballRef.current.scale.lerp(new THREE.Vector3(0.15, 0.15, 0.15), 0.1);

      // Detectar "impacto"
      if (ballRef.current.position.distanceTo(targetPos) < 0.2) {
        onHit();
      }
    } else if (capturing) {
        // Desaparecer después del impacto
        ballRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.2);
    } else {
      // Posición de espera
      ballRef.current.position.lerp(initialPos, 0.1);
      ballRef.current.scale.lerp(new THREE.Vector3(0.4, 0.4, 0.4), 0.1);
      ballRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={ballRef}>
      <primitive object={scene} />
    </group>
  );
}

export function ARCameraScreen({ onCapture, onClose, user, lugar }: ARCameraScreenProps) {
  const [capturing, setCapturing] = useState(false);
  const [isThrown, setIsThrown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personajeActual, setPersonajeActual] = useState<Personaje | null>(null);
  const [indexPersonaje, setIndexPersonaje] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const touchStart = useRef<number | null>(null);

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
          setIsThrown(false);
          toast.success(`¡${personajeActual.nombre_personaje} capturado! +${result.puntosObtenidos} pts`);
        } else {
          onCapture(result.puntosObtenidos);
        }
      }, 1000);

    } catch (err: any) {
      console.error("Error detallado en handleCapture:", err);
      setCapturing(false);
      setIsThrown(false);
      
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

  const getModelUrl = (path: string) => {
    const baseUrl = (import.meta as any).env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/${path}`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null || isThrown || capturing) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;
    
    // Si el deslizamiento es hacia arriba (al menos 100px)
    if (diff > 80) {
      setIsThrown(true);
    }
    touchStart.current = null;
  };

  return (
    <Box 
      sx={{ 
        height: '100dvh', 
        position: 'relative', 
        bgcolor: 'black', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video de fondo (Capa 0) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label="Vista previa de la cámara en vivo"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          position: 'absolute', 
          top: 0, 
          left: 0,
          zIndex: 0 
        }}
      />

      {/* Capa AR - Canvas (Capa 1) */}
      {!loading && !error && personajeActual && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 3.5]} />
            <ambientLight intensity={0.8} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <Suspense fallback={null}>
              <Model url={getModelUrl(personajeActual.ruta_modelo)} capturing={capturing} />
              <PokeballModel 
                url={getModelUrl('models/pokeball-lowpoly.glb')} 
                thrown={isThrown} 
                onHit={handleCapture}
                capturing={capturing}
              />
              <Environment preset="city" />
              <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={5} blur={2} far={1} />
            </Suspense>

            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </Box>
      )}

      {/* Overlay de Carga (Capa Superior) */}
      {loading && (
        <Box 
          role="status"
          aria-live="polite"
          sx={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'primary.main', // Color primario sólido para carga consistente
            zIndex: 2000 
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3, color: 'white' }} aria-label="Cargando visor de realidad aumentada" />
          <Typography color="white" variant="h6" fontWeight="800">Cargando Visor AR...</Typography>
          <Typography color="white" variant="body2" sx={{ opacity: 0.8 }}>Prepara tu cámara</Typography>
        </Box>
      )}

      {/* Cabecera UI: Navegación e Información (Capa 2) */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        p: { xs: 2, sm: 3 },
        pt: 'calc(16px + env(safe-area-inset-top))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        {/* Botón Volver (Ahora a la Izquierda) */}
        <Fab
          size="medium"
          onClick={onClose}
          aria-label="Volver al mapa"
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: 'primary.main',
            '&:hover': { 
              bgcolor: '#ffffff',
              transform: 'scale(1.1)' 
            },
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'auto',
            flexShrink: 0,
            width: { xs: 45, sm: 56 },
            height: { xs: 45, sm: 56 }
          }}
        >
          <ArrowBackIcon />
        </Fab>

        {/* Tarjeta de Información (Ahora a la Derecha y más refinada) */}
        <Card
          elevation={10}
          role="region"
          aria-label="Información del lugar y personaje"
          sx={{
            p: { xs: 1.2, sm: 1.5 },
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px 4px 16px 16px', // Esquinas asimétricas para estilo moderno
            borderRight: (theme) => `5px solid ${theme.palette.primary.main}`, // Borde a la derecha para equilibrio
            flexShrink: 1,
            maxWidth: { xs: '220px', sm: '320px' },
            pointerEvents: 'auto',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            textAlign: 'right' // Texto alineado a la derecha
          }}
        >
          <Typography 
            variant="subtitle1" 
            color="text.primary" 
            fontWeight="900"
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1.05rem' }, 
              lineHeight: 1.1,
              mb: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {lugar?.nombre || 'Ubicación'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
            <Typography 
              variant="caption" 
              color="text.primary" // Mejorado contraste (de secondary a primary)
              fontWeight="700"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {personajeActual?.nombre_personaje}
            </Typography>
            <Typography 
              variant="caption" 
              color="primary.main" 
              fontWeight="900"
              aria-label={`Personaje ${indexPersonaje + 1} de 2`}
              sx={{ 
                bgcolor: '#e0e7ff', 
                px: 1, 
                py: 0.2, 
                borderRadius: 1,
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }}
            >
              {indexPersonaje + 1}/2
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* Indicador de Gesto (Capa 2) */}
      {!loading && !error && !isThrown && !capturing && (
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 40, 
            left: 0, 
            right: 0, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 100,
            pointerEvents: 'none',
            animation: 'bounce 2s infinite'
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold', 
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              mb: 1
            }}
          >
            ¡DESLIZA HACIA ARRIBA PARA CAPTURAR!
          </Typography>
          <Box sx={{ 
            width: 4, 
            height: 40, 
            bgcolor: 'rgba(255,255,255,0.5)', 
            borderRadius: 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: -4,
              width: 12,
              height: 12,
              borderTop: '3px solid white',
              borderLeft: '3px solid white',
              transform: 'rotate(45deg)'
            }
          }} />
        </Box>
      )}

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>

      {/* Mensajes de Error con contraste */}
      {error && (
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '80%',
          zIndex: 3000 
        }}>
          <Card sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #ef4444' }}>
            <Typography variant="h6" color="error" fontWeight="800" gutterBottom>Error de Cámara</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{error}</Typography>
            <Button variant="contained" onClick={onClose} fullWidth sx={{ borderRadius: 2 }}>Volver al Mapa</Button>
          </Card>
        </Box>
      )}
    </Box>
  );
}
