import { useEffect, useState } from 'react';
import PageShell from '../components/common/PageShell';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import FilterBar from '../components/common/FilterBar';
import FormField from '../components/common/FormField';
import FormModal from '../components/common/FormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import StatusBadge from '../components/common/StatusBadge';
import Notice from '../components/common/Notice';
import { btnLink, btnLinkDanger, btnPrimary, inputClass } from '../components/common/ui';
import usePagedList from '../Hooks/usePagedList';
import useFlash from '../Hooks/useFlash';
import { useAuth } from '../context/AuthContext';
import { activateUsuario, createUsuario, deactivateUsuario, getAllUsuarios } from '../services/usuarios.service';
import { apiErrorMessage } from '../helpers/apiResponse.js';
import { describeActivo, rolLabel } from '../helpers/estados.js';
import { formatDateTime } from '../helpers/formatters.js';
import { MIN_PASSWORD_LENGTH } from '../helpers/passwordChange.js';
import { EMPTY_USUARIO, ROLES_CREABLES, canToggleUsuario, usuarioFilters, validateUsuario } from '../helpers/usuarioModel.js';

const EMPTY_FILTERS = { nombreUsuario: '', correo: '', activo: '' };

function CreateUsuarioModal({ show, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_USUARIO);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) { setForm({ ...EMPTY_USUARIO }); setErrors({}); setError(''); }
  }, [show]);

  const onChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = async () => {
    const { errors: nextErrors, payload } = validateUsuario(form);
    setErrors(nextErrors);
    setError('');
    if (!payload) {
      document.getElementById(`nuevo-usuario-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await createUsuario(payload);
      onCreated(payload);
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo crear el usuario.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal show={show} title="Nuevo usuario" onClose={onClose} onSubmit={submit} busy={saving} error={error} submitLabel="Crear usuario" busyLabel="Creando...">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="nuevo-usuario-nombreUsuario" label="Nombre de usuario" required error={errors.nombreUsuario} hint="Sin espacios. Ej. colegio.central">
          <input name="nombreUsuario" autoComplete="off" className={inputClass} value={form.nombreUsuario} onChange={onChange} />
        </FormField>
        <FormField id="nuevo-usuario-correo" label="Correo" required error={errors.correo}>
          <input name="correo" type="email" inputMode="email" autoComplete="off" className={inputClass} value={form.correo} onChange={onChange} />
        </FormField>
        <FormField
          id="nuevo-usuario-rol"
          label="Rol"
          required
          error={errors.rol}
          className="sm:col-span-2"
          hint={form.rol === 'INSTITUCION'
            ? 'En su primer ingreso, la institución completará sus datos oficiales.'
            : 'Tendrá acceso total a EVOT. Créalo solo para personal de la plataforma.'}
        >
          <select name="rol" className={inputClass} value={form.rol} onChange={onChange}>
            {ROLES_CREABLES.map((rol) => <option key={rol} value={rol}>{rolLabel(rol)}</option>)}
          </select>
        </FormField>
        <FormField id="nuevo-usuario-contraseña" label="Contraseña inicial" required error={errors.contraseña} hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres. Compártela por un canal seguro.`}>
          <input name="contraseña" type="password" autoComplete="new-password" className={inputClass} value={form.contraseña} onChange={onChange} />
        </FormField>
        <FormField id="nuevo-usuario-confirmacion" label="Confirmar contraseña" required error={errors.confirmacion}>
          <input name="confirmacion" type="password" autoComplete="new-password" className={inputClass} value={form.confirmacion} onChange={onChange} />
        </FormField>
      </div>
      <Notice tone="info">Los graduados no se crean aquí: se registran solos desde “Registro de estudiantes” con su número de documento.</Notice>
    </FormModal>
  );
}

/** Gestión de cuentas (rol ADMIN). */
export default function UsuariosAdmin() {
  const { authUser } = useAuth();
  const list = usePagedList(getAllUsuarios);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [creating, setCreating] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [toggleBusy, setToggleBusy] = useState(false);
  const [toggleError, setToggleError] = useState('');
  const [flash, setFlash, clearFlash] = useFlash();

  const onDraft = (event) => setDraft((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const applyDraft = () => list.applyFilters(usuarioFilters(draft));
  const clearDraft = () => { setDraft(EMPTY_FILTERS); list.applyFilters({}); };

  const activando = toggling?.activo === false;

  const confirmToggle = async () => {
    setToggleBusy(true);
    setToggleError('');
    try {
      await (activando ? activateUsuario(toggling._id) : deactivateUsuario(toggling._id));
      setFlash(`La cuenta ${toggling.nombreUsuario} quedó ${activando ? 'activa' : 'inactiva'}.`);
      setToggling(null);
      list.reload();
    } catch (err) {
      setToggleError(apiErrorMessage(err, 'No se pudo cambiar el estado de la cuenta.'));
    } finally {
      setToggleBusy(false);
    }
  };

  const columns = [
    {
      header: 'Usuario',
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">
            {row.nombreUsuario}
            {row._id === authUser?._id && <span className="ml-2 text-xs font-medium text-blue_primary">(tú)</span>}
          </p>
          <p className="break-all text-xs text-gray-500">{row.correo}</p>
        </div>
      )
    },
    { header: 'Rol', render: (row) => rolLabel(row.rol) },
    { header: 'Estado', render: (row) => <StatusBadge {...describeActivo(row.activo)} /> },
    { header: 'Creado', render: (row) => formatDateTime(row.createdAt), hideOnMobile: true },
    {
      header: 'Acciones',
      actions: true,
      render: (row) => {
        if (!canToggleUsuario(row, authUser?._id)) return <span className="px-2 text-xs text-gray-500">Tu cuenta</span>;
        return row.activo === false ? (
          <button type="button" className={btnLink} onClick={() => setToggling(row)} aria-label={`Activar ${row.nombreUsuario}`}>Activar</button>
        ) : (
          <button type="button" className={btnLinkDanger} onClick={() => setToggling(row)} aria-label={`Desactivar ${row.nombreUsuario}`}>Desactivar</button>
        );
      }
    }
  ];

  return (
    <PageShell
      title="Usuarios"
      description="Cuentas con acceso a EVOT: administradores, instituciones y estudiantes registrados."
      actions={<button type="button" className={btnPrimary} onClick={() => setCreating(true)}>Nuevo usuario</button>}
      notices={flash && <Notice tone="success" onClose={clearFlash}>{flash}</Notice>}
      toolbar={(
        <FilterBar onSubmit={applyDraft} onClear={clearDraft} busy={list.loading} label="Filtrar usuarios">
          <FormField id="filtro-usuario-nombre" label="Nombre de usuario">
            <input name="nombreUsuario" className={inputClass} value={draft.nombreUsuario} onChange={onDraft} />
          </FormField>
          <FormField id="filtro-usuario-correo" label="Correo">
            <input name="correo" type="search" className={inputClass} value={draft.correo} onChange={onDraft} />
          </FormField>
          <FormField id="filtro-usuario-activo" label="Estado">
            <select name="activo" className={inputClass} value={draft.activo} onChange={onDraft}>
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </FormField>
        </FilterBar>
      )}
      footer={!list.error && list.total > 0 && (
        <Pagination page={list.page} totalPages={list.totalPages} total={list.total} onChange={list.setPage} disabled={list.loading} itemLabel="usuarios" />
      )}
    >
      <DataTable
        caption="Usuarios de EVOT"
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        emptyMessage="No hay usuarios que coincidan con los filtros."
      />

      <CreateUsuarioModal
        show={creating}
        onClose={() => setCreating(false)}
        onCreated={(usuario) => {
          setCreating(false);
          setFlash(`Se creó la cuenta ${usuario.nombreUsuario} (${rolLabel(usuario.rol)}).`);
          list.reload();
        }}
      />

      <ConfirmModal
        show={!!toggling}
        onClose={() => { setToggling(null); setToggleError(''); }}
        onConfirm={confirmToggle}
        tone={activando ? 'primary' : 'danger'}
        title={activando ? 'Activar cuenta' : 'Desactivar cuenta'}
        message={toggling ? (activando
          ? `${toggling.nombreUsuario} podrá volver a iniciar sesión.`
          : `${toggling.nombreUsuario} no podrá iniciar sesión y se cerrarán sus sesiones abiertas. Puedes volver a activarla después.`) : ''}
        confirmLabel={activando ? 'Activar' : 'Desactivar'}
        cancelLabel="Cancelar"
        loading={toggleBusy}
        error={toggleError}
      />
    </PageShell>
  );
}
