import React, { useEffect, useState } from "react";

import { Modal } from "flowbite-react";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

function CreateDiplomaModal({ props }) {

    const [institutions, setInstitutions] = useState([]);
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem("TOKEN");

    const [dataDiplomaForm, setDataDiplomaForm] = useState({
        codigoDiploma: "",
        nombrePrograma: "",
        nivelPrograma: "",
        registroPrograma: "",
        libro: "",
        fechaGrados: "",
        cedula: 0,
        institucion: '',
    });

    const handleChange = (e) => {
        setDataDiplomaForm({
            ...dataDiplomaForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        /*  console.log(newDiploma); */

        console.log(TOKEN)
        console.log(dataDiplomaForm.institucion)
        const newDiploma = {
            codigoDiploma: dataDiplomaForm.codigoDiploma,
            nombrePrograma: dataDiplomaForm.nombrePrograma,
            nivelPrograma: dataDiplomaForm.nivelPrograma,
            registroPrograma: dataDiplomaForm.registroPrograma,
            libro: dataDiplomaForm.libro,
            fechaGrados: dataDiplomaForm.fechaGrados,
            cedula: parseInt(dataDiplomaForm.cedula),
            institucion: dataDiplomaForm.institucion,
        };

        try {
            const response = await fetch("http://localhost:4000/api/diploma/create", {
                method: "POST",
                body: JSON.stringify(newDiploma),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${TOKEN}`,
                },
            });

            const data = await response.json();

            if (data.error) {
                console.log(data.error);
            } else {
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
                    cedula: 0,
                    institucion: '',
                })
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getInstitutions = async () => {
        try {
            const respuesta = await fetch("http://localhost:4000/api/institutions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${TOKEN}`
                },
            });

            const data = await respuesta.json();

            console.log(data);
            if (data.error) {
                console.log(error);;
            } else {
                setInstitutions(data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getInstitutions();
    }, [])

    return (
        <>
            <Modal
                show={props.openModalCreateDiploma === "default"}
                onClose={() => props.setOpenModalCreateDiploma(undefined)}
            >
                <div class="relative p-4 w-full max-w-2xl max-h-full">
                    <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                Agregar Diploma
                            </h3>
                            <button
                                onClick={() => {
                                    props.setOpenModalCreateDiploma(undefined);
                                }}
                                type="button"
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-target="createProductModal"
                                data-modal-toggle="createProductModal"
                            >
                                <svg
                                    aria-hidden="true"
                                    class="w-5 h-5"
                                    fill="currentColor"
                                    viewbox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div class="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            for="codigoDiploma"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Codigo Diploma
                                        </label>
                                        <input
                                            type="text"
                                            name="codigoDiploma"
                                            id="codigoDiploma"
                                            value={dataDiplomaForm.codigoDiploma}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Type Codigo Diploma"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="nombrePrograma"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Nombre del Programa
                                        </label>
                                        <input
                                            type="text"
                                            name="nombrePrograma"
                                            id="nombrePrograma"
                                            value={dataDiplomaForm.nombrePrograma}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Nombre del programa"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="nivelPrograma"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Nivel del Programa
                                        </label>
                                        <input
                                            type="text"
                                            name="nivelPrograma"
                                            id="nivelPrograma"
                                            value={dataDiplomaForm.nivelPrograma}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Nivel del Programa"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="registroPrograma"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Registro del Programa
                                        </label>
                                        <input
                                            type="text"
                                            name="registroPrograma"
                                            id="registroPrograma"
                                            value={dataDiplomaForm.registroPrograma}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Registro del programa"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="libro"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Libro
                                        </label>
                                        <input
                                            type="text"
                                            name="libro"
                                            id="libro"
                                            value={dataDiplomaForm.libro}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Libro de grados"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="fechaGrados"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Fecha de grados
                                        </label>
                                        <input
                                            type="date"
                                            name="fechaGrados"
                                            id="fechaGrados"
                                            value={dataDiplomaForm.fechaGrados}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Fecha de grados"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="cedula"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Documento del estudiante
                                        </label>
                                        <input
                                            type="number"
                                            name="cedula"
                                            id="cedula"
                                            value={dataDiplomaForm.cedula}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Documento del estudiante"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="institucion"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Institucion
                                        </label>
                                        <select
                                            id="institucion"
                                            name="institucion"
                                            onChange={handleChange}
                                            value={dataDiplomaForm.institucion}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        >
                                            <option selected>
                                                Institucion
                                            </option>
                                            {
                                                institutions.map((intuticion) => (
                                                    <option key={intuticion._id} value={intuticion._id}>
                                                        {intuticion.nombreInstitucion}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    class="text-white flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                >
                                    <svg
                                        class="ml-1 w-6 h-6"
                                        fill="currentColor"
                                        viewbox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clip-rule="evenodd"
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
