import { Modal } from 'flowbite-react';
import { btnNeutral } from './ui';

/**
 * Modal de solo lectura con una lista de datos.
 * items: [{ label, value, wide? }]
 */
export default function DetailModal({ show, title, items = [], onClose, footer }) {
  return (
    <Modal show={show} onClose={onClose} size="lg" dismissible>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className={item.wide ? 'sm:col-span-2' : ''}>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{item.label}</dt>
              <dd className="mt-0.5 whitespace-pre-line break-words text-sm text-gray-900">{item.value ?? '—'}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
          <button type="button" className={btnNeutral} onClick={onClose}>Cerrar</button>
          {footer}
        </div>
      </Modal.Body>
    </Modal>
  );
}
