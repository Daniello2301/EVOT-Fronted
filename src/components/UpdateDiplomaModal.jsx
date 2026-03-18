import React, { useEffect, useState } from 'react'
import { Modal } from 'flowbite-react';

import * as API from '../services/institucions.service'
import { useInstitutionsContext } from '../context/InstitutionsContext';

function UpdateDiplomaModal({ props, diplomaUpdate }) {

    console.log(diplomaUpdate);

    const { institutions } = useInstitutionsContext();

    console.log(institutions);

    const [dataDiplomaForm, setDataDiplomaForm] = useState({
        codigoDiploma: "",
        nombrePrograma: "",
        nivelPrograma: "",
        registroPrograma: "",
        libro: "",
        fechaGrados: "",
        cedula: 0,
        institucion: "",
    });

    const handleChange = (e) => {
        setDataDiplomaForm({
            ...dataDiplomaForm,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (diplomaUpdate) {
            setDataDiplomaForm({
                codigoDiploma: diplomaUpdate.codigoDiploma,
                nombrePrograma: diplomaUpdate.nombrePrograma,
                nivelPrograma: diplomaUpdate.nivelPrograma,
                registroPrograma: diplomaUpdate.registroPrograma,
                libro: diplomaUpdate.libro,
                fechaGrados: diplomaUpdate.fechaGrados,
            })
        }

    }, [diplomaUpdate]);

    return (
        <>
            {/* <!-- Update modal --> */}
            <Modal show={props.openModalEditDiploma == 'openModalEdit'} onClose={() => { props.setOpenModalEditDiploma(undefined) }} >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    {/* <!-- Modal content --> */}
                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        {/* <!-- Modal header --> */}
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Product</h3>
                            <button
                                onClick={() => {
                                    props.setOpenModalEditDiploma(undefined)
                                }}
                                type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* <Modal.Body>
                            {diplomaUpdate ? diplomaUpdate.nombrePrograma : ""}
                        </Modal.Body> */}
                        {/* <!-- Modal body --> */}
                        <Modal.Body>
                            <form onSubmit={""}>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            for="codigoDiploma"
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
                                            for="nombrePrograma"
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
                                            for="nivelPrograma"
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
                                            for="registroPrograma"
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
                                            for="libro"
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
                                            for="fechaGrados"
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
                                            for="cedula"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Documento del estudiante
                                        </label>
                                        <input
                                            type="number"
                                            name="cedula"
                                            id="cedula"
                                            value={dataDiplomaForm.cedula}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Documento del estudiante"
                                            required
                                        />
                                    </div>
                                    {/* <div>
                                        <label
                                            for="institucion"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Institucion
                                        </label>
                                        <select
                                            id="institucion"
                                            name="institucion"
                                            onChange={handleChange}
                                            value={dataDiplomaForm.institucion}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        >
                                            <option selected>
                                                Institucion
                                            </option>
                                            {
                                                institutions && institutions.map((intuticion) => (
                                                    <option key={intuticion._id} value={intuticion._id}>
                                                        {intuticion.nombreInstitucion}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div> */}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update product</button>
                                    <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                        <svg className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default UpdateDiplomaModal