import { isInputDate, toInputDate } from './formatters.js';

// Modos del formulario de institución, según lo que acepta cada endpoint:
// - create: POST institutions (usuario INSTITUCION sin institución, todos obligatorios).
// - admin:  PUT institutions/:id (ADMIN; puede cambiar el código).
// - me:     PUT institutions/me  (INSTITUCION; el código no se puede cambiar).
export const INSTITUCION_MODES = Object.freeze({ CREATE: 'create', ADMIN: 'admin', ME: 'me' });

export const EMPTY_INSTITUCION = Object.freeze({
  codigoInstitucion: '',
  nombreInstitucion: '',
  ciudad: '',
  departamento: '',
  resolucion: '',
  fechaResolucion: ''
});

export function extractInstitucion(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return payload.institucion && typeof payload.institucion === 'object' ? payload.institucion : payload;
}

export function institucionToForm(institucion) {
  return {
    codigoInstitucion: institucion?.codigoInstitucion != null ? String(institucion.codigoInstitucion) : '',
    nombreInstitucion: institucion?.nombreInstitucion ?? '',
    ciudad: institucion?.ciudad ?? '',
    departamento: institucion?.departamento ?? '',
    resolucion: institucion?.resolucion ?? '',
    fechaResolucion: toInputDate(institucion?.fechaResolucion)
  };
}

const TEXT_FIELDS = [
  ['nombreInstitucion', 'Escribe el nombre de la institución.'],
  ['ciudad', 'Escribe la ciudad.'],
  ['departamento', 'Escribe el departamento.'],
  ['resolucion', 'Escribe el número de resolución.']
];

/** Devuelve { errors, payload }; payload es null si hay errores. */
export function validateInstitucion(form = {}, mode = INSTITUCION_MODES.CREATE, today = new Date()) {
  const errors = {};
  const payload = {};
  const withCode = mode !== INSTITUCION_MODES.ME;

  if (withCode) {
    const code = String(form.codigoInstitucion ?? '').trim();
    if (!code) errors.codigoInstitucion = 'Escribe el código de la institución.';
    else if (!/^\d{1,12}$/.test(code) || Number(code) <= 0) errors.codigoInstitucion = 'El código debe ser un número entero positivo.';
    else payload.codigoInstitucion = Number(code);
  }

  for (const [field, message] of TEXT_FIELDS) {
    const value = String(form[field] ?? '').trim();
    if (!value) errors[field] = message;
    else payload[field] = value;
  }

  const fecha = String(form.fechaResolucion ?? '').trim();
  if (!fecha) errors.fechaResolucion = 'Selecciona la fecha de la resolución.';
  else if (!isInputDate(fecha)) errors.fechaResolucion = 'La fecha no es válida.';
  else {
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (fecha > todayKey) errors.fechaResolucion = 'La fecha de resolución no puede ser futura.';
    else payload.fechaResolucion = fecha;
  }

  const valid = Object.keys(errors).length === 0;
  return { errors, payload: valid ? payload : null };
}

/** Filtros del listado ADMIN → query del API (estado 'true'/'false'). */
export function institucionFilters({ nombreInstitucion = '', ciudad = '', estado = '' } = {}) {
  return {
    nombreInstitucion: nombreInstitucion.trim() || undefined,
    ciudad: ciudad.trim() || undefined,
    estado: estado === 'true' || estado === 'false' ? estado : undefined
  };
}
