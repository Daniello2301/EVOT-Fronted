import { useEffect, useRef, useState } from 'react';
import FormModal from './common/FormModal';
import FormField from './common/FormField';
import { inputClass } from './common/ui';
import { aprobarSolicitudDocumento } from '../services/solicitudes.service';
import { apiErrorMessage } from '../helpers/apiResponse.js';
import { localInputDate } from '../helpers/formatters.js';
import { MAX_EXPIRACION_MESES, formatBytes, maxExpiracionInputDate, validateAprobacion } from '../helpers/solicitudModel.js';

/** Aprobar una solicitud de documento: subir el PDF oficial y fijar su vigencia. */
function AprobarSolicitudDocumentoModal({ solicitud, onClose, onAprobado }) {
    const [archivo, setArchivo] = useState(null);
    const [fechaExpiracion, setFechaExpiracion] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        if (solicitud) {
            setArchivo(null);
            setFechaExpiracion(localInputDate(30) <= maxExpiracionInputDate() ? localInputDate(30) : maxExpiracionInputDate());
            setErrors({});
            setError('');
            if (fileRef.current) fileRef.current.value = '';
        }
    }, [solicitud]);

    const submit = async () => {
        const { errors: nextErrors, payload } = validateAprobacion({ archivo, fechaExpiracion });
        setErrors(nextErrors);
        setError('');
        if (!payload) {
            document.getElementById(nextErrors.archivo ? 'aprobar-documento' : 'aprobar-fechaExpiracion')?.focus();
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('documento', payload.archivo);
            formData.append('fechaExpiracion', payload.fechaExpiracion);
            await aprobarSolicitudDocumento(solicitud._id, formData);
            onAprobado(`Se aprobó la solicitud de ${solicitud.nombres} ${solicitud.apellidos}.`);
        } catch (err) {
            setError(apiErrorMessage(err, 'No se pudo aprobar la solicitud. Verifica que el archivo sea un PDF de máximo 10 MB.'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormModal
            show={!!solicitud}
            title="Aprobar solicitud de documento"
            onClose={onClose}
            onSubmit={submit}
            busy={saving}
            busyLabel="Subiendo documento..."
            error={error}
            submitLabel="Aprobar y subir"
            size="lg"
        >
            {solicitud && (
                <dl className="grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-3 text-sm sm:grid-cols-2">
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Solicitante</dt>
                        <dd className="font-semibold text-gray-900">{solicitud.nombres} {solicitud.apellidos}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Diploma</dt>
                        <dd className="text-gray-900">{solicitud.diploma?.codigoDiploma ?? '—'}</dd>
                    </div>
                </dl>
            )}
            <FormField
                id="aprobar-documento"
                label="Documento oficial (PDF)"
                required
                error={errors.archivo}
                hint={archivo ? `${archivo.name} · ${formatBytes(archivo.size)}` : 'Solo PDF, máximo 10 MB.'}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-blue_primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white`}
                    onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                />
            </FormField>
            <FormField
                id="aprobar-fechaExpiracion"
                label="Disponible hasta"
                required
                error={errors.fechaExpiracion}
                hint={`Hasta ese día la institución podrá descargarlo. Máximo ${MAX_EXPIRACION_MESES} meses.`}
            >
                <input
                    type="date"
                    min={localInputDate(0)}
                    max={maxExpiracionInputDate()}
                    className={inputClass}
                    value={fechaExpiracion}
                    onChange={(e) => setFechaExpiracion(e.target.value)}
                />
            </FormField>
        </FormModal>
    );
}

export default AprobarSolicitudDocumentoModal;
