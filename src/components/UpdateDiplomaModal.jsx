import DiplomaFormModal from './DiplomaFormModal';
import { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import { solicitarEdicion } from '../services/diplomas.service';
import { diplomaError, diplomaId, assertDiplomaMutation } from '../helpers/diplomaModel.js';

export default function UpdateDiplomaModal({ open, diploma, onClose, onSaved }) {
  const { authUser } = useAuth();
  const [reason, setReason] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    setReason('');
    setMessage('');
    setError('');
  }, [open, diploma]);
  const expired = diploma?.fechaExpiracionEdicion && new Date(diploma.fechaExpiracionEdicion) <= new Date();
  const needsPermission = authUser?.rol === 'INSTITUCION' && (!diploma?.editableTemporalmente || expired);
  const requestPermission = async (event) => {
    event.preventDefault();
    if (sending || message || !reason.trim() || !diplomaId(diploma)) return;
    setSending(true);
    setError('');
    try {
      const result = assertDiplomaMutation(await solicitarEdicion(diplomaId(diploma), reason.trim()));
      setMessage(result?.msg || 'Solicitud enviada correctamente.');
    } catch (err) {
      setError(diplomaError(err, 'No fue posible enviar la solicitud.'));
    } finally {
      setSending(false);
    }
  };
  if (needsPermission) return (
    <Modal show={open} onClose={() => { if (!sending) onClose?.(); }}>
      <Modal.Header>Solicitar edición de diploma</Modal.Header>
      <Modal.Body>
        <p className="mb-4 text-sm text-gray-600">La edición requiere aprobación del administrador. Una vez aprobada, tendrás 48 horas para editar.</p>
        <form onSubmit={requestPermission} className="space-y-4">
          <label htmlFor="edit-request-reason" className="block text-sm font-medium">Motivo de la solicitud</label>
          <textarea id="edit-request-reason" required value={reason} disabled={sending || !!message}
            onChange={(event) => setReason(event.target.value)} className="w-full rounded-lg border p-3" />
          {error && <p role="alert" className="text-red-700">{error}</p>}
          {message && <p role="status" className="text-green-700">{message}</p>}
          <button type="submit" disabled={sending || !!message || !reason.trim()} className="rounded-lg bg-blue_primary px-4 py-2 text-white disabled:opacity-50">
            {sending ? 'Enviando...' : 'Solicitar edición'}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
  return <DiplomaFormModal open={open} onClose={onClose} onSaved={onSaved} mode="edit" diploma={diploma} />;
}
