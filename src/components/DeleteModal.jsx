import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { deactivateDiploma } from '../services/diplomas.service';
import { diplomaError, diplomaId } from '../helpers/diplomaModel.js';

export default function DeleteModal({ open, diploma, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const close = () => { if (!saving) { setError(''); onClose?.(); } };
  const confirm = async () => {
    if (saving || !diploma) return;
    const id = diplomaId(diploma);
    if (!id) { setError('No se encontró el identificador del diploma.'); return; }
    setSaving(true);
    setError('');
    try {
      await deactivateDiploma(id);
      onSaved?.('Diploma desactivado correctamente.');
      onClose?.();
    } catch (err) {
      setError(diplomaError(err));
    } finally { setSaving(false); }
  };
  return (
    <Modal show={open} onClose={close} size="md">
      <Modal.Header>Desactivar diploma</Modal.Header>
      <Modal.Body>
        <p className="text-gray-700">¿Deseas desactivar el diploma <strong>{diploma?.codigoDiploma || 'seleccionado'}</strong>?</p>
        <p className="mt-2 text-sm text-gray-500">El registro dejará de estar activo. Esta operación no elimina físicamente el diploma.</p>
        {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={close} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700">Cancelar</button>
          <button type="button" onClick={confirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white disabled:opacity-60">{saving ? 'Desactivando...' : 'Sí, desactivar'}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
