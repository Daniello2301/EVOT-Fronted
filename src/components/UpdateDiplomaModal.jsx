import { useEffect, useState } from 'react'
import { Modal } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import { updateDiploma, solicitarEdicion } from '../services/diplomas.service';

const emptyForm = {
    codigoDiploma: "",
    nombrePrograma: "",
    nivelPrograma: "",
    registroPrograma: "",
    libro: "",
    fechaGrados: "",
    numeroDocumento: "",
};

function UpdateDiplomaModal({ props, diplomaUpdate }) {

    const { authUser } = useAuth();
    const isInstitucion = authUser?.rol === 'INSTITUCION';
    const puedeEditar = !isInstitucion || diplomaUpdate?.editableTemporalmente;

    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [motivoSolicitud, setMotivoSolicitud] = useState('');
    const [solicitando, setSolicitando] = useState(false);
    const [solicitudMsg, setSolicitudMsg] = useState('');
    const [solicitudError, setSolicitudError] = useState('');

    useEffect(() => {
        if (diplomaUpdate) {
            setForm({
                codigoDiploma: diplomaUpdate.codigoDiploma ?? "",
                nombrePrograma: diplomaUpdate.nombrePrograma ?? "",
                nivelPrograma: diplomaUpdate.nivelPrograma ?? "",
                registroPrograma: diplomaUpdate.registroPrograma ?? "",
                libro: diplomaUpdate.libro ?? "",
                fechaGrados: diplomaUpdate.fechaGrados ? diplomaUpdate.fechaGrados.slice(0, 10) : "",
                numeroDocumento: diplomaUpdate.graduado?.numeroDocumento ?? "",
            });
            setError('');
            setMotivoSolicitud('');
            setSolicitudMsg('');
            setSolicitudError('');
        }
    }, [diplomaUpdate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClose = () => props.setOpenModalEditDiploma(undefined);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await updateDiploma(diplomaUpdate._id, form);
            props.refreshDiplomas?.();
            handleClose();
        } catch (err) {
            setError(err?.response?.data?.msg || 'No fue posible actualizar el diploma.');
        } finally {
            setSaving(false);
        }
    };

    const handleSolicitarEdicion = async (e) => {
        e.preventDefault();
        setSolicitando(true);
        setSolicitudError('');
        setSolicitudMsg('');
        try {
            const data = await solicitarEdicion(diplomaUpdate._id, motivoSolicitud);
            setSolicitudMsg(data.msg || 'Solicitud enviada correctamente.');
        } catch (err) {
            setSolicitudError(err?.response?.data?.msg || 'No fue posible enviar la solicitud.');
        } finally {
            setSolicitando(false);
        }
    };

    return (
        <Modal show={props.openModalEditDiploma == 'openModalEdit'} onClose={handleClose}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {puedeEditar ? 'Editar diploma' : 'Solicitar edición de diploma'}
                        </h3>
                        <button
                            onClick={handleClose}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Cerrar</span>
                        </button>
                    </div>

                    {!puedeEditar ? (
                        <Modal.Body>
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                                Este diploma no está habilitado para edición. Envía una solicitud y espera la aprobación del administrador — tendrás 48 horas para editar una vez aprobada.
                            </p>
                            <form onSubmit={handleSolicitarEdicion}>
                                {solicitudError && (
                                    <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{solicitudError}</p>
                                )}
                                {solicitudMsg && (
                                    <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{solicitudMsg}</p>
                                )}
                                <label htmlFor="motivoSolicitud" className="block mb-2 text-sm font-medium text-blue_primary">
                                    Motivo de la solicitud
                                </label>
                                <textarea
                                    id="motivoSolicitud"
                                    name="motivoSolicitud"
                                    value={motivoSolicitud}
                                    onChange={(e) => setMotivoSolicitud(e.target.value)}
                                    rows={3}
                                    className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={solicitando || !!solicitudMsg}
                                    className="rounded-lg bg-blue_primary px-5 py-2.5 text-sm font-medium text-white hover:bg-blue_dark transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {solicitando ? 'Enviando...' : 'Solicitar edición'}
                                </button>
                            </form>
                        </Modal.Body>
                    ) : (
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
                                )}
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="codigoDiploma" className="block mb-2 text-sm font-medium text-blue_primary">Código diploma</label>
                                        <input type="text" name="codigoDiploma" id="codigoDiploma" value={form.codigoDiploma} onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                    </div>
                                    <div>
                                        <label htmlFor="nombrePrograma" className="block mb-2 text-sm font-medium text-blue_primary">Nombre del programa</label>
                                        <input type="text" name="nombrePrograma" id="nombrePrograma" value={form.nombrePrograma} onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                    </div>
                                    <div>
                                        <label htmlFor="nivelPrograma" className="block mb-2 text-sm font-medium text-blue_primary">Nivel del programa</label>
                                        <input type="text" name="nivelPrograma" id="nivelPrograma" value={form.nivelPrograma} onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                    </div>
                                    <div>
                                        <label htmlFor="registroPrograma" className="block mb-2 text-sm font-medium text-blue_primary">Registro del programa</label>
                                        <input type="text" name="registroPrograma" id="registroPrograma" value={form.registroPrograma} onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                    </div>
                                    <div>
                                        <label htmlFor="libro" className="block mb-2 text-sm font-medium text-blue_primary">Libro</label>
                                        <input type="text" name="libro" id="libro" value={form.libro} onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                    </div>
                                    <div>
                                        <label htmlFor="fechaGrados" className="block mb-2 text-sm font-medium text-blue_primary">Fecha de grados</label>
                                        <input type="date" name="fechaGrados" id="fechaGrados" value={form.fechaGrados} onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                    </div>
                                    <div>
                                        <label htmlFor="numeroDocumento" className="block mb-2 text-sm font-medium text-blue_primary">Documento del estudiante</label>
                                        <input type="text" name="numeroDocumento" id="numeroDocumento" value={form.numeroDocumento} onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue_primary px-5 py-2.5 text-sm font-medium text-white hover:bg-blue_dark transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </form>
                        </Modal.Body>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default UpdateDiplomaModal
