import { useState } from 'react';
import PageShell from '../components/common/PageShell';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import FilterBar from '../components/common/FilterBar';
import FormField from '../components/common/FormField';
import ConfirmModal from '../components/common/ConfirmModal';
import StatusBadge from '../components/common/StatusBadge';
import Notice from '../components/common/Notice';
import GraduadoFormModal from '../components/graduados/GraduadoFormModal';
import { btnLink, btnLinkDanger, btnPrimary, inputClass } from '../components/common/ui';
import usePagedList from '../Hooks/usePagedList';
import useFlash from '../Hooks/useFlash';
import { useAuth } from '../context/AuthContext';
import { deactivateGraduado, getAllGraduados, updateGraduado } from '../services/graduado.service';
import { apiErrorMessage } from '../helpers/apiResponse.js';
import { ROLES, describeActivo } from '../helpers/estados.js';
import { formatDate, fullName, localInputDate } from '../helpers/formatters.js';
import { graduadoFilters } from '../helpers/graduadoModel.js';

const EMPTY_FILTERS = { numeroDocumento: '', nombres: '', apellidos: '', estado: '', desde: '', hasta: '' };

/**
 * Graduados.
 * - INSTITUCION: ve los graduados con al menos un diploma de su institución y registra nuevos.
 * - ADMIN: ve todos, corrige datos y activa/desactiva.
 */
export default function GraduadosViewDashboard() {
  const { authUser } = useAuth();
  const isAdmin = authUser?.rol === ROLES.ADMIN;
  const isInstitucion = authUser?.rol === ROLES.INSTITUCION;
  const list = usePagedList(getAllGraduados);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filterError, setFilterError] = useState('');
  const [formState, setFormState] = useState(null); // { mode, graduado }
  const [toggling, setToggling] = useState(null);
  const [toggleBusy, setToggleBusy] = useState(false);
  const [toggleError, setToggleError] = useState('');
  const [flash, setFlash, clearFlash] = useFlash(7000);

  const onDraft = (event) => setDraft((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const applyDraft = () => {
    const { params, error } = graduadoFilters(draft);
    setFilterError(error);
    if (params) list.applyFilters(params);
  };
  const clearDraft = () => { setDraft(EMPTY_FILTERS); setFilterError(''); list.applyFilters({}); };

  const activando = toggling?.estado === false;
  const confirmToggle = async () => {
    setToggleBusy(true);
    setToggleError('');
    try {
      // No hay endpoint de "activar": se reactiva con PUT { estado: true }.
      await (activando ? updateGraduado(toggling._id, { estado: true }) : deactivateGraduado(toggling._id));
      setFlash(`${fullName(toggling)} quedó ${activando ? 'activo' : 'inactivo'}.`);
      setToggling(null);
      list.reload();
    } catch (err) {
      setToggleError(apiErrorMessage(err, 'No se pudo cambiar el estado del graduado.'));
    } finally {
      setToggleBusy(false);
    }
  };

  const columns = [
    {
      header: 'Graduado',
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{fullName(row)}</p>
          <p className="text-xs text-gray-500">{row.tipoDocumento} {row.numeroDocumento}</p>
        </div>
      )
    },
    { header: 'Nacimiento', render: (row) => formatDate(row.fechaNacimiento) },
    { header: 'Registrado', render: (row) => formatDate(row.createdAt), hideOnMobile: true },
    { header: 'Estado', render: (row) => <StatusBadge {...describeActivo(row.estado)} /> },
    ...(isAdmin ? [{
      header: 'Acciones',
      actions: true,
      render: (row) => (
        <>
          <button type="button" className={btnLink} onClick={() => setFormState({ mode: 'edit', graduado: row })} aria-label={`Editar a ${fullName(row)}`}>Editar</button>
          {row.estado === false ? (
            <button type="button" className={btnLink} onClick={() => setToggling(row)} aria-label={`Activar a ${fullName(row)}`}>Activar</button>
          ) : (
            <button type="button" className={btnLinkDanger} onClick={() => setToggling(row)} aria-label={`Desactivar a ${fullName(row)}`}>Desactivar</button>
          )}
        </>
      )
    }] : [])
  ];

  return (
    <PageShell
      title="Graduados"
      description={isAdmin
        ? 'Todas las personas registradas como graduadas en EVOT.'
        : 'Personas con al menos un diploma emitido por tu institución.'}
      actions={isInstitucion && (
        <button type="button" className={btnPrimary} onClick={() => setFormState({ mode: 'create', graduado: null })}>Registrar graduado</button>
      )}
      notices={(
        <>
          {flash && <Notice tone="success" onClose={clearFlash}>{flash}</Notice>}
          {filterError && <Notice tone="error" onClose={() => setFilterError('')}>{filterError}</Notice>}
        </>
      )}
      toolbar={(
        <FilterBar onSubmit={applyDraft} onClear={clearDraft} busy={list.loading} label="Filtrar graduados">
          <FormField id="filtro-grad-doc" label="Número de documento" hint="Coincidencia exacta.">
            <input name="numeroDocumento" inputMode="numeric" className={inputClass} value={draft.numeroDocumento} onChange={onDraft} />
          </FormField>
          <FormField id="filtro-grad-nombres" label="Nombres">
            <input name="nombres" className={inputClass} value={draft.nombres} onChange={onDraft} />
          </FormField>
          <FormField id="filtro-grad-apellidos" label="Apellidos">
            <input name="apellidos" className={inputClass} value={draft.apellidos} onChange={onDraft} />
          </FormField>
          <FormField id="filtro-grad-estado" label="Estado">
            <select name="estado" className={inputClass} value={draft.estado} onChange={onDraft}>
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </FormField>
          <FormField id="filtro-grad-desde" label="Registrado desde">
            <input name="desde" type="date" max={draft.hasta || localInputDate(0)} className={inputClass} value={draft.desde} onChange={onDraft} />
          </FormField>
          <FormField id="filtro-grad-hasta" label="Registrado hasta">
            <input name="hasta" type="date" min={draft.desde || undefined} max={localInputDate(0)} className={inputClass} value={draft.hasta} onChange={onDraft} />
          </FormField>
        </FilterBar>
      )}
      footer={!list.error && list.total > 0 && (
        <Pagination page={list.page} totalPages={list.totalPages} total={list.total} onChange={list.setPage} disabled={list.loading} itemLabel="graduados" />
      )}
    >
      <DataTable
        caption="Graduados"
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        emptyMessage={isInstitucion
          ? 'Aún no hay graduados con diplomas de tu institución, o ninguno coincide con los filtros.'
          : 'No hay graduados que coincidan con los filtros.'}
      />

      <GraduadoFormModal
        show={!!formState}
        mode={formState?.mode}
        graduado={formState?.graduado}
        onClose={() => setFormState(null)}
        onSaved={(message) => { setFormState(null); setFlash(message); list.reload(); }}
      />

      <ConfirmModal
        show={!!toggling}
        onClose={() => { setToggling(null); setToggleError(''); }}
        onConfirm={confirmToggle}
        tone={activando ? 'primary' : 'danger'}
        title={activando ? 'Activar graduado' : 'Desactivar graduado'}
        message={toggling ? (activando
          ? `${fullName(toggling)} volverá a estar disponible para emitir diplomas.`
          : `${fullName(toggling)} quedará inactivo. Puedes volver a activarlo después.`) : ''}
        confirmLabel={activando ? 'Activar' : 'Desactivar'}
        cancelLabel="Cancelar"
        loading={toggleBusy}
        error={toggleError}
      />
    </PageShell>
  );
}
