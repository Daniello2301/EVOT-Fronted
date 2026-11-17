import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllGraduados, deactivateGraduado } from '../services/graduado.service';
import DataTable from '../components/common/DataTable';
import ConfirmModal from '../components/common/ConfirmModal';
import CreateGraduadoModal from '../components/CreateGraduadoModal';
import UpdateGraduadoModal from '../components/UpdateGraduadoModal';

export default function GraduadosViewDashboard() {
    const { authUser } = useAuth();
    const role = authUser?.rol;

    const [graduados, setGraduados] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [graduadoToEdit, setGraduadoToEdit] = useState(null);
    const [graduadoToDeactivate, setGraduadoToDeactivate] = useState(null);
    const [deactivating, setDeactivating] = useState(false);
    const [deactivateError, setDeactivateError] = useState('');

    const fetchGraduados = async () => {
        setLoading(true);
        try {
            const response = await getAllGraduados();
            setGraduados(response?.results ?? []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraduados();
    }, []);

    const handleConfirmDeactivate = async () => {
        setDeactivating(true);
        setDeactivateError('');
        try {
            await deactivateGraduado(graduadoToDeactivate._id);
            setGraduadoToDeactivate(null);
            await fetchGraduados();
        } catch (error) {
            setDeactivateError(error?.response?.data?.msg || 'No fue posible desactivar el graduado.');
        } finally {
            setDeactivating(false);
        }
    };

    const columns = [
        { header: 'Documento', key: 'numeroDocumento' },
        { header: 'Nombres', key: 'nombres' },
        { header: 'Apellidos', key: 'apellidos' },
        {
            header: 'Fecha de nacimiento',
            render: (row) => new Date(row.fechaNacimiento).toLocaleDateString('es-CO')
        },
        {
            header: 'Estado',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.estado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.estado ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-3">
                    {role === 'ADMIN' && (
                        <button
                            type="button"
                            className="text-blue_primary hover:underline text-sm"
                            onClick={() => setGraduadoToEdit(row)}
                        >
                            Editar
                        </button>
                    )}
                    {role === 'ADMIN' && row.estado && (
                        <button
                            type="button"
                            className="text-red-600 hover:underline text-sm"
                            onClick={() => setGraduadoToDeactivate(row)}
                        >
                            Desactivar
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <section className="bg-gray-50 dark:bg-gray-900 sm:p-5 antialiased">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="min-h-[30rem] bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Graduados</h1>
                        {role === 'INSTITUCION' && (
                            <button
                                type="button"
                                onClick={() => setOpenCreateModal(true)}
                                className="rounded-lg bg-blue_primary px-4 py-2 text-sm font-medium text-white hover:bg-blue_dark transition-colors"
                            >
                                Agregar graduado
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns}
                            rows={graduados}
                            loading={loading}
                            emptyMessage="No hay graduados para mostrar."
                        />
                    </div>
                </div>
            </div>

            <CreateGraduadoModal
                show={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onCreated={() => {
                    setOpenCreateModal(false);
                    fetchGraduados();
                }}
            />

            <UpdateGraduadoModal
                graduado={graduadoToEdit}
                onClose={() => setGraduadoToEdit(null)}
                onUpdated={() => {
                    setGraduadoToEdit(null);
                    fetchGraduados();
                }}
            />

            <ConfirmModal
                show={!!graduadoToDeactivate}
                onClose={() => { setGraduadoToDeactivate(null); setDeactivateError(''); }}
                onConfirm={handleConfirmDeactivate}
                title="Desactivar graduado"
                message={graduadoToDeactivate ? `¿Seguro que quieres desactivar a ${graduadoToDeactivate.nombres} ${graduadoToDeactivate.apellidos}?` : ''}
                loading={deactivating}
                error={deactivateError}
            />
        </section>
    );
}
