import { useState } from "react";
import Table from "../components/Table";
import * as API from "../services/diplomas.service";

export default function Diplomas() {
  const [documento, setDocumento] = useState("");
  const [diplomas, setDiplomas] = useState([]);
  const [estado, setEstado] = useState("inicial");
  const [mensajeError, setMensajeError] = useState("");

  const buscarDiplomas = async (event) => {
    event.preventDefault();
    const numeroDocumento = documento.trim();

    if (!numeroDocumento) {
      setEstado("error");
      setMensajeError("Ingresa un número de documento para realizar la consulta.");
      return;
    }

    setEstado("cargando");
    setMensajeError("");
    setDiplomas([]);

    try {
      const response = await API.getDiplomasByGraduate(numeroDocumento);
      const resultados = response?.results || [];
      setDiplomas(resultados);
      setEstado(resultados.length ? "resultados" : "vacio");
    } catch (error) {
      if (error?.response?.status === 404) {
        setEstado("vacio");
        return;
      }

      setEstado("error");
      setMensajeError(error?.response?.data?.msg || "No fue posible consultar los diplomas.");
    }
  };

  return (
    <main className="grid w-full place-items-center px-4 py-8">
      <section className="w-full max-w-5xl">
        <h1 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-blue_primary md:text-5xl">
          Busca tus diplomas
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-center text-gray-700">
          Consulta los diplomas registrados con tu número de documento.
        </p>

        <form className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={buscarDiplomas}>
          <label className="sr-only" htmlFor="documento">Número de documento</label>
          <input
            id="documento"
            type="text"
            inputMode="numeric"
            className="min-h-11 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-gray-900 focus:border-blue_primary focus:outline-none focus:ring-2 focus:ring-blue_primary"
            placeholder="Número de documento"
            value={documento}
            onChange={(event) => setDocumento(event.target.value)}
          />
          <button
            type="submit"
            disabled={estado === "cargando"}
            className="min-h-11 rounded-lg bg-blue_primary px-5 font-medium text-white transition-colors hover:bg-blue_dark focus:outline-none focus:ring-2 focus:ring-blue_primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {estado === "cargando" ? "Consultando..." : "Consultar"}
          </button>
        </form>

        <section className="mt-10" aria-live="polite">
          {estado === "inicial" && <p className="text-center text-gray-700">Ingresa tu documento para comenzar.</p>}
          {estado === "cargando" && <p className="text-center text-gray-700">Consultando diplomas...</p>}
          {estado === "vacio" && <p className="text-center text-gray-700">No encontramos diplomas para el documento ingresado.</p>}
          {estado === "error" && <p className="text-center text-red-700" role="alert">{mensajeError}</p>}
          {estado === "resultados" && <Table diplomas={diplomas} />}
        </section>
      </section>
    </main>
  );
}
