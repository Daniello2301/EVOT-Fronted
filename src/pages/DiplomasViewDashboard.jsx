import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as diplomasAPI from '../services/diplomas.service';
import { diplomaError, diplomaId, extractDiploma, extractDiplomaList, filterDiplomas } from '../helpers/diplomaModel.js';
import HeadTableDiplomas from '../components/HeadTableDiplomas';
import AdminDiplomasTable from '../components/AdminDiplomasTable';
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
          setError(diplomaError(err, 'No fue posible consultar los diplomas.'));
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

  return (
    <section className="min-h-[30rem] bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-screen-xl overflow-hidden rounded-xl bg-white shadow-sm">
        <HeadTableDiplomas search={search} onSearch={onSearch} onSaved={onSaved} canCreate={role === "INSTITUCION"} />
        {notice && <p role="status" className="m-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
        {error && <p role="alert" className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {loading ? (
          <p className="p-8 text-center text-gray-600">Cargando diplomas...</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-gray-600">{search ? 'No se encontraron diplomas con ese criterio.' : 'No hay diplomas para mostrar.'}</p>
        ) : (
          <AdminDiplomasTable diplomas={visible} busy={openingEdit} canDeactivate={role === "ADMIN"}
            onEdit={(diploma) => openDetail(diploma, 'edit')}
            onPreview={(diploma) => openDetail(diploma, 'preview')}
            onDeactivate={(diploma) => { setSelected(diploma); setModal('deactivate'); }} />
        )}
        <nav aria-label="Paginación de diplomas" className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-4 text-sm text-gray-600">
          <span>{role === 'INSTITUCION'
            ? `${serverTotal} diploma(s) en la institución · Página ${currentPage} de ${pages} · Búsqueda en página actual`
            : `${filtered.length} diploma(s) en la lista cargada · Página ${currentPage} de ${pages}`}</span>
          <div className="flex gap-2">
            <button type="button" disabled={currentPage <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
            <button type="button" disabled={currentPage >= pages || loading} onClick={() => setPage((value) => Math.min(pages, value + 1))}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
          </div>
        </nav>
      </div>
      <UpdateDiplomaModal open={modal === 'edit'} diploma={selected} onClose={closeModal} onSaved={onSaved} />
      <ReadDiplomaModal open={modal === 'preview'} diploma={selected} onClose={closeModal} />
      <DeleteModal open={modal === 'deactivate'} diploma={selected} onClose={closeModal} onSaved={onSaved} />
    </section>
  );
}
