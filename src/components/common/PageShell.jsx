import PageMeta from './PageMeta';

/**
 * Contenedor estándar de una sección del panel: encabezado (título Sora,
 * descripción, acción principal), barra de filtros opcional y una superficie
 * blanca con el Sello Evot (sombra azulada) en lugar de la sombra gris heredada.
 */
export default function PageShell({ title, description, actions, toolbar, notices, children, footer }) {
  return (
    <section className="mx-auto w-full max-w-screen-xl">
      <PageMeta title={`${title} | EVOT`} description={description} />
      <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-black_primary sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 sm:justify-end [&>*]:flex-1 sm:[&>*]:flex-none">{actions}</div>}
      </header>
      {notices && <div className="mb-4 space-y-3">{notices}</div>}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-evot-card">
        {toolbar && <div className="border-b border-gray-200 p-4">{toolbar}</div>}
        {children}
        {footer}
      </div>
    </section>
  );
}
