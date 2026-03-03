/**
 * Utilidades de validación para formularios
 * Funciones puras para validar datos según el contrato
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida un email usando regex
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('El email es requerido');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('El email no es válido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida una contraseña
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('La contraseña es requerida');
  } else if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  } else if (password.length > 50) {
    errors.push('La contraseña es demasiado larga');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida un username
 */
export const validateUsername = (username: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!username) {
    errors.push('El nombre de usuario es requerido');
  } else if (username.length < 3) {
    errors.push('El nombre de usuario debe tener al menos 3 caracteres');
  } else if (username.length > 20) {
    errors.push('El nombre de usuario es demasiado largo');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('El nombre de usuario solo puede contener letras, números y guiones bajos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida las credenciales de login
 */
export const validateLoginCredentials = (email: string, password: string): ValidationResult => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  
  const allErrors = [...emailValidation.errors, ...passwordValidation.errors];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Valida las credenciales de registro
 */
export const validateRegisterCredentials = (
  username: string, 
  email: string, 
  password: string
): ValidationResult => {
  const usernameValidation = validateUsername(username);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  
  const allErrors = [
    ...usernameValidation.errors, 
    ...emailValidation.errors, 
    ...passwordValidation.errors
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Valida si un objeto tiene todos los campos requeridos
 */
export const validateRequiredFields = (
  data: Record<string, unknown>, 
  requiredFields: string[]
): ValidationResult => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      errors.push(`El campo ${field} es requerido`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
