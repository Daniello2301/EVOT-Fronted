import { useState } from 'react';
import PageShell from '../components/common/PageShell';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import FormField from '../components/common/FormField';
import ConfirmModal from '../components/common/ConfirmModal';
import DetailModal from '../components/common/DetailModal';
import StatusBadge from '../components/common/StatusBadge';
import Notice from '../components/common/Notice';
import AprobarSolicitudDocumentoModal from '../components/AprobarSolicitudDocumentoModal';
import { btnLink, btnLinkDanger, btnSecondary, inputClass } from '../components/common/ui';
import usePagedList from '../Hooks/usePagedList';
import useFlash from '../Hooks/useFlash';
import { descargarDocumentoSolicitud, getSolicitudesDocumento, rechazarSolicitudDocumento } from '../services/solicitudes.service';
import { apiErrorMessage } from '../helpers/apiResponse.js';
import { ESTADOS_DOCUMENTO, describeEstado } from '../helpers/estados.js';
import { formatDate, formatDateTime } from '../helpers/formatters.js';
import { isDescargable, nombreArchivoDescarga } from '../helpers/solicitudModel.js';

const estadoBadge = (row) => <StatusBadge {...describeEstado(ESTADOS_DOCUMENTO, row.estado)} />;

/** Solicitudes del documento oficial hechas por el público sobre diplomas de la institución. */
export default function SolicitudesDocumentoDashboard() {
    const list = usePagedList(getSolicitudesDocumento, { initialFilters: { estado: 'PENDIENTE' } });
    const [detalle, setDetalle] = useState(null);
    const [aprobando, setAprobando] = useState(null);
    const [rechazando, setRechazando] = useState(null);
    const [rechazoBusy, setRechazoBusy] = useState(false);
    const [rechazoError, setRechazoError] = useState('');
    const [descargandoId, setDescargandoId] = useState(null);
    const [descargaError, setDescargaError] = useState('');
    const [flash, setFlash, clearFlash] = useFlash();

    const confirmRechazo = async () => {
        setRechazoBusy(true);
        setRechazoError('');
        try {
            await rechazarSolicitudDocumento(rechazando._id);
            setFlash(`Se rechazó la solicitud de ${rechazando.nombres} ${rechazando.apellidos}.`);
            setRechazando(null);
            list.reload();
        } catch (err) {
            setRechazoError(apiErrorMessage(err, 'No se pudo rechazar la solicitud.'));
        } finally {
            setRechazoBusy(false);
        }
    };

    const descargar = async (solicitud) => {
        setDescargandoId(solicitud._id);
        setDescargaError('');
        try {
            const blob = await descargarDocumentoSolicitud(solicitud._id);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivoDescarga(solicitud);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (err) {
            setDescargaError(err?.response
                ? apiErrorMessage(err, 'No se pudo descargar el documento.')
                : 'No se pudo descargar el documento. Si el problema continúa, el almacenamiento de archivos puede estar bloqueando la descarga desde el navegador; repórtalo al administrador.');
        } finally {
            setDescargandoId(null);
        }
    };

    const acciones = (row) => (
        <>
            <button type="button" className={btnLink} onClick={() => setDetalle(row)} aria-label={`Ver solicitud de ${row.nombres} ${row.apellidos}`}>Ver</button>
            {row.estado === 'PENDIENTE' && (
                <>
                    <button type="button" className={btnLink} onClick={() => setAprobando(row)} aria-label={`Aprobar solicitud de ${row.nombres} ${row.apellidos}`}>Aprobar</button>
                    <button type="button" className={btnLinkDanger} onClick={() => setRechazando(row)} aria-label={`Rechazar solicitud de ${row.nombres} ${row.apellidos}`}>Rechazar</button>
                </>
            )}
            {isDescargable(row) && (
                <button type="button" className={btnLink} disabled={descargandoId === row._id} onClick={() => descargar(row)}>
                    {descargandoId === row._id ? 'Descargando...' : 'Descargar PDF'}
                </button>
            )}
        </>
    );

    const columns = [
        {
            header: 'Solicitante',
            primary: true,
            render: (row) => (
                <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{row.nombres} {row.apellidos}</p>
                    <p className="break-all text-xs text-gray-500">{row.correoSolicitante}</p>
                </div>
            )
        },
        {
            header: 'Diploma',
            render: (row) => (
                <span>
                    {row.diploma?.codigoDiploma ?? '—'}
                    {row.diploma?.nombrePrograma && <span className="block text-xs text-gray-500">{row.diploma.nombrePrograma}</span>}
                </span>
            )
        },
        { header: 'Recibida', render: (row) => formatDateTime(row.createdAt) },
        { header: 'Estado', render: estadoBadge },
        { header: 'Acciones', actions: true, render: acciones }
    ];

    const detalleItems = detalle ? [
        { label: 'Solicitante', value: `${detalle.nombres} ${detalle.apellidos}` },
        { label: 'Correo', value: detalle.correoSolicitante },
        { label: 'Documento del graduado', value: detalle.numeroDocumento },
        { label: 'Fecha de expedición declarada', value: formatDate(detalle.fechaExpedicionDocumento) },
        { label: 'Diploma', value: [detalle.diploma?.codigoDiploma, detalle.diploma?.nombrePrograma].filter(Boolean).join(' · ') },
        { label: 'Estado', value: estadoBadge(detalle) },
        { label: 'Recibida', value: formatDateTime(detalle.createdAt) },
        { label: 'Revisada', value: detalle.fechaRevision ? `${formatDateTime(detalle.fechaRevision)}${detalle.revisadoPor?.nombreUsuario ? ` por ${detalle.revisadoPor.nombreUsuario}` : ''}` : 'Sin revisar' },
        ...(detalle.estado === 'APROBADO' ? [{ label: 'Disponible hasta', value: formatDateTime(detalle.fechaExpiracion) }] : [])
    ] : [];

    return (
        <PageShell
            title="Solicitudes de documentos"
            description="Personas que pidieron la copia oficial de un diploma de tu institución. Aprueba subiendo el PDF o rechaza la solicitud."
            notices={(
                <>
                    {flash && <Notice tone="success" onClose={clearFlash}>{flash}</Notice>}
                    {descargaError && <Notice tone="error" onClose={() => setDescargaError('')}>{descargaError}</Notice>}
                </>
            )}
            toolbar={(
                <div className="max-w-xs">
                    <FormField id="filtro-sol-doc-estado" label="Estado">
                        <select className={inputClass} value={list.filters.estado ?? ''} onChange={(e) => list.applyFilters({ estado: e.target.value || undefined })}>
                            <option value="">Todas</option>
                            {Object.entries(ESTADOS_DOCUMENTO).map(([value, { label }]) => <option key={value} value={value}>{label}s</option>)}
                        </select>
                    </FormField>
                </div>
            )}
            footer={!list.error && list.total > 0 && (
                <Pagination page={list.page} totalPages={list.totalPages} total={list.total} onChange={list.setPage} disabled={list.loading} itemLabel="solicitudes" />
            )}
        >
            <DataTable
                caption="Solicitudes de documentos"
                columns={columns}
                rows={list.rows}
                loading={list.loading}
                error={list.error}
                onRetry={list.reload}
                emptyMessage={list.filters.estado === 'PENDIENTE' ? 'No tienes solicitudes pendientes por revisar.' : 'No hay solicitudes para mostrar.'}
            />

            <DetailModal
                show={!!detalle}
                title="Detalle de la solicitud"
                items={detalleItems}
                onClose={() => setDetalle(null)}
                footer={detalle && isDescargable(detalle) && (
                    <button type="button" className={btnSecondary} disabled={descargandoId === detalle._id} onClick={() => descargar(detalle)}>
                        {descargandoId === detalle._id ? 'Descargando...' : 'Descargar PDF'}
                    </button>
                )}
            />

            <AprobarSolicitudDocumentoModal
                solicitud={aprobando}
                onClose={() => setAprobando(null)}
                onAprobado={(message) => { setAprobando(null); setFlash(message); list.reload(); }}
            />

            <ConfirmModal
                show={!!rechazando}
                onClose={() => { setRechazando(null); setRechazoError(''); }}
                onConfirm={confirmRechazo}
                title="Rechazar solicitud"
                message={rechazando ? `Se rechazará la solicitud de ${rechazando.nombres} ${rechazando.apellidos}. Esta acción no se puede deshacer.` : ''}
                confirmLabel="Rechazar"
                cancelLabel="Cancelar"
                loading={rechazoBusy}
                error={rechazoError}
            />
        </PageShell>
    );
}
