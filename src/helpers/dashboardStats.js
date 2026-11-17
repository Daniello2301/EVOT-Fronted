import { ROLES } from './estados.js';
import { dashboardPath } from './dashboardNav.js';

// Indicadores del inicio del panel. Cada uno pide al endpoint paginado una
// sola fila (limit=1) y usa su `total`, para no traer listados completos.
// `source` es la clave del servicio que debe llamar la vista.

const ADMIN_STATS = [
  { key: 'instituciones', label: 'Instituciones activas', source: 'instituciones', params: { estado: 'true', limit: 1 }, href: dashboardPath('institutions') },
  { key: 'usuarios', label: 'Usuarios', source: 'usuarios', params: { limit: 1 }, href: dashboardPath('users') },
  { key: 'graduados', label: 'Graduados', source: 'graduados', params: { limit: 1 }, href: dashboardPath('graduados') },
  { key: 'edicionPendientes', label: 'Ediciones por revisar', source: 'solicitudesEdicion', params: { estado: 'PENDIENTE', limit: 1 }, href: dashboardPath('solicitudes-edicion'), attention: true }
];

const INSTITUCION_STATS = [
  { key: 'diplomas', label: 'Diplomas emitidos', source: 'diplomasInstitucion', params: { limit: 1 }, href: dashboardPath('diplomas') },
  { key: 'graduados', label: 'Graduados con diploma', source: 'graduados', params: { limit: 1 }, href: dashboardPath('graduados') },
  { key: 'documentoPendientes', label: 'Solicitudes por revisar', source: 'solicitudesDocumento', params: { estado: 'PENDIENTE', limit: 1 }, href: dashboardPath('solicitudes-documento'), attention: true },
  { key: 'documentoAprobadas', label: 'Documentos entregados', source: 'solicitudesDocumento', params: { estado: 'APROBADO', limit: 1 }, href: dashboardPath('solicitudes-documento') }
];

export function statsForRole(rol) {
  if (rol === ROLES.ADMIN) return ADMIN_STATS;
  if (rol === ROLES.INSTITUCION) return INSTITUCION_STATS;
  return [];
}

/** Bandeja de pendientes que se muestra en el inicio según el rol. */
export function pendingQueueForRole(rol) {
  if (rol === ROLES.ADMIN) return { source: 'solicitudesEdicion', params: { estado: 'PENDIENTE', limit: 5 }, href: dashboardPath('solicitudes-edicion'), title: 'Solicitudes de edición pendientes' };
  if (rol === ROLES.INSTITUCION) return { source: 'solicitudesDocumento', params: { estado: 'PENDIENTE', limit: 5 }, href: dashboardPath('solicitudes-documento'), title: 'Solicitudes de documentos pendientes' };
  return null;
}

/**
 * Valor de un indicador a partir de un resultado de Promise.allSettled.
 * - Listado paginado → total. Arreglo plano → longitud.
 * - 404 ("no hay registros" en varios endpoints) → 0.
 * - Otro error o respuesta inesperada → null (la vista muestra "—").
 */
export function statValue(result) {
  if (!result) return null;
  if (result.status === 'rejected') return result.reason?.response?.status === 404 ? 0 : null;
  const value = result.value;
  if (Array.isArray(value)) return value.length;
  const total = Number(value?.total);
  if (value && value.total !== null && value.total !== undefined && Number.isFinite(total)) return Math.max(0, total);
  if (Array.isArray(value?.results)) return value.results.length;
  return null;
}

export function greeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
