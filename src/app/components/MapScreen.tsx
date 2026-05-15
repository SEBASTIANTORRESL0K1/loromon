import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Fab,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import { 
  CameraAlt, 
  Computer, 
  MedicalServices, 
  Groups, 
  Healing, 
  Psychology, 
  AccountBalance, 
  Settings, 
  MenuBook,
  Place,
  Restaurant
} from '@mui/icons-material';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Usuario, api, Lugar } from '../services/api';
import { calculateDistance } from '../hooks/useGeolocation';

// Corregir iconos de Leaflet (problema conocido en builds de JS)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Función para obtener icono y color según la facultad
const getFacultyStyle = (name: string) => {
  const n = name.toLowerCase();
  
  if (n.includes('telemática') || n.includes('telematica')) 
    return { icon: <Computer />, color: '#3b82f6' };
  
  if (n.includes('medicina')) 
    return { icon: <MedicalServices />, color: '#ef4444' };
  
  if (n.includes('trabajo social')) 
    return { icon: <Groups />, color: '#10b981' };
  
  if (n.includes('enfermería') || n.includes('enfermeria')) 
    return { icon: <Healing />, color: '#ec4899' };
  
  if (n.includes('psicología') || n.includes('psicologia')) 
    return { icon: <Psychology />, color: '#8b5cf6' };
  
  if (n.includes('rectoría') || n.includes('rectoria')) 
    return { icon: <AccountBalance />, color: '#f59e0b' };
  
  if (n.includes('servicios')) 
    return { icon: <Restaurant />, color: '#f97316' };
  
  if (n.includes('cei')) 
    return { icon: <MenuBook />, color: '#14b8a6' };
    
  return { icon: <Place />, color: '#6366f1' }; // Default
};

const UserIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div style="background-color: #6366f1; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface MapScreenProps {
  onOpenCamera: (lugar: Lugar) => void;
  user: Usuario;
  location: { latitude: number | null; longitude: number | null };
}

const UCOL_COORDS: [number, number] = [19.248065428523848, -103.69739247680202];

// Componente para actualizar la vista del mapa cuando cambia la ubicación
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapScreen({ onOpenCamera, user, location }: MapScreenProps) {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNearFaculty, setIsNearFaculty] = useState(false);
  const [closestLugar, setClosestLugar] = useState<Lugar | null>(null);

  // Cargar lugares desde la API
  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const data = await api.getLugares();
        setLugares(data);
      } catch (error) {
        console.error('Error al cargar lugares:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLugares();
  }, []);

  // Validar proximidad cuando cambia la ubicación o los lugares
  useEffect(() => {
    if (location.latitude && location.longitude && lugares.length > 0) {
      let foundNear = false;
      let nearest = null;

      lugares.forEach(lugar => {
        const dist = calculateDistance(
          location.latitude!,
          location.longitude!,
          parseFloat(lugar.latitud),
          parseFloat(lugar.longitud)
        );

        if (dist < 25) { // Radio de 25 metros
          foundNear = true;
          nearest = lugar;
        }
      });

      setIsNearFaculty(foundNear);
      setClosestLugar(nearest);
    }
  }, [location, lugares]);

  const mapCenter: [number, number] = location.latitude && location.longitude 
    ? [location.latitude, location.longitude] 
    : UCOL_COORDS;

  const zoomLevel = location.latitude ? 18 : 16;

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Mapa de Leaflet */}
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapUpdater center={mapCenter} zoom={zoomLevel} />

        {/* Marcador del Usuario */}
        {location.latitude && location.longitude && (
          <Marker position={[location.latitude, location.longitude]} icon={UserIcon}>
            <Popup>¡Estás aquí!</Popup>
          </Marker>
        )}

        {/* Marcadores de Facultades/Lugares */}
        {lugares.map((lugar) => {
          const position: [number, number] = [parseFloat(lugar.latitud), parseFloat(lugar.longitud)];
          const style = getFacultyStyle(lugar.nombre);
          
          const CustomIcon = L.divIcon({
            className: 'custom-faculty-marker',
            html: `
              <div style="
                background-color: ${style.color}; 
                width: 36px; 
                height: 36px; 
                border-radius: 50% 50% 50% 0; 
                transform: rotate(-45deg); 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              ">
                <div style="transform: rotate(45deg); color: white; display: flex;">
                  ${renderToString(style.icon)}
                </div>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          });

          return (
            <Box key={lugar.id_lugar}>
              <Marker position={position} icon={CustomIcon}>
                <Popup>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ color: style.color }}>
                    {lugar.nombre}
                  </Typography>
                </Popup>
              </Marker>
              
              {/* Radio de captura (Geocerca) con el color de la facultad */}
              <Circle
                center={position}
                pathOptions={{
                  fillColor: style.color,
                  fillOpacity: 0.12,
                  color: style.color,
                  weight: 2,
                  dashArray: '5, 10'
                }}
                radius={25}
              />
            </Box>
          );
        })}
      </MapContainer>

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
              Explorando el Campus Central
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
        disabled={!isNearFaculty || !closestLugar}
        onClick={() => closestLugar && onOpenCamera(closestLugar)}
        sx={{
          position: 'absolute',
          bottom: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 80,
          zIndex: 1100,
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)',
          border: '3px solid rgba(255, 255, 255, 0.4)', // Borde sutil cuando está activo
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateX(-50%) scale(1.1)',
            border: '3px solid rgba(255, 255, 255, 0.8)',
          },
          '&.Mui-disabled': {
            bgcolor: '#d1d5db', // Gris medio (más oscuro para contraste)
            color: '#6b7280',   // Icono gris oscuro (visible pero apagado)
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', // Sombra muy tenue para definir volumen
            border: '3px solid #ffffff', 
          }
        }}
      >
        <CameraAlt sx={{ fontSize: 40 }} />
      </Fab>

      {/* Indicador de estado o proximidad */}
      {!isNearFaculty && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 165,
            left: '50%',
            transform: 'translateX(-50%)',
            px: 3,
            py: 1,
            borderRadius: 2,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1100,
            width: 'max-content',
            maxWidth: '90%'
          }}
        >
          <Typography variant="body2" color="white" textAlign="center">
            Busca un marcador y acércate a menos de 25m
          </Typography>
        </Paper>
      )}

      {isNearFaculty && closestLugar && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 165,
            left: '50%',
            transform: 'translateX(-50%)',
            px: 3,
            py: 1,
            borderRadius: 2,
            bgcolor: 'success.main',
            zIndex: 1100,
            width: 'max-content',
            maxWidth: '90%'
          }}
        >
          <Typography variant="body2" color="white" fontWeight="700">
            📍 Estás en {closestLugar.nombre}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
