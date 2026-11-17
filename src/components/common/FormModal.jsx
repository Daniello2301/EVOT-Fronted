import { Modal } from 'flowbite-react';
import Notice from './Notice';
import { btnNeutral, btnPrimary, btnDanger } from './ui';

/**
 * Modal de formulario con el patrón existente (contenedor blanco, rounded-lg,
 * botón X de cierre). Mientras `busy` no se puede cerrar, para no perder una
 * operación en curso. El pie con Cancelar/Enviar queda fijo en el formulario.
 */
export default function FormModal({
  show,
  title,
  onClose,
  onSubmit,
  busy = false,
  error = '',
  submitLabel = 'Guardar',
  busyLabel = 'Guardando...',
  danger = false,
  size = '2xl',
  submitDisabled = false,
  children
}) {
  const close = () => { if (!busy) onClose?.(); };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!busy) onSubmit?.(event);
  };

  return (
    <Modal show={show} onClose={close} size={size} dismissible={!busy}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && <Notice tone="error">{error}</Notice>}
          {children}
          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
            <button type="button" className={btnNeutral} onClick={close} disabled={busy}>Cancelar</button>
            <button type="submit" className={danger ? btnDanger : btnPrimary} disabled={busy || submitDisabled} aria-busy={busy}>
              {busy ? busyLabel : submitLabel}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
