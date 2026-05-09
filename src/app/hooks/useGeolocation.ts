import { useState, useEffect, useCallback } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(updateInterval: number = 120000) { // Default 2 minutes
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: 'Tu navegador no soporta la geolocalización.', 
        loading: false 
      }));
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Validación básica de los datos recibidos del sensor
        const { latitude, longitude } = position.coords;
        
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          setState(prev => ({ ...prev, error: 'Datos de ubicación inválidos.', loading: false }));
          return;
        }

        setState({
          latitude,
          longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Ocurrió un error al obtener la ubicación.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Por favor, permite el acceso a la ubicación para jugar.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'La información de ubicación no está disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Se agotó el tiempo de espera para obtener la ubicación.';
            break;
        }
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      },
      options
    );
  }, []);

  useEffect(() => {
    // Primera obtención de ubicación
    getLocation();

    // Configurar el intervalo de actualización (cada 2 minutos por defecto)
    const intervalId = setInterval(getLocation, updateInterval);

    return () => clearInterval(intervalId);
  }, [getLocation, updateInterval]);

  return { ...state, refetch: getLocation };
}

/**
 * Calcula la distancia entre dos puntos en metros usando la fórmula de Haversine.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadius = 6371e3; // Radio de la Tierra en metros
  
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c; // Distancia en metros
}
