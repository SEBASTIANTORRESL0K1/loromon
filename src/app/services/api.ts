// Tipos y servicios para la API de LoroMon

export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  correo: string;
  puntos?: number;
  token?: string;
}

export interface Personaje {
  id_personaje: number;
  nombre_personaje: string;
  ruta_modelo: string;
  valor_puntos: number;
  es_especial: boolean;
}

export interface Lugar {
  id_lugar: number;
  nombre: string;
  latitud: string;
  longitud: string;
  personaje1: Personaje;
  personaje2: Personaje;
}

export interface RankingEntry {
  nombre_usuario: string;
  puntos: number;
}

export interface RegisterData {
  nombre_usuario: string;
  correo: string;
  contrasena: string;
}

export interface LoginData {
  correo: string;
  contrasena: string;
}

const API_URL = (import.meta as any).env.VITE_API_URL;

// Helper para obtener los encabezados con el token de seguridad que nos da el backend
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const savedUser = localStorage.getItem('loromon_user');
  if (savedUser) {
    try {
      const { token } = JSON.parse(savedUser);
      if (token) {
        // Estándar de la industria: enviar el token en el encabezado Authorization
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error al parsear el usuario guardado:', e);
    }
  }
  
  return headers;
};

export const api = {
  register: async (data: RegisterData): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al registrar usuario');
    }

    return response.json();
  },

  login: async (data: LoginData): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }

    return response.json();
  },

  getLugares: async (): Promise<Lugar[]> => {
    const response = await fetch(`${API_URL}/lugares`, {
      headers: getHeaders(), // Incluimos el token de forma segura
    });
    if (!response.ok) throw new Error('Error al obtener los lugares');
    return response.json();
  },

  capturar: async (id_usuario: number, id_personaje: number): Promise<{ message: string; puntosObtenidos: number }> => {
    const response = await fetch(`${API_URL}/capturar`, {
      method: 'POST',
      headers: getHeaders(), // Incluimos el token para validar quién captura
      body: JSON.stringify({ id_usuario, id_personaje }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al capturar el personaje');
    }

    return response.json();
  },

  getRanking: async (): Promise<RankingEntry[]> => {
    const response = await fetch(`${API_URL}/ranking`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener el ranking');
    return response.json();
  },
};
