import { useState } from 'react';
import CreateDiplomaModal from './CreateDiplomaModal';

export default function HeadTableDiplomas({ search, onSearch, onSaved, canCreate = false }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Diplomas académicos</h2>
          <p className="text-sm text-gray-500">Consulta y administra los diplomas registrados.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="buscar-diploma" className="sr-only">Buscar diplomas</label>
          <input id="buscar-diploma" type="search" value={search} onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar por código, programa o graduado" className="min-w-0 rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 sm:w-64" />
          {canCreate && <button type="button" onClick={() => setOpen(true)} className="rounded-lg bg-blue_primary px-4 py-2.5 text-sm font-medium text-white">
            Agregar diploma
          </button>}
        </div>
      </header>
      {canCreate && <CreateDiplomaModal open={open} onClose={() => setOpen(false)} onSaved={onSaved} />}
    </>
  );
}
