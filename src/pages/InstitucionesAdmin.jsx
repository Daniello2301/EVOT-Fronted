import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/common/PageShell';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import FilterBar from '../components/common/FilterBar';
import FormField from '../components/common/FormField';
import FormModal from '../components/common/FormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import StatusBadge from '../components/common/StatusBadge';
import Notice from '../components/common/Notice';
import InstitucionFields from '../components/instituciones/InstitucionFields';
import { btnLink, btnLinkDanger, inputClass } from '../components/common/ui';
import usePagedList from '../Hooks/usePagedList';
import useFlash from '../Hooks/useFlash';
import {
  activateInstitucion, deactivateInstitucion, getAllInstituciones, updateInstitucion
} from '../services/institucions.service';
import { apiErrorMessage } from '../helpers/apiResponse.js';
import { describeActivo } from '../helpers/estados.js';
import { formatDate } from '../helpers/formatters.js';
import { dashboardPath } from '../helpers/dashboardNav.js';
import {
  EMPTY_INSTITUCION, INSTITUCION_MODES, institucionFilters, institucionToForm, validateInstitucion
} from '../helpers/institucionModel.js';

const EMPTY_FILTERS = { nombreInstitucion: '', ciudad: '', estado: '' };

function EditInstitucionModal({ institucion, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_INSTITUCION);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (institucion) {
      setForm(institucionToForm(institucion));
      setErrors({});
      setError('');
    }
  }, [institucion]);

  const onChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = async () => {
    const { errors: nextErrors, payload } = validateInstitucion(form, INSTITUCION_MODES.ADMIN);
    setErrors(nextErrors);
    setError('');
    if (!payload) {
      document.getElementById(`admin-inst-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await updateInstitucion(institucion._id, payload);
      onSaved(`Se actualizó "${payload.nombreInstitucion}".`);
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo actualizar la institución.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal show={!!institucion} title="Editar institución" onClose={onClose} onSubmit={submit} busy={saving} error={error} submitLabel="Guardar cambios">
      <InstitucionFields form={form} errors={errors} onChange={onChange} idPrefix="admin-inst" />
    </FormModal>
  );
}

/** Gestión global de instituciones (rol ADMIN). */
export default function InstitucionesAdmin() {
  const list = usePagedList(getAllInstituciones);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [editing, setEditing] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [toggleBusy, setToggleBusy] = useState(false);
  const [toggleError, setToggleError] = useState('');
  const [flash, setFlash, clearFlash] = useFlash();

  const applyDraft = () => list.applyFilters(institucionFilters(draft));
  const clearDraft = () => { setDraft(EMPTY_FILTERS); list.applyFilters({}); };
  const onDraft = (event) => setDraft((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const confirmToggle = async () => {
    const activar = toggling.estado === false;
    setToggleBusy(true);
    setToggleError('');
    try {
      await (activar ? activateInstitucion(toggling._id) : deactivateInstitucion(toggling._id));
      setFlash(`${toggling.nombreInstitucion} quedó ${activar ? 'activa' : 'inactiva'}.`);
      setToggling(null);
      list.reload();
    } catch (err) {
      setToggleError(apiErrorMessage(err, 'No se pudo cambiar el estado de la institución.'));
    } finally {
      setToggleBusy(false);
    }
  };

  const columns = [
    {
      header: 'Institución',
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{row.nombreInstitucion}</p>
          <p className="text-xs text-gray-500">Código {row.codigoInstitucion}</p>
        </div>
      )
    },
    { header: 'Ubicación', render: (row) => [row.ciudad, row.departamento].filter(Boolean).join(', ') },
    {
      header: 'Resolución',
      render: (row) => (
        <span>
          {row.resolucion}
          <span className="block text-xs text-gray-500">{formatDate(row.fechaResolucion)}</span>
        </span>
      )
    },
    { header: 'Estado', render: (row) => <StatusBadge {...describeActivo(row.estado)} /> },
    {
      header: 'Acciones',
      actions: true,
      render: (row) => (
        <>
          <button type="button" className={btnLink} onClick={() => setEditing(row)} aria-label={`Editar ${row.nombreInstitucion}`}>Editar</button>
          {row.estado === false ? (
            <button type="button" className={btnLink} onClick={() => setToggling(row)} aria-label={`Activar ${row.nombreInstitucion}`}>Activar</button>
          ) : (
            <button type="button" className={btnLinkDanger} onClick={() => setToggling(row)} aria-label={`Desactivar ${row.nombreInstitucion}`}>Desactivar</button>
          )}
        </>
      )
    }
  ];

  const activando = toggling?.estado === false;

  return (
    <PageShell
      title="Instituciones"
      description="Consulta, corrige y activa o desactiva las instituciones registradas en EVOT."
      notices={(
        <>
          <Notice tone="info">
            Cada institución se registra desde su propia cuenta en el primer ingreso. Para dar de alta una nueva, crea primero su{' '}
            <Link to={dashboardPath('users')} className="font-semibold underline">usuario con rol Institución</Link>.
          </Notice>
          {flash && <Notice tone="success" onClose={clearFlash}>{flash}</Notice>}
        </>
      )}
      toolbar={(
        <FilterBar onSubmit={applyDraft} onClear={clearDraft} busy={list.loading} label="Filtrar instituciones">
          <FormField id="filtro-inst-nombre" label="Nombre">
            <input name="nombreInstitucion" className={inputClass} value={draft.nombreInstitucion} onChange={onDraft} placeholder="Ej. Universidad" />
          </FormField>
          <FormField id="filtro-inst-ciudad" label="Ciudad">
            <input name="ciudad" className={inputClass} value={draft.ciudad} onChange={onDraft} />
          </FormField>
          <FormField id="filtro-inst-estado" label="Estado">
            <select name="estado" className={inputClass} value={draft.estado} onChange={onDraft}>
              <option value="">Todos</option>
              <option value="true">Activas</option>
              <option value="false">Inactivas</option>
            </select>
          </FormField>
        </FilterBar>
      )}
      footer={!list.error && list.total > 0 && (
        <Pagination page={list.page} totalPages={list.totalPages} total={list.total} onChange={list.setPage} disabled={list.loading} itemLabel="instituciones" />
      )}
    >
      <DataTable
        caption="Instituciones registradas"
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        emptyMessage="No hay instituciones que coincidan con los filtros."
      />

      <EditInstitucionModal
        institucion={editing}
        onClose={() => setEditing(null)}
        onSaved={(message) => { setEditing(null); setFlash(message); list.reload(); }}
      />

      <ConfirmModal
        show={!!toggling}
        onClose={() => { setToggling(null); setToggleError(''); }}
        onConfirm={confirmToggle}
        tone={activando ? 'primary' : 'danger'}
        title={activando ? 'Activar institución' : 'Desactivar institución'}
        message={toggling ? (activando
          ? `${toggling.nombreInstitucion} volverá a aparecer en el listado público de instituciones.`
          : `${toggling.nombreInstitucion} dejará de aparecer en el listado público de instituciones. Puedes volver a activarla después.`) : ''}
        confirmLabel={activando ? 'Activar' : 'Desactivar'}
        cancelLabel="Cancelar"
        loading={toggleBusy}
        error={toggleError}
      />
    </PageShell>
  );
}
