// Estados del dominio y su presentación (etiqueta + tono). El tono es semántico;
// el componente StatusBadge lo traduce a colores, siempre acompañado de texto.
// Ojo: el backend usa formas masculinas en solicitudes de documento
// (APROBADO/RECHAZADO) y femeninas en solicitudes de edición (APROBADA/RECHAZADA).

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  INSTITUCION: 'INSTITUCION',
  ESTUDIANTE: 'ESTUDIANTE'
});

export const ROL_LABELS = Object.freeze({
  ADMIN: 'Administrador',
  INSTITUCION: 'Institución',
  ESTUDIANTE: 'Estudiante'
});

export const ESTADOS_DOCUMENTO = Object.freeze({
  PENDIENTE: { label: 'Pendiente', tone: 'warning' },
  APROBADO: { label: 'Aprobado', tone: 'success' },
  RECHAZADO: { label: 'Rechazado', tone: 'danger' }
});

export const ESTADOS_EDICION = Object.freeze({
  PENDIENTE: { label: 'Pendiente', tone: 'warning' },
  APROBADA: { label: 'Aprobada', tone: 'success' },
  RECHAZADA: { label: 'Rechazada', tone: 'danger' }
});

export function describeEstado(map, value) {
  return map?.[value] ?? { label: value ? String(value) : 'Sin estado', tone: 'neutral' };
}

/** Activo/inactivo para usuarios (`activo`), instituciones, graduados y diplomas (`estado`). */
export function describeActivo(value) {
  return value === false
    ? { label: 'Inactivo', tone: 'neutral' }
    : { label: 'Activo', tone: 'success' };
}

export const rolLabel = (rol) => ROL_LABELS[rol] ?? rol ?? '—';

export const TIPOS_DOCUMENTO = Object.freeze([
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'PEP', label: 'Permiso especial de permanencia' }
]);

export function tipoDocumentoLabel(value) {
  return TIPOS_DOCUMENTO.find((tipo) => tipo.value === value)?.label ?? value ?? '—';
}
