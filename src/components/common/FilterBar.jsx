import { btnNeutral, btnPrimary } from './ui';

/**
 * Barra de filtros: los campos se aplican al enviar (Enter o "Buscar"),
 * no en cada tecla, para no disparar una consulta por carácter.
 */
export default function FilterBar({ onSubmit, onClear, children, busy = false, label = 'Filtros' }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };
  return (
    <form role="search" aria-label={label} onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      <div className="grid grid-cols-2 gap-2 lg:flex">
        <button type="submit" className={btnPrimary} disabled={busy}>Buscar</button>
        <button type="button" className={btnNeutral} onClick={onClear} disabled={busy}>Limpiar</button>
      </div>
    </form>
  );
}
