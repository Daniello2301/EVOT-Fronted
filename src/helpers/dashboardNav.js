// Fuente única de las secciones del panel: la usan la barra lateral (qué se ve)
// y el enrutador (qué se puede abrir por URL). Así un rol no ve un enlace que
// luego no puede abrir, ni abre por URL una sección que no le corresponde.
// La autorización efectiva sigue siendo del backend; esto es la capa visual.
import { ROLES } from './estados.js';

export const DASHBOARD_BASE = '/admin-dashboard';

const BOTH = [ROLES.ADMIN, ROLES.INSTITUCION];

export const DASHBOARD_SECTIONS = Object.freeze([
  { key: 'inicio', name: 'Inicio', path: '', roles: BOTH },
  { key: 'diplomas', name: 'Diplomas', path: 'diplomas', roles: BOTH },
  { key: 'graduados', name: 'Graduados', path: 'graduados', roles: BOTH },
  { key: 'solicitudes-documento', name: 'Solicitudes de documentos', path: 'solicitudes-documento', roles: [ROLES.INSTITUCION] },
  { key: 'solicitudes-edicion', name: 'Solicitudes de edición', path: 'solicitudes-edicion', roles: [ROLES.ADMIN] },
  { key: 'instituciones', name: 'Instituciones', path: 'institutions', roles: [ROLES.ADMIN] },
  { key: 'usuarios', name: 'Usuarios', path: 'users', roles: [ROLES.ADMIN] },
  { key: 'mi-institucion', name: 'Mi institución', path: 'my-institution', roles: [ROLES.INSTITUCION] }
]);

export const canAccessSection = (section, rol) => Boolean(section && rol && section.roles.includes(rol));

export const sectionsForRole = (rol) => DASHBOARD_SECTIONS.filter((section) => canAccessSection(section, rol));

export const sectionByKey = (key) => DASHBOARD_SECTIONS.find((section) => section.key === key) ?? null;

export const dashboardPath = (path = '') => (path ? `${DASHBOARD_BASE}/${path}` : DASHBOARD_BASE);

/** Inicio solo es activo en coincidencia exacta; el resto también en sus sub-rutas. */
export function isActivePath(pathname, path = '') {
  const target = dashboardPath(path);
  const current = (pathname || '').replace(/\/+$/, '') || '/';
  if (!path) return current === DASHBOARD_BASE;
  return current === target || current.startsWith(`${target}/`);
}

export function currentSection(pathname) {
  return DASHBOARD_SECTIONS.filter((section) => section.path).find((section) => isActivePath(pathname, section.path))
    ?? (isActivePath(pathname, '') ? DASHBOARD_SECTIONS[0] : null);
}
