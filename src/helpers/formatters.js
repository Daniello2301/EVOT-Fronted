// Fechas: el backend guarda las fechas de calendario (nacimiento, grados,
// resolución) como medianoche UTC. Se formatean en UTC para no restar un día
// en zonas horarias negativas como America/Bogota.

const pad = (value) => String(value).padStart(2, '0');

const toDate = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** dd/mm/aaaa, o "—" si no hay fecha válida. */
export function formatDate(value) {
  const date = toDate(value);
  if (!date) return '—';
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}

/** dd/mm/aaaa hh:mm en hora local, para marcas de tiempo (creación, revisión). */
export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return '—';
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Valor para <input type="date"> (aaaa-mm-dd). */
export function toInputDate(value) {
  const date = toDate(value);
  if (!date) return '';
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Fecha local de hoy desplazada `days` días, como aaaa-mm-dd (para min/max de inputs). */
export function localInputDate(days = 0, now = new Date()) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** aaaa-mm-dd que corresponde a una fecha real (rechaza 2026-02-30). */
export function isInputDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function fullName(person) {
  return [person?.nombres, person?.apellidos].filter(Boolean).join(' ').trim() || '—';
}

export function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('es-CO') : '—';
}
