import { btnNeutral } from './ui';
import { formatNumber } from '../../helpers/formatters.js';

/** Paginación de servidor: Anterior / Siguiente + resumen. */
export default function Pagination({ page = 1, totalPages = 1, total, onChange, disabled = false, itemLabel = 'registros' }) {
  const safeTotalPages = Math.max(1, totalPages);
  const canPrev = !disabled && page > 1;
  const canNext = !disabled && page < safeTotalPages;
  return (
    <nav aria-label="Paginación" className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600" aria-live="polite">
        Página <span className="font-semibold text-gray-900">{page}</span> de <span className="font-semibold text-gray-900">{safeTotalPages}</span>
        {Number.isFinite(total) && <> · {formatNumber(total)} {itemLabel}</>}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button type="button" className={btnNeutral} disabled={!canPrev} onClick={() => onChange(page - 1)}>
          <span aria-hidden="true">‹</span> Anterior
        </button>
        <button type="button" className={btnNeutral} disabled={!canNext} onClick={() => onChange(page + 1)}>
          Siguiente <span aria-hidden="true">›</span>
        </button>
      </div>
    </nav>
  );
}
