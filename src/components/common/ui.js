// Clases compartidas del panel, alineadas con DESIGN.md:
// - Azul Institucional (blue_primary) para la acción principal de confianza.
// - rounded-lg por defecto; rojo solo para acciones destructivas.
// - Altura mínima de 44px en controles táctiles.
// - El anillo de foco lo pone :focus-visible global (index.css); no se sobrescribe aquí.

const base = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';

export const btnPrimary = `${base} bg-blue_primary text-white hover:bg-blue_dark`;
export const btnSecondary = `${base} border border-blue_primary bg-white text-blue_primary hover:bg-blue-50`;
export const btnNeutral = `${base} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
export const btnDanger = `${base} bg-red-600 text-white hover:bg-red-700`;
export const btnDangerOutline = `${base} border border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white`;

/** Acción de fila en tablas: texto con área táctil suficiente. */
export const btnLink = 'inline-flex min-h-[44px] items-center rounded-lg px-2 text-sm font-semibold text-blue_primary hover:bg-blue-50 hover:underline disabled:cursor-not-allowed disabled:opacity-50';
export const btnLinkDanger = 'inline-flex min-h-[44px] items-center rounded-lg px-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:underline disabled:cursor-not-allowed disabled:opacity-50';

export const inputClass = 'block w-full min-h-[44px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue_primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 sm:text-sm aria-[invalid=true]:border-red-500 aria-[invalid=true]:bg-red-50';

/** Etiqueta en Azul Institucional (Regla de la Etiqueta Azul). */
export const labelClass = 'mb-1.5 block text-sm font-medium text-blue_primary';
