import { useCallback, useEffect, useRef, useState } from 'react';
import { apiErrorMessage, cleanParams, emptyPage, extractPage, isNotFound, DEFAULT_LIMIT } from '../helpers/apiResponse.js';

/**
 * Estado de un listado paginado en servidor.
 * fetchPage(params) debe devolver el payload del API ({ results, total, ... }).
 * Varios endpoints responden 404 cuando no hay registros; se trata como lista vacía.
 */
export default function usePagedList(fetchPage, { limit = DEFAULT_LIMIT, initialFilters = {}, notFoundIsEmpty = true, enabled = true } = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(() => emptyPage(limit));
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    setLoading(true);
    setError('');
    Promise.resolve()
      .then(() => fetchRef.current(cleanParams({ ...filters, page, limit })))
      .then((payload) => {
        if (active) setData(extractPage(payload, { page, limit }));
      })
      .catch((err) => {
        if (!active) return;
        setData(emptyPage(limit));
        if (!(notFoundIsEmpty && isNotFound(err))) {
          setError(apiErrorMessage(err, 'No se pudo cargar la información.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [filters, page, limit, reloadKey, notFoundIsEmpty, enabled]);

  // Si una desactivación deja la página actual vacía, volver a la última válida.
  useEffect(() => {
    if (!loading && !error && page > 1 && page > data.totalPages) setPage(data.totalPages);
  }, [loading, error, page, data.totalPages]);

  const applyFilters = useCallback((next) => {
    setFilters(next);
    setPage(1);
  }, []);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    rows: data.results,
    total: data.total,
    totalPages: data.totalPages,
    page,
    setPage,
    loading,
    error,
    filters,
    applyFilters,
    reload
  };
}
