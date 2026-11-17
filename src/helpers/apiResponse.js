// Normalización de respuestas y errores del API de EVOT.
// El backend no usa un envelope único: algunos endpoints devuelven el documento
// "pelado", otros { msg, <recurso> }, y los listados paginados { total, page,
// limit, totalPages, results }. Estas funciones aíslan esa variación de las vistas.

export const DEFAULT_LIMIT = 10;

const toPositiveInt = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

export function emptyPage(limit = DEFAULT_LIMIT) {
  return { results: [], total: 0, page: 1, limit, totalPages: 1 };
}

/** Convierte cualquier respuesta de listado en { results, total, page, limit, totalPages }. */
export function extractPage(payload, { page = 1, limit = DEFAULT_LIMIT } = {}) {
  if (Array.isArray(payload)) {
    return { results: payload, total: payload.length, page: 1, limit: payload.length || limit, totalPages: 1 };
  }
  const results = Array.isArray(payload?.results) ? payload.results : [];
  const resolvedLimit = toPositiveInt(payload?.limit) ?? limit;
  const resolvedPage = toPositiveInt(payload?.page) ?? page;
  const total = Number.isFinite(Number(payload?.total)) && payload?.total !== null && payload?.total !== undefined
    ? Math.max(0, Number(payload.total))
    : results.length;
  const totalPages = toPositiveInt(payload?.totalPages) ?? Math.max(1, Math.ceil(total / resolvedLimit));
  return { results, total, page: resolvedPage, limit: resolvedLimit, totalPages };
}

/** Quita filtros vacíos y recorta textos para no enviar `?nombres=` al API. */
export function cleanParams(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;
    const normalized = typeof value === 'string' ? value.trim() : value;
    if (normalized === '') return acc;
    acc[key] = normalized;
    return acc;
  }, {});
}

export const isNotFound = (error) => error?.response?.status === 404;

/** Mensaje legible en español para cualquier error de Axios o de validación local. */
export function apiErrorMessage(error, fallback = 'No se pudo completar la operación.') {
  const response = error?.response;
  if (!response) {
    if (error?.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder. Inténtalo de nuevo.';
    if (error?.request) return 'No hay conexión con el servidor. Revisa tu conexión e inténtalo de nuevo.';
    return error?.message || fallback;
  }
  const data = response.data;
  if (typeof data === 'string') {
    const text = data.trim();
    if (text && !text.startsWith('<')) return text;
  }
  if (Array.isArray(data?.errors) && data.errors.length) {
    const messages = data.errors
      .map((item) => (typeof item === 'string' ? item : item?.msg))
      .filter(Boolean);
    if (messages.length) return messages.join(' ');
  }
  if (typeof data?.msg === 'string' && data.msg) return data.msg;
  if (typeof data?.message === 'string' && data.message) return data.message;
  if (response.status === 429) return 'Demasiadas solicitudes. Espera unos minutos e inténtalo de nuevo.';
  if (response.status === 413) return 'El archivo supera el tamaño permitido.';
  if (response.status >= 500) return 'Error interno del servidor. Inténtalo más tarde.';
  return fallback;
}
