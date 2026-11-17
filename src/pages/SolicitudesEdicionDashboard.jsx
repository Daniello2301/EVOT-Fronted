import { useState } from 'react';
import PageShell from '../components/common/PageShell';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import FormField from '../components/common/FormField';
import ConfirmModal from '../components/common/ConfirmModal';
import DetailModal from '../components/common/DetailModal';
import StatusBadge from '../components/common/StatusBadge';
import Notice from '../components/common/Notice';
import { btnLink, btnLinkDanger, inputClass } from '../components/common/ui';
import usePagedList from '../Hooks/usePagedList';
import useFlash from '../Hooks/useFlash';
import { aprobarSolicitudEdicion, getSolicitudesEdicion, rechazarSolicitudEdicion } from '../services/solicitudes.service';
import { apiErrorMessage } from '../helpers/apiResponse.js';
import { ESTADOS_EDICION, describeEstado } from '../helpers/estados.js';
import { formatDateTime } from '../helpers/formatters.js';

const estadoBadge = (row) => <StatusBadge {...describeEstado(ESTADOS_EDICION, row.estado)} />;

/** Solicitudes de las instituciones para editar un diploma ya emitido (rol ADMIN). */
export default function SolicitudesEdicionDashboard() {
    const list = usePagedList(getSolicitudesEdicion, { initialFilters: { estado: 'PENDIENTE' } });
    const [detalle, setDetalle] = useState(null);
    const [accion, setAccion] = useState(null); // { tipo: 'aprobar' | 'rechazar', solicitud }
    const [busy, setBusy] = useState(false);
    const [accionError, setAccionError] = useState('');
    const [flash, setFlash, clearFlash] = useFlash(8000);

    const aprobar = accion?.tipo === 'aprobar';

    const confirmar = async () => {
        setBusy(true);
        setAccionError('');
        try {
            const codigo = accion.solicitud.diploma?.codigoDiploma ?? 'el diploma';
            if (aprobar) {
                const data = await aprobarSolicitudEdicion(accion.solicitud._id);
                setFlash(`Se aprobó la edición de ${codigo}. La institución puede editarlo hasta el ${formatDateTime(data?.expiracion)}.`);
            } else {
                await rechazarSolicitudEdicion(accion.solicitud._id);
                setFlash(`Se rechazó la solicitud de edición de ${codigo}.`);
            }
            setAccion(null);
            list.reload();
        } catch (err) {
            setAccionError(apiErrorMessage(err, aprobar ? 'No se pudo aprobar la solicitud.' : 'No se pudo rechazar la solicitud.'));
        } finally {
            setBusy(false);
        }
    };

    const columns = [
        {
            header: 'Diploma',
            primary: true,
            render: (row) => (
                <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{row.diploma?.codigoDiploma ?? '—'}</p>
                    {row.diploma?.nombrePrograma && <p className="text-xs text-gray-500">{row.diploma.nombrePrograma}</p>}
                </div>
            )
        },
        {
            header: 'Solicitada por',
            render: (row) => (
                <span>
                    {row.solicitadoPor?.nombreUsuario ?? '—'}
                    {row.solicitadoPor?.correo && <span className="block break-all text-xs text-gray-500">{row.solicitadoPor.correo}</span>}
                </span>
            )
        },
        {
            header: 'Motivo',
            className: 'max-w-xs',
            render: (row) => <span className="line-clamp-2" title={row.motivoSolicitud}>{row.motivoSolicitud}</span>
        },
        { header: 'Recibida', render: (row) => formatDateTime(row.createdAt), hideOnMobile: true },
        { header: 'Estado', render: estadoBadge },
        {
            header: 'Acciones',
            actions: true,
            render: (row) => (
                <>
                    <button type="button" className={btnLink} onClick={() => setDetalle(row)}>Ver</button>
                    {row.estado === 'PENDIENTE' && (
                        <>
                            <button type="button" className={btnLink} onClick={() => setAccion({ tipo: 'aprobar', solicitud: row })} aria-label={`Aprobar edición de ${row.diploma?.codigoDiploma ?? 'diploma'}`}>Aprobar</button>
                            <button type="button" className={btnLinkDanger} onClick={() => setAccion({ tipo: 'rechazar', solicitud: row })} aria-label={`Rechazar edición de ${row.diploma?.codigoDiploma ?? 'diploma'}`}>Rechazar</button>
                        </>
                    )}
                </>
            )
        }
    ];

    const detalleItems = detalle ? [
        { label: 'Diploma', value: [detalle.diploma?.codigoDiploma, detalle.diploma?.nombrePrograma].filter(Boolean).join(' · ') },
        { label: 'Estado', value: estadoBadge(detalle) },
        { label: 'Solicitada por', value: [detalle.solicitadoPor?.nombreUsuario, detalle.solicitadoPor?.correo].filter(Boolean).join(' · ') },
        { label: 'Recibida', value: formatDateTime(detalle.createdAt) },
        { label: 'Motivo', value: detalle.motivoSolicitud, wide: true },
        { label: 'Revisada', value: detalle.fechaRevision ? `${formatDateTime(detalle.fechaRevision)}${detalle.revisadoPor?.nombreUsuario ? ` por ${detalle.revisadoPor.nombreUsuario}` : ''}` : 'Sin revisar', wide: true }
    ] : [];

    return (
        <PageShell
            title="Solicitudes de edición"
            description="Las instituciones piden permiso para corregir un diploma ya emitido. Al aprobar, el diploma queda editable durante 48 horas."
            notices={flash && <Notice tone="success" onClose={clearFlash}>{flash}</Notice>}
            toolbar={(
                <div className="max-w-xs">
                    <FormField id="filtro-sol-ed-estado" label="Estado">
                        <select className={inputClass} value={list.filters.estado ?? ''} onChange={(e) => list.applyFilters({ estado: e.target.value || undefined })}>
                            <option value="">Todas</option>
                            {Object.entries(ESTADOS_EDICION).map(([value, { label }]) => <option key={value} value={value}>{label}s</option>)}
                        </select>
                    </FormField>
                </div>
            )}
            footer={!list.error && list.total > 0 && (
                <Pagination page={list.page} totalPages={list.totalPages} total={list.total} onChange={list.setPage} disabled={list.loading} itemLabel="solicitudes" />
            )}
        >
            <DataTable
                caption="Solicitudes de edición"
                columns={columns}
                rows={list.rows}
                loading={list.loading}
                error={list.error}
                onRetry={list.reload}
                emptyMessage={list.filters.estado === 'PENDIENTE' ? 'No hay solicitudes de edición pendientes.' : 'No hay solicitudes para mostrar.'}
            />

            <DetailModal show={!!detalle} title="Solicitud de edición" items={detalleItems} onClose={() => setDetalle(null)} />

            <ConfirmModal
                show={!!accion}
                onClose={() => { setAccion(null); setAccionError(''); }}
                onConfirm={confirmar}
                tone={aprobar ? 'primary' : 'danger'}
                title={aprobar ? 'Aprobar edición' : 'Rechazar edición'}
                message={accion ? (aprobar
                    ? `${accion.solicitud.solicitadoPor?.nombreUsuario ?? 'La institución'} podrá editar el diploma ${accion.solicitud.diploma?.codigoDiploma ?? ''} durante las próximas 48 horas.`
                    : `Se rechazará la solicitud de edición del diploma ${accion.solicitud.diploma?.codigoDiploma ?? ''}.`) : ''}
                confirmLabel={aprobar ? 'Aprobar' : 'Rechazar'}
                cancelLabel="Cancelar"
                loading={busy}
                error={accionError}
            />
        </PageShell>
    );
}
