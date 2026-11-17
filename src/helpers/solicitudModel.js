import { isInputDate } from './formatters.js';

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export const MAX_EXPIRACION_MESES = 3;

/** Fin del día local (23:59:59.999) de una fecha aaaa-mm-dd, en ISO. */
export function endOfLocalDayIso(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
}

/** Límite que aplica el backend: ahora + 3 meses (Date#setMonth). */
export function maxExpiracion(now = new Date()) {
  const max = new Date(now.getTime());
  max.setMonth(max.getMonth() + MAX_EXPIRACION_MESES);
  return max;
}

/** Último día seleccionable (aaaa-mm-dd local) cuyo fin de día no supera el límite del backend. */
export function maxExpiracionInputDate(now = new Date()) {
  const max = maxExpiracion(now);
  const lastDay = new Date(max.getFullYear(), max.getMonth(), max.getDate(), 23, 59, 59, 999);
  if (lastDay > max) lastDay.setDate(lastDay.getDate() - 1);
  const pad = (n) => String(n).padStart(2, '0');
  return `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;
}

const isPdf = (file) => file?.type === 'application/pdf' || (!file?.type && /\.pdf$/i.test(file?.name ?? ''));

/**
 * Aprobación de una solicitud de documento: PDF ≤ 10 MB y fecha hasta la que
 * estará disponible la descarga (desde hoy, máximo 3 meses). Devuelve
 * { errors, payload: { archivo, fechaExpiracion(ISO) } }.
 */
export function validateAprobacion({ archivo = null, fechaExpiracion = '' } = {}, now = new Date()) {
  const errors = {};
  let iso = null;
  if (!archivo) errors.archivo = 'Adjunta el documento oficial en PDF.';
  else if (!isPdf(archivo)) errors.archivo = 'El archivo debe ser un PDF.';
  else if (archivo.size > MAX_PDF_BYTES) errors.archivo = 'El PDF supera el máximo de 10 MB.';
  else if (archivo.size === 0) errors.archivo = 'El archivo está vacío.';

  if (!fechaExpiracion) errors.fechaExpiracion = 'Selecciona hasta cuándo estará disponible el documento.';
  else if (!isInputDate(fechaExpiracion)) errors.fechaExpiracion = 'La fecha no es válida.';
  else {
    iso = endOfLocalDayIso(fechaExpiracion);
    const end = new Date(iso);
    if (end < now) errors.fechaExpiracion = 'La fecha no puede ser anterior a hoy.';
    else if (end > maxExpiracion(now)) errors.fechaExpiracion = `La fecha no puede superar ${MAX_EXPIRACION_MESES} meses desde hoy.`;
  }
  const valid = Object.keys(errors).length === 0;
  return { errors, payload: valid ? { archivo, fechaExpiracion: iso } : null };
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
