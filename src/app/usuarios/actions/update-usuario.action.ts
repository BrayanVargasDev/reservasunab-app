import { environment } from '@environments/environment';
import { type Usuario } from '../intefaces';

const BASE_URL = environment.apiUrl;

export const updateUsuarioRol = async (usuarioId: number, nuevoRol: string): Promise<Usuario> => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}/rol`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rol: nuevoRol }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error in updateUsuarioRol action:', error);
    throw error;
  }
};

export const updateUsuarioEstado = async (usuarioId: number, nuevoEstado: string): Promise<Usuario> => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error in updateUsuarioEstado action:', error);
    throw error;
  }
};

export const deleteUsuario = async (usuarioId: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error in deleteUsuario action:', error);
    throw error;
  }
};
