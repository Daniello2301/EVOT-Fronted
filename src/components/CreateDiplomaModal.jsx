import { useState } from "react";

import { Modal } from "flowbite-react";
import Swal from 'sweetalert2'
import { createDiploma } from "../services/diplomas.service";

function CreateDiplomaModal({ props }) {

    const [dataDiplomaForm, setDataDiplomaForm] = useState({
        codigoDiploma: "",
        nombrePrograma: "",
        nivelPrograma: "",
        registroPrograma: "",
        libro: "",
        fechaGrados: "",
        numeroDocumento: "",
    });

    const handleChange = (e) => {
        setDataDiplomaForm({
            ...dataDiplomaForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await createDiploma(dataDiplomaForm);

            Swal.fire(
                'Evot Project Dice:',
                `${data.msg}`,

            )
            setDataDiplomaForm({
                codigoDiploma: "",
                nombrePrograma: "",
                nivelPrograma: "",
                registroPrograma: "",
                libro: "",
                fechaGrados: "",
                numeroDocumento: "",
            })
        } catch (error) {
            Swal.fire(
                'Evot Project Dice:',
                error?.response?.data?.msg || 'No fue posible crear el diploma.',
            )
        }
    };

    return (
        <>
            <Modal
                show={props.openModalCreateDiploma === "default"}
                onClose={() => props.setOpenModalCreateDiploma(undefined)}
            >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Agregar Diploma
                            </h3>
                            <button
                                onClick={() => {
                                    props.setOpenModalCreateDiploma(undefined);
                                }}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-target="createProductModal"
                                data-modal-toggle="createProductModal"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="codigoDiploma"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Codigo Diploma
                                        </label>
                                        <input
                                            type="text"
                                            name="codigoDiploma"
                                            id="codigoDiploma"
                                            value={dataDiplomaForm.codigoDiploma}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Type Codigo Diploma"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="nombrePrograma"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Nombre del Programa
                                        </label>
                                        <input
                                            type="text"
                                            name="nombrePrograma"
                                            id="nombrePrograma"
                                            value={dataDiplomaForm.nombrePrograma}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Nombre del programa"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="nivelPrograma"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Nivel del Programa
                                        </label>
                                        <input
                                            type="text"
                                            name="nivelPrograma"
                                            id="nivelPrograma"
                                            value={dataDiplomaForm.nivelPrograma}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Nivel del Programa"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="registroPrograma"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Registro del Programa
                                        </label>
                                        <input
                                            type="text"
                                            name="registroPrograma"
                                            id="registroPrograma"
                                            value={dataDiplomaForm.registroPrograma}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Registro del programa"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="libro"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Libro
                                        </label>
                                        <input
                                            type="text"
                                            name="libro"
                                            id="libro"
                                            value={dataDiplomaForm.libro}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Libro de grados"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="fechaGrados"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Fecha de grados
                                        </label>
                                        <input
                                            type="date"
                                            name="fechaGrados"
                                            id="fechaGrados"
                                            value={dataDiplomaForm.fechaGrados}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Fecha de grados"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="numeroDocumento"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Documento del estudiante
                                        </label>
                                        <input
                                            type="number"
                                            name="numeroDocumento"
                                            id="numeroDocumento"
                                            value={dataDiplomaForm.numeroDocumento}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Documento del estudiante"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="text-white flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                >
                                    <svg
                                        className="ml-1 w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Agregar Diploma
                                </button>
                            </form>
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CreateDiplomaModal;
