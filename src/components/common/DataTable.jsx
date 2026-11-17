import Notice from './Notice';
import { btnNeutral } from './ui';

const getValueByPath = (row, path) =>
  path ? path.split('.').reduce((value, key) => (value == null ? value : value[key]), row) : undefined;

const cellValue = (column, row) => {
  const value = column.render ? column.render(row) : getValueByPath(row, column.key);
  return value === null || value === undefined || value === '' ? '—' : value;
};

function SkeletonRows({ columns }) {
  return (
    <div aria-hidden="true" className="divide-y divide-gray-100">
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="flex gap-4 px-4 py-4">
          {columns.slice(0, 4).map((column) => (
            <div key={column.header} className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Tabla reutilizable.
 * - columns: [{ header, key?, render?(row), primary?, hideOnMobile?, className? }]
 *   key admite rutas con punto ("institucion.nombreInstitucion").
 * - En pantallas < md se muestra como lista de tarjetas (sin scroll horizontal):
 *   la columna `primary` va como título y la columna sin header visible
 *   (acciones) va al pie de la tarjeta.
 * - Estados: cargando (skeleton), error (con reintentar) y vacío.
 */
function DataTable({
  columns,
  rows,
  loading = false,
  error = '',
  onRetry,
  emptyMessage = 'No hay datos para mostrar.',
  emptyAction,
  getRowKey,
  caption
}) {
  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Cargando…</span>
        <SkeletonRows columns={columns} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Notice tone="error" action={onRetry && <button type="button" className={btnNeutral} onClick={onRetry}>Reintentar</button>}>
          {error}
        </Notice>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p className="max-w-sm text-sm text-gray-600">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  const keyFor = (row, index) => (getRowKey ? getRowKey(row) : row?._id ?? index);
  const primary = columns.find((column) => column.primary) ?? columns[0];
  const actions = columns.find((column) => column.actions);
  const detailColumns = columns.filter((column) => column !== primary && column !== actions && !column.hideOnMobile);

  return (
    <>
      {/* Móvil: tarjetas */}
      <ul className="divide-y divide-gray-200 md:hidden">
        {rows.map((row, index) => (
          <li key={keyFor(row, index)} className="space-y-3 p-4">
            <div className="text-base font-semibold text-black_primary">{cellValue(primary, row)}</div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {detailColumns.map((column) => (
                <div key={column.header} className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{column.header}</dt>
                  <dd className="break-words text-sm text-gray-900">{cellValue(column, row)}</dd>
                </div>
              ))}
            </dl>
            {actions && <div className="-mx-2 flex flex-wrap gap-1">{actions.render(row)}</div>}
          </li>
        ))}
      </ul>

      {/* Escritorio: tabla */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm text-gray-700">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              {columns.map((column) => (
                <th key={column.header} scope="col" className={`whitespace-nowrap px-4 py-3 font-semibold ${column.actions ? 'text-right' : ''}`}>
                  {column.actions ? <span className="sr-only">{column.header}</span> : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr key={keyFor(row, index)} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.header} className={`px-4 py-2 align-middle ${column.actions ? 'text-right' : ''} ${column.className ?? ''}`}>
                    {column.actions ? <div className="flex justify-end gap-1">{column.render(row)}</div> : cellValue(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DataTable;
