import { ROLES } from './estados.js';
import { MIN_PASSWORD_LENGTH } from './passwordChange.js';

// El ADMIN crea cuentas de Institución y de Administrador. Los estudiantes se
// registran solos con su número de documento (POST users/student); si el
// ADMIN los creara, quedarían sin documento asociado.
export const ROLES_CREABLES = Object.freeze([ROLES.INSTITUCION, ROLES.ADMIN]);

export const EMPTY_USUARIO = Object.freeze({ nombreUsuario: '', correo: '', rol: ROLES.INSTITUCION, contraseña: '', confirmacion: '' });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME = /^[A-Za-z0-9._-]{3,40}$/;

export function validateUsuario(form = {}) {
  const errors = {};
  const nombreUsuario = String(form.nombreUsuario ?? '').trim();
  const correo = String(form.correo ?? '').trim().toLowerCase();
  const contraseña = String(form.contraseña ?? '');

  if (!nombreUsuario) errors.nombreUsuario = 'Escribe el nombre de usuario.';
  else if (!USERNAME.test(nombreUsuario)) errors.nombreUsuario = 'Usa de 3 a 40 caracteres: letras, números, punto, guion o guion bajo, sin espacios.';

  if (!correo) errors.correo = 'Escribe el correo.';
  else if (!EMAIL.test(correo)) errors.correo = 'El correo no tiene un formato válido.';

  if (!ROLES_CREABLES.includes(form.rol)) errors.rol = 'Selecciona un rol válido.';

  if (!contraseña) errors.contraseña = 'Escribe una contraseña inicial.';
  else if (contraseña.length < MIN_PASSWORD_LENGTH) errors.contraseña = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  else if (form.confirmacion !== contraseña) errors.confirmacion = 'La confirmación no coincide con la contraseña.';

  const valid = Object.keys(errors).length === 0;
  return { errors, payload: valid ? { nombreUsuario, correo, rol: form.rol, contraseña } : null };
}

/** Filtros del listado → query del API (activo 'true'/'false'). */
export function usuarioFilters({ nombreUsuario = '', correo = '', activo = '' } = {}) {
  return {
    nombreUsuario: nombreUsuario.trim() || undefined,
    correo: correo.trim() || undefined,
    activo: activo === 'true' || activo === 'false' ? activo : undefined
  };
}

/** No se permite desactivar la propia cuenta (dejaría al sistema sin el admin en sesión). */
export const canToggleUsuario = (usuario, currentUserId) => Boolean(usuario?._id) && usuario._id !== currentUserId;
