import { useState } from 'react';
import ConfirmModal from './common/ConfirmModal';
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
    <ConfirmModal show={open} onClose={close} onConfirm={confirm}
      title="Desactivar diploma"
      message={`¿Deseas desactivar el diploma ${diploma?.codigoDiploma || 'seleccionado'}? El registro dejará de estar activo.`}
      confirmLabel="Sí, desactivar" loading={saving} error={error} />
  );
}
