import { useState } from 'react';
import { solicitarDocumento } from '../services/diplomas.service';

export default function SolicitarDocumentoModal({ diploma, onClose }) {
    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        correoSolicitante: '',
        fechaExpedicionDocumento: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await solicitarDocumento(diploma.codigoDiploma, form);
            console.log(res);
            setSuccess(true);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.msg || 'Error al enviar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-lg font-bold text-blue_primary w-full text-center">
                        Solicitar documento físico
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Info del diploma */}
                <div className="px-5 pt-4 pb-2 bg-gray-50 mx-5 mt-4 rounded-lg">
                    <p className="text-sm text-gray-500">Programa</p>
                    <p className="text-sm font-medium text-blue_primary">{diploma.nombrePrograma}</p>
                    <p className="text-sm text-gray-500 mt-1">Institución</p>
                    <p className="text-sm font-medium text-blue_primary">{diploma.institucion?.nombreInstitucion}</p>
                </div>

                {/* Formulario o mensaje de éxito */}
                {success ? (
                    <div className="p-5 text-center space-y-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                            Solicitud enviada correctamente. La institución procesará tu solicitud y recibirás el documento en tu correo.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full text-white bg-blue_primary hover:bg-blue_primary transition-colors font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Nombres
                                </label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={form.nombres}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue_primary focus:border-blue_primary block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Apellidos
                                </label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={form.apellidos}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue_primary focus:border-blue_primary block w-full p-2.5"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="correoSolicitante"
                                value={form.correoSolicitante}
                                onChange={handleChange}
                                placeholder="tu@correo.com"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue_primary focus:border-blue_primary block w-full p-2.5"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Fecha de expedición del documento
                            </label>
                            <input
                                type="date"
                                name="fechaExpedicionDocumento"
                                value={form.fechaExpedicionDocumento}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue_primary focus:border-blue_primary block w-full p-2.5"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Fecha de expedición de tu cédula o documento de identidad
                            </p>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 text-white bg-blue_primary hover:bg-blue_dark transition-colors font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : 'Solicitar'}
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
}