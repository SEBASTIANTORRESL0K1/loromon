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

const API_URL = (import.meta as any).env.VITE_API_URL;

export interface RegisterData {
  nombre_usuario: string;
  correo: string;
  contrasena: string;
}

export interface LoginData {
  correo: string;
  contrasena: string;
}

export const api = {
  register: async (data: RegisterData): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }

    return response.json();
  },
};
