import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as diplomasAPI from '../services/diplomas.service';
import { diplomaError, diplomaId, extractDiploma, extractDiplomaList, filterDiplomas } from '../helpers/diplomaModel.js';
import CreateDiplomaModal from '../components/CreateDiplomaModal';
import PageShell from '../components/common/PageShell';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import FormField from '../components/common/FormField';
import Notice from '../components/common/Notice';
import StatusBadge from '../components/common/StatusBadge';
import { btnLink, btnLinkDanger, btnPrimary, inputClass } from '../components/common/ui';
import { describeActivo } from '../helpers/estados.js';
import { isNotFound } from '../helpers/apiResponse.js';
import { formatDate, fullName } from '../helpers/formatters.js';
import UpdateDiplomaModal from '../components/UpdateDiplomaModal';
import ReadDiplomaModal from '../components/ReadDiplomaModal';
import DeleteModal from '../components/DeleteModal';

const PAGE_SIZE = 10;

export default function DiplomasViewDashboard() {
  const { authUser } = useAuth();
  const role = authUser?.rol;
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [serverPages, setServerPages] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);
  const [reload, setReload] = useState(0);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [openingEdit, setOpeningEdit] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (role !== 'ADMIN' && role !== 'INSTITUCION') {
          if (active) setDiplomas([]);
          return;
        }
        const result = role === 'ADMIN'
          ? await diplomasAPI.getAllDiplomas()
          : await diplomasAPI.getDiplomasByInstitution({page, limit: PAGE_SIZE});
        if (active) {
          setDiplomas(extractDiplomaList(result));
          setServerPages(role === 'INSTITUCION' ? Math.max(1, Number(result?.totalPages) || 1) : 1);
          setServerTotal(role === 'INSTITUCION' ? Number(result?.total) || 0 : 0);
        }
      } catch (err) {
        if (active) {
          setDiplomas([]);
          setServerTotal(0);
          setServerPages(1);
          // El API responde 404 cuando no hay diplomas: es una lista vacía, no un fallo.
          if (!isNotFound(err)) setError(diplomaError(err, 'No fue posible consultar los diplomas.'));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [role, reload, page]);

  const filtered = useMemo(() => filterDiplomas(diplomas, search), [diplomas, search]);
  const pages = role === 'INSTITUCION' ? serverPages : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = role === 'INSTITUCION' ? filtered : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const onSearch = (text) => { setSearch(text); setPage(1); };
  const onSaved = (message) => {
    setNotice(message);
    setError('');
    setReload((value) => value + 1);
  };
  const closeModal = () => { setModal(null); setSelected(null); };

  const openDetail = async (diploma, action) => {
    const id = diplomaId(diploma);
    if (!id || openingEdit) return;
    setOpeningEdit(true);
    setError('');
    try {
      const response = await diplomasAPI.getDiplomaById(id);
      const detail = extractDiploma(response);
      if (!detail) throw new Error('La API no devolvió el diploma seleccionado.');
      setSelected({ ...diploma, ...detail, _id: diplomaId(detail) || id });
      setModal(action);
    } catch (err) {
      setError(diplomaError(err, 'No fue posible cargar el diploma.'));
    } finally {
      setOpeningEdit(false);
    }
  };

  const isAdmin = role === 'ADMIN';
  const columns = [
    {
      header: 'Diploma',
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{row.nombrePrograma || '—'}</p>
          <p className="text-xs text-gray-500">{[row.codigoDiploma, row.nivelPrograma].filter(Boolean).join(' · ')}</p>
        </div>
      )
    },
    {
      header: 'Graduado',
      render: (row) => (
        <span>
          {row.graduado ? fullName(row.graduado) : '—'}
          {row.graduado?.numeroDocumento && <span className="block text-xs text-gray-500">{row.graduado.numeroDocumento}</span>}
        </span>
      )
    },
    ...(isAdmin ? [{ header: 'Institución', key: 'institucion.nombreInstitucion' }] : []),
    { header: 'Fecha de grado', render: (row) => formatDate(row.fechaGrados) },
    ...(diplomas.some((d) => typeof d.estado === 'boolean') ? [{ header: 'Estado', render: (row) => <StatusBadge {...describeActivo(row.estado)} /> }] : []),
    {
      header: 'Acciones',
      actions: true,
      render: (row) => (
        <>
          <button type="button" className={btnLink} disabled={openingEdit} onClick={() => openDetail(row, 'preview')} aria-label={`Ver diploma ${row.codigoDiploma ?? ''}`}>Ver</button>
          <button type="button" className={btnLink} disabled={openingEdit || !diplomaId(row)} onClick={() => openDetail(row, 'edit')} aria-label={`Editar diploma ${row.codigoDiploma ?? ''}`}>Editar</button>
          {isAdmin && row.estado !== false && (
            <button type="button" className={btnLinkDanger} disabled={openingEdit || !diplomaId(row)} onClick={() => { setSelected(row); setModal('deactivate'); }} aria-label={`Desactivar diploma ${row.codigoDiploma ?? ''}`}>Desactivar</button>
          )}
        </>
      )
    }
  ];

  return (
    <PageShell
      title="Diplomas"
      description={isAdmin
        ? 'Todos los diplomas emitidos en EVOT. Para corregir uno, la institución debe pedir permiso de edición.'
        : 'Diplomas emitidos por tu institución. Para corregir uno ya emitido, solicita permiso de edición desde "Editar".'}
      actions={role === 'INSTITUCION' && <button type="button" className={btnPrimary} onClick={() => setCreating(true)}>Registrar diploma</button>}
      notices={(
        <>
          {notice && <Notice tone="success" onClose={() => setNotice('')}>{notice}</Notice>}
          {error && <Notice tone="error" onClose={() => setError('')}>{error}</Notice>}
        </>
      )}
      toolbar={(
        <div className="max-w-md">
          <FormField
            id="buscar-diploma"
            label="Buscar"
            hint={role === 'INSTITUCION' ? 'Busca en la página actual por código, programa o graduado.' : 'Por código, programa, graduado o institución.'}
          >
            <input type="search" className={inputClass} value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Ej. DIP-2024-001" />
          </FormField>
        </div>
      )}
      footer={!loading && (filtered.length > 0 || pages > 1) && (
        <Pagination
          page={currentPage}
          totalPages={pages}
          total={role === 'INSTITUCION' ? serverTotal : filtered.length}
          onChange={setPage}
          disabled={loading}
          itemLabel="diplomas"
        />
      )}
    >
      <DataTable
        caption="Diplomas"
        columns={columns}
        rows={visible}
        loading={loading}
        getRowKey={(row) => diplomaId(row) || row.codigoDiploma}
        emptyMessage={search ? 'No se encontraron diplomas con ese criterio.' : 'No hay diplomas para mostrar.'}
        emptyAction={!search && role === 'INSTITUCION' && <button type="button" className={btnPrimary} onClick={() => setCreating(true)}>Registrar el primer diploma</button>}
      />
      {role === 'INSTITUCION' && <CreateDiplomaModal open={creating} onClose={() => setCreating(false)} onSaved={onSaved} />}
      <UpdateDiplomaModal open={modal === 'edit'} diploma={selected} onClose={closeModal} onSaved={onSaved} />
      <ReadDiplomaModal open={modal === 'preview'} diploma={selected} onClose={closeModal} />
      <DeleteModal open={modal === 'deactivate'} diploma={selected} onClose={closeModal} onSaved={onSaved} />
    </PageShell>
  );
}
