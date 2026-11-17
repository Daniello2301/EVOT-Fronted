export const MIN_PASSWORD_LENGTH = 8;

/** Valida el formulario de cambio de contraseña. Devuelve { errors, payload }. */
export function validatePasswordChange({ actual = '', nueva = '', confirmacion = '' } = {}) {
  const errors = {};
  if (!actual) errors.actual = 'Escribe tu contraseña actual.';
  if (!nueva) errors.nueva = 'Escribe la nueva contraseña.';
  else if (nueva.length < MIN_PASSWORD_LENGTH) errors.nueva = `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  else if (actual && nueva === actual) errors.nueva = 'La nueva contraseña debe ser distinta de la actual.';
  if (!errors.nueva && confirmacion !== nueva) errors.confirmacion = 'La confirmación no coincide con la nueva contraseña.';
  const valid = Object.keys(errors).length === 0;
  return { errors, payload: valid ? { viejaContraseña: actual, nuevaContraseña: nueva } : null };
}
