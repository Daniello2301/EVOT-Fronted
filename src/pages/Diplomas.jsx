import Table from "../components/Table";
import { useState, useEffect } from "react";
import * as API from "../services/diplomas.service";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function () {
  const [document, setDocument] = useState(0);
  const [diplomas, setDiplomas] = useState([]);

  const getDiplomas = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:4000/api/diplomas/by/graduate/${document}`, {
        params: {
          cedula: parseInt(document)
        }
      });
      console.log(response)
      setDiplomas(response?.data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDiplomas;
  }, []);

  return (
    <>
      <Navbar />
      <main className="grid items-center justify-center w-full h-full py-8">
        <h1 className="w-full mb-4 text-4xl font-extrabold tracking-tight text-blue_dark text-center leading-none md:text-5xl xl:text-6xl">
          Busca tú diplomas
        </h1>
        <section className="flex items-center justify-center">
          <div className="mb-6 mt-10 flex max-w-lg justify-center items-center gap-4">
            <label
              for="document"
              className="block mb-2 text-l font-medium text-blue_dark dark:text-blue_dark w-1/2 items-center text-center   "
            >
              Documento
            </label>
            <input
              type="number"
              id="document"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                          focus:ring-blue_dark focus:border-blue_dark block w-full p-2.5 dark:border-blue_dark
                          dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue_dark"
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
              className="text-white bg-blue_dark transition delay-75 hover:bg-blue_primary focus:outline-none focus:ring-4
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
                <p className="text-lg w-full text-center text-blue_dark font-medium"> Ingresa tu documento </p>
              </>
              :
              <Table diplomas={diplomas} />
          }
        </section>
      </main>
      <Footer />
    </>
  );
}
