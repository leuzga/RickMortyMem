/**
 * Utilidades de almacenamiento para tokens de autenticación
 * Sigue principios de programación funcional con manejo de errores
 */

const TOKEN_KEY = 'memory_app_token';

/**
 * Guarda el token de autenticación en localStorage
 * @param token - Token de acceso a almacenar
 * @returns Resultado de la operación
 */
export const saveToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw new Error('No se pudo guardar el token de autenticación');
  }
};

/**
 * Recupera el token de autenticación desde localStorage
 * @returns Token almacenado o null si no existe
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Elimina el token de autenticación del localStorage
 * @returns void
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw new Error('No se pudo eliminar el token de autenticación');
  }
};
