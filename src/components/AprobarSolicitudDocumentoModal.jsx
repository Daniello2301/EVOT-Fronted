import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { aprobarSolicitudDocumento } from '../services/solicitudes.service';

function AprobarSolicitudDocumentoModal({ solicitud, onClose, onAprobado }) {
    const [archivo, setArchivo] = useState(null);
    const [fechaExpiracion, setFechaExpiracion] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!archivo) {
            setError('Adjunta el PDF del documento.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('documento', archivo);
            formData.append('fechaExpiracion', fechaExpiracion);
            await aprobarSolicitudDocumento(solicitud._id, formData);
            setArchivo(null);
            setFechaExpiracion('');
            onAprobado();
        } catch (err) {
            setError(err?.response?.data?.msg || 'No fue posible aprobar la solicitud.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={!!solicitud} onClose={onClose}>
            <div className="relative p-4 w-full max-w-lg max-h-full">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aprobar solicitud de documento</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Cerrar</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
                        )}
                        {solicitud && (
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                                Solicitante: <strong>{solicitud.nombres} {solicitud.apellidos}</strong> — Diploma {solicitud.diploma?.codigoDiploma}
                            </p>
                        )}
                        <div className="mb-4">
                            <label htmlFor="documento" className="block mb-2 text-sm font-medium text-blue_primary">Documento PDF</label>
                            <input
                                type="file"
                                id="documento"
                                name="documento"
                                accept="application/pdf"
                                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="fechaExpiracion" className="block mb-2 text-sm font-medium text-blue_primary">Fecha de expiración del enlace</label>
                            <input
                                type="date"
                                id="fechaExpiracion"
                                name="fechaExpiracion"
                                value={fechaExpiracion}
                                onChange={(e) => setFechaExpiracion(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue_primary px-5 py-2.5 text-sm font-medium text-white hover:bg-blue_dark transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? 'Aprobando...' : 'Aprobar y subir documento'}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default AprobarSolicitudDocumentoModal;
