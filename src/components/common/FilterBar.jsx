import { useId, useState } from 'react';
import { btnNeutral, btnPrimary } from './ui';

/**
 * Barra de filtros: los campos se aplican al enviar (Enter o "Buscar"),
 * no en cada tecla, para no disparar una consulta por carácter.
 * En pantallas < lg se pliega detrás de un botón para que los datos se vean primero.
 */
export default function FilterBar({ onSubmit, onClear, children, busy = false, label = 'Filtros' }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
    setOpen(false);
  };
  return (
    <div>
      <button
        type="button"
        className={`${btnNeutral} w-full justify-between lg:hidden`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="inline-flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" />
          </svg>
          {label}
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
        </svg>
      </button>
      <form
        id={panelId}
        role="search"
        aria-label={label}
        onSubmit={handleSubmit}
        className={`${open ? 'mt-4 flex' : 'hidden'} flex-col gap-3 lg:mt-0 lg:flex lg:flex-row lg:items-end`}
      >
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <button type="submit" className={btnPrimary} disabled={busy}>Buscar</button>
          <button type="button" className={btnNeutral} onClick={() => { onClear?.(); setOpen(false); }} disabled={busy}>Limpiar</button>
        </div>
      </form>
    </div>
  );
}
