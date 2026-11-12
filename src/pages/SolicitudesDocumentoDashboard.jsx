import { useEffect, useState } from 'react';
import { getSolicitudesDocumento, rechazarSolicitudDocumento } from '../services/solicitudes.service';
import DataTable from '../components/common/DataTable';
import ConfirmModal from '../components/common/ConfirmModal';
import AprobarSolicitudDocumentoModal from '../components/AprobarSolicitudDocumentoModal';

const ESTADO_ESTILOS = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    APROBADO: 'bg-green-100 text-green-700',
    RECHAZADO: 'bg-red-100 text-red-700'
};

export default function SolicitudesDocumentoDashboard() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('');

    const [solicitudAAprobar, setSolicitudAAprobar] = useState(null);
    const [solicitudARechazar, setSolicitudARechazar] = useState(null);
    const [rechazando, setRechazando] = useState(false);
    const [rechazarError, setRechazarError] = useState('');

    const fetchSolicitudes = async () => {
        setLoading(true);
        try {
            const params = filtroEstado ? { estado: filtroEstado } : {};
            const response = await getSolicitudesDocumento(params);
            setSolicitudes(response?.results ?? []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtroEstado]);

    const handleConfirmRechazar = async () => {
        setRechazando(true);
        setRechazarError('');
        try {
            await rechazarSolicitudDocumento(solicitudARechazar._id);
            setSolicitudARechazar(null);
            await fetchSolicitudes();
        } catch (error) {
            setRechazarError(error?.response?.data?.msg || 'No fue posible rechazar la solicitud.');
        } finally {
            setRechazando(false);
        }
    };

    const columns = [
        { header: 'Solicitante', render: (row) => `${row.nombres} ${row.apellidos}` },
        { header: 'Correo', key: 'correoSolicitante' },
        { header: 'Diploma', key: 'diploma.codigoDiploma' },
        {
            header: 'Estado',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_ESTILOS[row.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                    {row.estado}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => row.estado === 'PENDIENTE' ? (
                <div className="flex items-center gap-3">
                    <button type="button" className="text-blue_primary hover:underline text-sm" onClick={() => setSolicitudAAprobar(row)}>
                        Aprobar
                    </button>
                    <button type="button" className="text-red-600 hover:underline text-sm" onClick={() => setSolicitudARechazar(row)}>
                        Rechazar
                    </button>
                </div>
            ) : null
        }
    ];

    return (
        <section className="bg-gray-50 dark:bg-gray-900 sm:p-5 antialiased">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="min-h-[30rem] bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Solicitudes de documentos</h1>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
                        >
                            <option value="">Todos los estados</option>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="APROBADO">Aprobado</option>
                            <option value="RECHAZADO">Rechazado</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns}
                            rows={solicitudes}
                            loading={loading}
                            emptyMessage="No hay solicitudes de documentos para mostrar."
                        />
                    </div>
                </div>
            </div>

            <AprobarSolicitudDocumentoModal
                solicitud={solicitudAAprobar}
                onClose={() => setSolicitudAAprobar(null)}
                onAprobado={() => {
                    setSolicitudAAprobar(null);
                    fetchSolicitudes();
                }}
            />

            <ConfirmModal
                show={!!solicitudARechazar}
                onClose={() => { setSolicitudARechazar(null); setRechazarError(''); }}
                onConfirm={handleConfirmRechazar}
                title="Rechazar solicitud"
                message={solicitudARechazar ? `¿Rechazar la solicitud de ${solicitudARechazar.nombres} ${solicitudARechazar.apellidos}?` : ''}
                loading={rechazando}
                error={rechazarError}
            />
        </section>
    );
}
