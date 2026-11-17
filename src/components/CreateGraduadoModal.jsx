import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { createGraduado } from '../services/graduado.service';

const initialForm = {
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: ''
};

function CreateGraduadoModal({ show, onClose, onCreated }) {
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await createGraduado(form);
            setForm(initialForm);
            onCreated();
        } catch (err) {
            setError(err?.response?.data?.msg || 'No fue posible registrar el graduado.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agregar graduado</h3>
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
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="tipoDocumento" className="block mb-2 text-sm font-medium text-blue_primary">Tipo de documento</label>
                                <select
                                    name="tipoDocumento"
                                    id="tipoDocumento"
                                    value={form.tipoDocumento}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                >
                                    <option value="CC">Cédula de ciudadanía</option>
                                    <option value="TI">Tarjeta de identidad</option>
                                    <option value="CE">Cédula de extranjería</option>
                                    <option value="PA">Pasaporte</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="numeroDocumento" className="block mb-2 text-sm font-medium text-blue_primary">Número de documento</label>
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    id="numeroDocumento"
                                    value={form.numeroDocumento}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="nombres" className="block mb-2 text-sm font-medium text-blue_primary">Nombres</label>
                                <input
                                    type="text"
                                    name="nombres"
                                    id="nombres"
                                    value={form.nombres}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="apellidos" className="block mb-2 text-sm font-medium text-blue_primary">Apellidos</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    id="apellidos"
                                    value={form.apellidos}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="fechaNacimiento" className="block mb-2 text-sm font-medium text-blue_primary">Fecha de nacimiento</label>
                                <input
                                    type="date"
                                    name="fechaNacimiento"
                                    id="fechaNacimiento"
                                    value={form.fechaNacimiento}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue_primary px-5 py-2.5 text-sm font-medium text-white hover:bg-blue_dark transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : 'Agregar graduado'}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default CreateGraduadoModal;
