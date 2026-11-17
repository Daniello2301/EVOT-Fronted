import { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import { createDiploma, updateDiploma } from '../services/diplomas.service';
import { diplomaError, diplomaId, diplomaPayload, diplomaToForm, EMPTY_DIPLOMA } from '../helpers/diplomaModel.js';

const FIELDS = [
  {name:'codigoDiploma',label:'Código del diploma'},
  {name:'nombrePrograma',label:'Nombre del programa'},
  {name:'nivelPrograma',label:'Nivel académico'},
  {name:'registroPrograma',label:'Registro del programa'},
  {name:'libro',label:'Libro de grados'},
  {name:'fechaGrados',label:'Fecha de grado',type:'date'},
];

export default function DiplomaFormModal({ open, mode = 'create', diploma = null, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(EMPTY_DIPLOMA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(isEdit ? diplomaToForm(diploma) : {...EMPTY_DIPLOMA});
      setError('');
    }
  }, [open, isEdit, diploma]);

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setError('');
    setSaving(true);
    try {
      const payload = diplomaPayload(form, isEdit);
      if (isEdit) {
        const id = diplomaId(diploma);
        if (!id) throw new Error('No se encontró el identificador del diploma.');
        await updateDiploma(id, payload);
      } else {
        await createDiploma(payload);
      }
      onSaved?.(isEdit ? 'Diploma actualizado correctamente.' : 'Diploma creado correctamente.');
      onClose?.();
    } catch (err) {
      setError(diplomaError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={open} onClose={() => { if (!saving) onClose?.(); }} size="2xl">
      <Modal.Header>{isEdit ? 'Editar diploma' : 'Registrar diploma'}</Modal.Header>
      <Modal.Body>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map(({name,label,type = 'text'}) => (
              <div key={name}>
                <label htmlFor={'diploma-' + name} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                <input id={'diploma-' + name} name={name} type={type} required
                  maxLength={type === 'text' ? 200 : undefined}
                  value={form[name]} onChange={(event) => setForm((value) => ({...value,[name]:event.target.value}))}
                  disabled={saving} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600" />
              </div>
            ))}
            {!isEdit && (
              <div>
                <label htmlFor="diploma-numeroDocumento" className="mb-1 block text-sm font-medium text-gray-700">Documento del graduado</label>
                <input id="diploma-numeroDocumento" name="numeroDocumento" type="text" inputMode="numeric"
                  pattern="[0-9]{4,20}" maxLength={20} required disabled={saving}
                  value={form.numeroDocumento} onChange={(event) => setForm((value) => ({...value,numeroDocumento:event.target.value}))}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900" />
              </div>
            )}
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 disabled:opacity-60">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue_primary px-4 py-2 font-medium text-white disabled:opacity-60">
              {saving ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Registrar diploma')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
