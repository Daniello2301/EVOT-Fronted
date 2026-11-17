import { isInputDate } from './formatters.js';

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export const MAX_EXPIRACION_MESES = 3;

// Contrato real del backend (rutas/solicitudDocumento.js): `fechaExpiracion`
// pasa por express-validator isDate(), que solo acepta aaaa-mm-dd. Luego
// `new Date(valor)` la toma como medianoche UTC y exige que no haya pasado y
// que no supere ahora + 3 meses. Por eso se envía la fecha sola y se validan
// los mismos límites sobre su medianoche UTC.

const pad = (n) => String(n).padStart(2, '0');
const utcKey = (date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
export const utcMidnight = (value) => new Date(`${value}T00:00:00.000Z`);

/** Límite que aplica el backend: ahora + 3 meses (Date#setMonth). */
export function maxExpiracion(now = new Date()) {
  const max = new Date(now.getTime());
  max.setMonth(max.getMonth() + MAX_EXPIRACION_MESES);
  return max;
}

/** Primer día aceptado: aquel cuya medianoche UTC todavía no ha pasado. */
export function minExpiracionInputDate(now = new Date()) {
  const today = utcKey(now);
  if (utcMidnight(today) >= now) return today;
  const next = new Date(utcMidnight(today).getTime() + 24 * 60 * 60 * 1000);
  return utcKey(next);
}

/** Último día aceptado: aquel cuya medianoche UTC no supera ahora + 3 meses. */
export function maxExpiracionInputDate(now = new Date()) {
  return utcKey(maxExpiracion(now));
}

const isPdf = (file) => file?.type === 'application/pdf' || (!file?.type && /\.pdf$/i.test(file?.name ?? ''));

/**
 * Aprobación de una solicitud de documento: PDF ≤ 10 MB y fecha de vencimiento
 * (aaaa-mm-dd). Devuelve { errors, payload: { archivo, fechaExpiracion } }.
 */
export function validateAprobacion({ archivo = null, fechaExpiracion = '' } = {}, now = new Date()) {
  const errors = {};
  if (!archivo) errors.archivo = 'Adjunta el documento oficial en PDF.';
  else if (!isPdf(archivo)) errors.archivo = 'El archivo debe ser un PDF.';
  else if (archivo.size > MAX_PDF_BYTES) errors.archivo = 'El PDF supera el máximo de 10 MB.';
  else if (archivo.size === 0) errors.archivo = 'El archivo está vacío.';

  if (!fechaExpiracion) errors.fechaExpiracion = 'Selecciona la fecha de vencimiento.';
  else if (!isInputDate(fechaExpiracion)) errors.fechaExpiracion = 'La fecha no es válida.';
  else if (utcMidnight(fechaExpiracion) < now) errors.fechaExpiracion = 'Elige una fecha a partir de mañana.';
  else if (utcMidnight(fechaExpiracion) > maxExpiracion(now)) errors.fechaExpiracion = `La fecha no puede superar ${MAX_EXPIRACION_MESES} meses desde hoy.`;

  const valid = Object.keys(errors).length === 0;
  return { errors, payload: valid ? { archivo, fechaExpiracion } : null };
}

/** La institución solo puede descargar documentos aprobados y vigentes (si no, el API responde 404/410). */
export function isDescargable(solicitud, now = new Date()) {
  if (solicitud?.estado !== 'APROBADO' || !solicitud?.fechaExpiracion) return false;
  const expira = new Date(solicitud.fechaExpiracion);
  return !Number.isNaN(expira.getTime()) && expira > now;
}

export function nombreArchivoDescarga(solicitud) {
  const parts = ['documento', solicitud?.diploma?.codigoDiploma, solicitud?.apellidos]
    .filter(Boolean)
    .map((part) => String(part).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean);
  return `${parts.join('_').toLowerCase() || 'documento'}.pdf`;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
