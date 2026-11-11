import { Modal } from 'flowbite-react';

const LABELS = [
  ['codigoDiploma','Código de diploma'], ['nombrePrograma','Programa'],
  ['nivelPrograma','Nivel académico'], ['registroPrograma','Registro del programa'],
  ['libro','Libro de grados'], ['fechaGrados','Fecha de grado'],
];

export default function ReadDiplomaModal({ open, diploma, onClose }) {
  return (
    <Modal show={open} onClose={onClose} size="lg">
      <Modal.Header>Detalles del diploma</Modal.Header>
      <Modal.Body>
        {!diploma ? <p className="text-gray-600">No hay un diploma seleccionado.</p> : (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LABELS.map(([name,label]) => (
              <div key={name}>
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="mt-1 font-medium text-gray-900">{name === 'fechaGrados' ? String(diploma[name] ?? '').slice(0, 10) || '—' : diploma[name] || '—'}</dd>
              </div>
            ))}
            <div><dt className="text-sm text-gray-500">Institución</dt><dd className="mt-1 font-medium text-gray-900">{diploma.institucion?.nombreInstitucion || '—'}</dd></div>
            <div><dt className="text-sm text-gray-500">Graduado</dt><dd className="mt-1 font-medium text-gray-900">{[diploma.graduado?.nombres, diploma.graduado?.apellidos].filter(Boolean).join(' ') || '—'}</dd></div>
            <div><dt className="text-sm text-gray-500">Documento del graduado</dt><dd className="mt-1 font-medium text-gray-900">{diploma.graduado?.numeroDocumento || '—'}</dd></div>
          </dl>
        )}
        <div className="mt-6 flex justify-end"><button type="button" onClick={onClose} className="rounded-lg bg-blue_primary px-4 py-2 text-white">Cerrar</button></div>
      </Modal.Body>
    </Modal>
  );
}
