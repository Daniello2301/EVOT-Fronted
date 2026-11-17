import { cloneElement, isValidElement } from 'react';
import { labelClass } from './ui';

/**
 * Campo con etiqueta visible (azul institucional), ayuda persistente y error
 * debajo del campo. Inyecta id, aria-invalid y aria-describedby en el control.
 */
export default function FormField({ id, label, required = false, hint, error, className = '', children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        required: children.props.required ?? required,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy
      })
    : children;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>}
      </label>
      {control}
      {hint && <p id={hintId} className="mt-1 text-xs text-slate-600">{hint}</p>}
      {error && <p id={errorId} className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}
