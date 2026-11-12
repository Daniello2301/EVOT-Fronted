const getValueByPath = (row, path) =>
  path.split('.').reduce((value, key) => (value == null ? value : value[key]), row);

/**
 * Tabla genérica reutilizable: columnas configurables, sin estilos por-página repetidos.
 * columns: [{ header, key?, render?(row) }] — key soporta rutas con punto ("institucion.nombreInstitucion").
 */
function DataTable({ columns, rows, loading, emptyMessage = 'No hay datos para mostrar.', getRowKey }) {
  if (loading) {
    return <p className="px-4 py-6 text-sm text-gray-500">Cargando...</p>;
  }

  if (!rows || rows.length === 0) {
    return <p className="px-4 py-6 text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th key={column.header} scope="col" className="px-4 py-3">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={getRowKey ? getRowKey(row) : row._id ?? index} className="border-b">
            {columns.map((column) => (
              <td key={column.header} className="px-4 py-3">
                {column.render ? column.render(row) : getValueByPath(row, column.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
