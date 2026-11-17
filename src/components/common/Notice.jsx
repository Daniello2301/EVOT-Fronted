const STYLES = {
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-11.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4ZM10 14.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z' },
  success: { box: 'border-green-200 bg-green-50 text-green-800', icon: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.53-9.47a.75.75 0 0 0-1.06-1.06L9 10.94 7.53 9.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4-4Z' },
  info: { box: 'border-blue-200 bg-blue-50 text-blue_dark', icon: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-8.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4ZM10 7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z' },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', icon: 'M8.48 2.76a1.75 1.75 0 0 1 3.04 0l6.25 11.1A1.75 1.75 0 0 1 16.25 16.5H3.75a1.75 1.75 0 0 1-1.52-2.64l6.25-11.1ZM9.25 7.5v3.5a.75.75 0 0 0 1.5 0V7.5a.75.75 0 0 0-1.5 0ZM10 14.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' }
};

/**
 * Aviso en bloque (resumen sobre el formulario o la tabla, como indica DESIGN.md).
 * Los errores se anuncian con role="alert"; el resto con role="status" (no roba el foco).
 */
export default function Notice({ tone = 'info', title, children, onClose, action }) {
  const style = STYLES[tone] ?? STYLES.info;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${style.box}`}>
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0">
        <path fillRule="evenodd" clipRule="evenodd" d={style.icon} />
      </svg>
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="-m-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/5" aria-label="Cerrar aviso">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L8.94 10l-4.72 4.72a.75.75 0 1 0 1.06 1.06L10 11.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L11.06 10l4.72-4.72a.75.75 0 0 0-1.06-1.06L10 8.94 5.28 4.22Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
