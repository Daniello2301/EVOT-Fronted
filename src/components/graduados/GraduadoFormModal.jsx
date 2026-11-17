import { useEffect, useState } from 'react';
import FormModal from '../common/FormModal';
import FormField from '../common/FormField';
import Notice from '../common/Notice';
import { inputClass } from '../common/ui';
import { createGraduado, updateGraduado } from '../../services/graduado.service';
import { apiErrorMessage } from '../../helpers/apiResponse.js';
import { TIPOS_DOCUMENTO, tipoDocumentoLabel } from '../../helpers/estados.js';
import { formatDate, fullName, localInputDate } from '../../helpers/formatters.js';
import { EMPTY_GRADUADO, existingGraduado, graduadoToForm, validateGraduado } from '../../helpers/graduadoModel.js';

/**
 * Alta (INSTITUCION) o edición (ADMIN) de un graduado.
 * Los graduados son un registro global por número de documento: si ya existe,
 * el backend lo devuelve y se informa en vez de tratarlo como un fallo.
 */
export default function GraduadoFormModal({ show, mode = 'create', graduado = null, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(EMPTY_GRADUADO);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setForm(isEdit ? graduadoToForm(graduado) : { ...EMPTY_GRADUADO });
      setErrors({});
      setError('');
      setExisting(null);
    }
  }, [show, isEdit, graduado]);

  const onChange = (event) => {
    setExisting(null);
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = async () => {
    const { errors: nextErrors, payload } = validateGraduado(form, isEdit ? 'edit' : 'create');
    setErrors(nextErrors);
    setError('');
    setExisting(null);
    if (!payload) {
      document.getElementById(`graduado-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      if (isEdit) await updateGraduado(graduado._id, payload);
      else await createGraduado(payload);
      onSaved(isEdit
        ? `Se actualizaron los datos de ${payload.nombres} ${payload.apellidos}.`
        : `${payload.nombres} ${payload.apellidos} quedó registrado. Aparecerá en tu listado cuando le emitas un diploma.`);
    } catch (err) {
      const found = !isEdit && existingGraduado(err);
      if (found) setExisting(found);
      else setError(apiErrorMessage(err, isEdit ? 'No se pudo actualizar el graduado.' : 'No se pudo registrar el graduado.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal
      show={show}
      title={isEdit ? 'Editar graduado' : 'Registrar graduado'}
      onClose={onClose}
      onSubmit={submit}
      busy={saving}
      error={error}
      submitLabel={isEdit ? 'Guardar cambios' : 'Registrar graduado'}
    >
      {existing && (
        <Notice tone="info" title="Este graduado ya está registrado en EVOT">
          {fullName(existing)} · {tipoDocumentoLabel(existing.tipoDocumento)} {existing.numeroDocumento}
          {existing.fechaNacimiento && <> · nacido el {formatDate(existing.fechaNacimiento)}</>}.
          {' '}No necesitas registrarlo de nuevo: emítele el diploma con este número de documento.
        </Notice>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="graduado-tipoDocumento"
          label="Tipo de documento"
          required={!isEdit}
          error={errors.tipoDocumento}
          hint={isEdit ? 'El tipo de documento no se puede cambiar.' : undefined}
        >
          <select name="tipoDocumento" className={inputClass} value={form.tipoDocumento} onChange={onChange} disabled={isEdit}>
            {TIPOS_DOCUMENTO.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
          </select>
        </FormField>
        <FormField id="graduado-numeroDocumento" label="Número de documento" required error={errors.numeroDocumento}>
          <input name="numeroDocumento" inputMode={['PA', 'PEP'].includes(form.tipoDocumento) ? 'text' : 'numeric'} autoComplete="off" className={inputClass} value={form.numeroDocumento} onChange={onChange} />
        </FormField>
        <FormField id="graduado-nombres" label="Nombres" required error={errors.nombres}>
          <input name="nombres" autoComplete="off" className={inputClass} value={form.nombres} onChange={onChange} />
        </FormField>
        <FormField id="graduado-apellidos" label="Apellidos" required error={errors.apellidos}>
          <input name="apellidos" autoComplete="off" className={inputClass} value={form.apellidos} onChange={onChange} />
        </FormField>
        <FormField id="graduado-fechaNacimiento" label="Fecha de nacimiento" required error={errors.fechaNacimiento} hint="Se usa para validar las solicitudes del documento oficial.">
          <input name="fechaNacimiento" type="date" min="1900-01-01" max={localInputDate(-1)} className={inputClass} value={form.fechaNacimiento} onChange={onChange} />
        </FormField>
      </div>
    </FormModal>
  );
}
