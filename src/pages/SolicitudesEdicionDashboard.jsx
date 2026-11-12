import { useEffect, useState } from 'react';
import { getSolicitudesEdicion, aprobarSolicitudEdicion, rechazarSolicitudEdicion } from '../services/solicitudes.service';
import DataTable from '../components/common/DataTable';
import ConfirmModal from '../components/common/ConfirmModal';

const ESTADO_ESTILOS = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    APROBADA: 'bg-green-100 text-green-700',
    RECHAZADA: 'bg-red-100 text-red-700'
};

export default function SolicitudesEdicionDashboard() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('');

    const [solicitudAAprobar, setSolicitudAAprobar] = useState(null);
    const [solicitudARechazar, setSolicitudARechazar] = useState(null);
    const [procesando, setProcesando] = useState(false);
    const [procesarError, setProcesarError] = useState('');
    const [expiracionAprobada, setExpiracionAprobada] = useState(null);

    const fetchSolicitudes = async () => {
        setLoading(true);
        try {
            const params = filtroEstado ? { estado: filtroEstado } : {};
            const response = await getSolicitudesEdicion(params);
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

    const handleConfirmAprobar = async () => {
        setProcesando(true);
        setProcesarError('');
        try {
            const data = await aprobarSolicitudEdicion(solicitudAAprobar._id);
            setSolicitudAAprobar(null);
            setExpiracionAprobada(data.expiracion);
            await fetchSolicitudes();
        } catch (error) {
            setProcesarError(error?.response?.data?.msg || 'No fue posible aprobar la solicitud.');
        } finally {
            setProcesando(false);
        }
    };

    const handleConfirmRechazar = async () => {
        setProcesando(true);
        setProcesarError('');
        try {
            await rechazarSolicitudEdicion(solicitudARechazar._id);
            setSolicitudARechazar(null);
            await fetchSolicitudes();
        } catch (error) {
            setProcesarError(error?.response?.data?.msg || 'No fue posible rechazar la solicitud.');
        } finally {
            setProcesando(false);
        }
    };

    const columns = [
        { header: 'Diploma', key: 'diploma.codigoDiploma' },
        { header: 'Programa', key: 'diploma.nombrePrograma' },
        { header: 'Solicitado por', key: 'solicitadoPor.nombreUsuario' },
        { header: 'Motivo', key: 'motivoSolicitud' },
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
                {expiracionAprobada && (
                    <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                        Solicitud aprobada. La institución puede editar el diploma hasta el {new Date(expiracionAprobada).toLocaleString('es-CO')}.
                    </p>
                )}
                <div className="min-h-[30rem] bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Solicitudes de edición</h1>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
                        >
                            <option value="">Todos los estados</option>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="APROBADA">Aprobada</option>
                            <option value="RECHAZADA">Rechazada</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns}
                            rows={solicitudes}
                            loading={loading}
                            emptyMessage="No hay solicitudes de edición para mostrar."
                        />
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={!!solicitudAAprobar}
                onClose={() => { setSolicitudAAprobar(null); setProcesarError(''); }}
                onConfirm={handleConfirmAprobar}
                title="Aprobar solicitud de edición"
                message={solicitudAAprobar ? `¿Aprobar la edición del diploma ${solicitudAAprobar.diploma?.codigoDiploma}? La institución tendrá 48 horas para editarlo.` : ''}
                confirmLabel="Sí, aprobar"
                loading={procesando}
                error={procesarError}
            />

            <ConfirmModal
                show={!!solicitudARechazar}
                onClose={() => { setSolicitudARechazar(null); setProcesarError(''); }}
                onConfirm={handleConfirmRechazar}
                title="Rechazar solicitud de edición"
                message={solicitudARechazar ? `¿Rechazar la edición del diploma ${solicitudARechazar.diploma?.codigoDiploma}?` : ''}
                loading={procesando}
                error={procesarError}
            />
        </section>
    );
}
