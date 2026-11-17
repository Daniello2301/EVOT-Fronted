import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormModal from '../common/FormModal';
import FormField from '../common/FormField';
import { inputClass } from '../common/ui';
import { resetPasswordService } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { apiErrorMessage } from '../../helpers/apiResponse.js';
import { MIN_PASSWORD_LENGTH, validatePasswordChange } from '../../helpers/passwordChange.js';

const EMPTY = { actual: '', nueva: '', confirmacion: '' };

/**
 * Cambio de contraseña propio (PUT auth/reset-password). El backend revoca
 * todas las sesiones al cambiarla, así que al terminar se cierra la sesión
 * local y se envía al login con un aviso.
 */
export default function ChangePasswordModal({ show, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) { setForm(EMPTY); setErrors({}); setError(''); }
  }, [show]);

  const onChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = async () => {
    const { errors: nextErrors, payload } = validatePasswordChange(form);
    setErrors(nextErrors);
    setError('');
    if (!payload) {
      document.getElementById(`password-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await resetPasswordService(payload);
      await logout({ notifyServer: false });
      navigate('/login', { replace: true, state: { notice: 'Tu contraseña se actualizó. Inicia sesión con la nueva contraseña.' } });
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo cambiar la contraseña.'));
      setSaving(false);
    }
  };

  return (
    <FormModal show={show} title="Cambiar contraseña" onClose={onClose} onSubmit={submit} busy={saving} error={error} submitLabel="Cambiar contraseña" size="md">
      <p className="text-sm text-slate-600">Al cambiarla se cerrarán todas tus sesiones abiertas, incluida esta.</p>
      <FormField id="password-actual" label="Contraseña actual" required error={errors.actual}>
        <input name="actual" type="password" autoComplete="current-password" className={inputClass} value={form.actual} onChange={onChange} />
      </FormField>
      <FormField id="password-nueva" label="Nueva contraseña" required hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`} error={errors.nueva}>
        <input name="nueva" type="password" autoComplete="new-password" className={inputClass} value={form.nueva} onChange={onChange} />
      </FormField>
      <FormField id="password-confirmacion" label="Confirmar nueva contraseña" required error={errors.confirmacion}>
        <input name="confirmacion" type="password" autoComplete="new-password" className={inputClass} value={form.confirmacion} onChange={onChange} />
      </FormField>
    </FormModal>
  );
}
