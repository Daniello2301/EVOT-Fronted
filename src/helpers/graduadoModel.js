import { TIPOS_DOCUMENTO } from './estados.js';
import { isInputDate, toInputDate } from './formatters.js';

export const EMPTY_GRADUADO = Object.freeze({
  tipoDocumento: 'CC',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: ''
});

const ALFANUMERICOS = new Set(['PA', 'PEP']);
const NAME = /^[\p{L}][\p{L}' .-]{0,79}$/u;

export function graduadoToForm(graduado) {
  return {
    tipoDocumento: graduado?.tipoDocumento ?? 'CC',
    numeroDocumento: graduado?.numeroDocumento ?? '',
    nombres: graduado?.nombres ?? '',
    apellidos: graduado?.apellidos ?? '',
    fechaNacimiento: toInputDate(graduado?.fechaNacimiento)
  };
}

const todayKey = (today) => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

/**
 * mode 'create': POST graduados (todos obligatorios, incluye tipoDocumento).
 * mode 'edit':   PUT graduados/:id (el backend no permite cambiar tipoDocumento).
 */
export function validateGraduado(form = {}, mode = 'create', today = new Date()) {
  const errors = {};
  const payload = {};
  const tipo = form.tipoDocumento ?? 'CC';

  if (mode === 'create') {
    if (!TIPOS_DOCUMENTO.some((item) => item.value === tipo)) errors.tipoDocumento = 'Selecciona el tipo de documento.';
    else payload.tipoDocumento = tipo;
  }

  const numero = String(form.numeroDocumento ?? '').trim().toUpperCase();
  const numeroPattern = ALFANUMERICOS.has(tipo) ? /^[A-Z0-9]{4,20}$/ : /^\d{4,20}$/;
  if (!numero) errors.numeroDocumento = 'Escribe el número de documento.';
  else if (!numeroPattern.test(numero)) {
    errors.numeroDocumento = ALFANUMERICOS.has(tipo)
      ? 'Usa de 4 a 20 letras o números, sin espacios ni guiones.'
      : 'Usa de 4 a 20 dígitos, sin puntos ni espacios.';
  } else payload.numeroDocumento = numero;

  for (const [field, label] of [['nombres', 'los nombres'], ['apellidos', 'los apellidos']]) {
    const value = String(form[field] ?? '').trim().replace(/\s+/g, ' ');
    if (!value) errors[field] = `Escribe ${label}.`;
    else if (!NAME.test(value)) errors[field] = 'Usa solo letras, espacios, apóstrofo o guion (máximo 80 caracteres).';
    else payload[field] = value;
  }

  const fecha = String(form.fechaNacimiento ?? '').trim();
  if (!fecha) errors.fechaNacimiento = 'Selecciona la fecha de nacimiento.';
  else if (!isInputDate(fecha) || fecha < '1900-01-01') errors.fechaNacimiento = 'La fecha no es válida.';
  else if (fecha >= todayKey(today)) errors.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy.';
  else payload.fechaNacimiento = fecha;

  const valid = Object.keys(errors).length === 0;
  return { errors, payload: valid ? payload : null };
}

/** Inicio y fin del día local en ISO, para que "hasta" incluya el día completo. */
export function dayRangeIso(desde, hasta) {
  const [y1, m1, d1] = desde.split('-').map(Number);
  const [y2, m2, d2] = hasta.split('-').map(Number);
  return {
    fechaDesde: new Date(y1, m1 - 1, d1, 0, 0, 0, 0).toISOString(),
    fechaHasta: new Date(y2, m2 - 1, d2, 23, 59, 59, 999).toISOString()
  };
}

/**
 * Filtros → query. El backend solo aplica el rango si llegan las dos fechas;
 * se valida aquí para no ignorar en silencio un filtro incompleto.
 * Devuelve { params, error }.
 */
export function graduadoFilters({ numeroDocumento = '', nombres = '', apellidos = '', estado = '', desde = '', hasta = '' } = {}) {
  const params = {
    numeroDocumento: numeroDocumento.trim().toUpperCase() || undefined,
    nombres: nombres.trim() || undefined,
    apellidos: apellidos.trim() || undefined,
    estado: estado === 'true' || estado === 'false' ? estado : undefined
  };
  if (desde || hasta) {
    if (!desde || !hasta) return { params: null, error: 'Para filtrar por fecha de registro indica "desde" y "hasta".' };
    if (!isInputDate(desde) || !isInputDate(hasta)) return { params: null, error: 'Las fechas del filtro no son válidas.' };
    if (desde > hasta) return { params: null, error: 'La fecha "desde" no puede ser posterior a "hasta".' };
    Object.assign(params, dayRangeIso(desde, hasta));
  }
  return { params, error: '' };
}

/** POST graduados responde 400 { msg, graduado } si el documento ya existe (registro global). */
export function existingGraduado(error) {
  const data = error?.response?.data;
  return error?.response?.status === 400 && data?.graduado && typeof data.graduado === 'object' ? data.graduado : null;
}
