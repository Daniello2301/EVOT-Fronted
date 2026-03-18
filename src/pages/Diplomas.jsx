import Table from "../components/Table";
import { useState, useEffect } from "react";
import * as API from "../services/diplomas.service";

import { gooeyToast, GooeyToaster } from "goey-toast";

export default function () {

  const [document, setDocument] = useState(0);
  const [diplomas, setDiplomas] = useState(
    [
    {
      _id: '69bac7f19d0e8757812278f0',
      codigoDiploma: 'DIP-DS-2023-056',
      nombrePrograma: 'Tecnología en Desarrollo de Software',
      nivelPrograma: 'Tecnología',
      registroPrograma: 'REG-DS-330',
      libro: 'Acta 2023-I',
      fechaGrados: '2023-06-30T00:00:00.000Z',
      graduado: {
        _id: '69bac70f9d0e8757812278db',
        numeroDocumento: '100200300',
        nombres: 'Tomas',
        apellidos: 'Hernandez'
      },
      institucion: {
        _id: '69bac53c9d0e8757812278c6',
        codigoInstitucion: 1010,
        nombreInstitucion: 'Laboratorio de Pruebas EVOT',
        ciudad: 'Medellin',
        departamento: 'Antioquia'
      },
      estado: true,
      createdAt: '2026-03-18T15:42:41.606Z',
      updatedAt: '2026-03-18T15:42:41.606Z'
    },
    {
      _id: '69bac7e09d0e8757812278eb',
      codigoDiploma: 'DIP-IND-2022-077',
      nombrePrograma: 'Ingeniería Industrial',
      nivelPrograma: 'Pregrado',
      registroPrograma: 'REG-IND-210',
      libro: 'Acta 2022-II',
      fechaGrados: '2022-12-02T00:00:00.000Z',
      graduado: {
        _id: '69bac70f9d0e8757812278db',
        numeroDocumento: '100200300',
        nombres: 'Tomas',
        apellidos: 'Hernandez'
      },
      institucion: {
        _id: '69bac53c9d0e8757812278c6',
        codigoInstitucion: 1010,
        nombreInstitucion: 'Laboratorio de Pruebas EVOT',
        ciudad: 'Medellin',
        departamento: 'Antioquia'
      },
      estado: true,
      createdAt: '2026-03-18T15:42:24.365Z',
      updatedAt: '2026-03-18T15:42:24.365Z'
    },
    {
      _id: '69bac7c79d0e8757812278e6',
      codigoDiploma: 'DIP-IST-2024-001',
      nombrePrograma: 'Ingeniería de Sistemas',
      nivelPrograma: 'Pregrado',
      registroPrograma: 'REG-IST-001',
      libro: 'Acta 2024-I',
      fechaGrados: '2024-05-10T00:00:00.000Z',
      graduado: {
        _id: '69bac70f9d0e8757812278db',
        numeroDocumento: '100200300',
        nombres: 'Tomas',
        apellidos: 'Hernandez'
      },
      institucion: {
        _id: '69bac53c9d0e8757812278c6',
        codigoInstitucion: 1010,
        nombreInstitucion: 'Laboratorio de Pruebas EVOT',
        ciudad: 'Medellin',
        departamento: 'Antioquia'
      },
      estado: true,
      createdAt: '2026-03-18T15:41:59.066Z',
      updatedAt: '2026-03-18T15:41:59.066Z'
    }
  ]
  );

  const getDiplomas = async (e) => {
    e.preventDefault();
    try {
      const response = await API.getDiplomasByGraduate(document);
      console.log(response?.results);
      setDiplomas(response?.results)
    } catch (error) {
      gooeyToast.error(error?.response?.data?.msg || "Error");
    }
  };

  useEffect(() => {
    getDiplomas;
  }, []);

  return (
    <>
      <GooeyToaster position="top-center" />
      <main className="grid items-center justify-center w-full h-full py-8">
        <h1 className="w-full mb-4 text-4xl font-extrabold tracking-tight text-blue_primary text-center leading-none md:text-5xl xl:text-6xl">
          Busca tus diplomas
        </h1>
        <section className="flex items-center justify-center">
          <div className="mb-6 mt-10 flex max-w-lg justify-center items-center gap-4">
            <label
              htmlFor="document"
              className="block mb-2 text-l font-medium text-blue_primary dark:text-blue_primary w-1/2 items-center text-center   "
            >
              Documento
            </label>
            <input
              type="number"
              id="document"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                          focus:ring-blue_primary focus:border-blue_primary block w-full p-2.5 dark:border-blue_primary
                          dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue_primary"
              placeholder="Documento"
              value={document}
              onChange={(e) => {
                setDocument(e.target.value);
              }}
              required
            />
            <button
              onClick={getDiplomas}
              type="button"
              className="text-white bg-blue-700 transition delay-75 hover:bg-blue_primary focus:outline-none focus:ring-4
                focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 
                "
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
            </button>
          </div>
        </section>
        <section className="grid items-center mt-12 ">
          {
            diplomas.length <= 0
              ?
              <>
                <p className="text-lg w-full text-center text-blue_primary font-medium"> Ingresa tu documento </p>
              </>
              :
              <Table diplomas={diplomas} />
          }
        </section>
      </main>
    </>
  );
}
