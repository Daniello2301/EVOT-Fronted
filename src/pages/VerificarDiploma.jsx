import { useState } from "react";
import { verificarDiploma } from "../services/diplomas.service";

export default function VerificarDiploma() {
  const [codigo, setCodigo] = useState("");
  const [diploma, setDiploma] = useState(null);
  const [estado, setEstado] = useState("inicial");
  const [mensajeError, setMensajeError] = useState("");

  const handleVerificar = async (event) => {
    event.preventDefault();
    const codigoDiploma = codigo.trim();

    if (!codigoDiploma) {
      setEstado("error");
      setMensajeError("Ingresa el código del diploma para verificarlo.");
      return;
    }

    setEstado("cargando");
    setMensajeError("");
    setDiploma(null);

    try {
      const response = await verificarDiploma(codigoDiploma);
      setDiploma(response.diploma);
      setEstado("resultado");
    } catch (error) {
      if (error?.response?.status === 404) {
        setEstado("vacio");
        return;
      }

      setEstado("error");
      setMensajeError(error?.response?.data?.msg || "No fue posible verificar el diploma.");
    }
  };

  return (
    <main className="grid w-full place-items-center px-4 py-8">
      <section className="w-full max-w-5xl">
        <h1 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-blue_primary md:text-5xl">
          Verifica un diploma
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-center text-gray-700">
          Ingresa el código público del diploma para confirmar su autenticidad al instante.
        </p>

        <form className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={handleVerificar}>
          <label className="sr-only" htmlFor="codigoDiploma">Código del diploma</label>
          <input
            id="codigoDiploma"
            type="text"
            className="min-h-11 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-gray-900 focus:border-blue_primary focus:outline-none focus:ring-2 focus:ring-blue_primary"
            placeholder="Código del diploma"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value)}
          />
          <button
            type="submit"
            disabled={estado === "cargando"}
            className="min-h-11 rounded-lg bg-blue_primary px-5 font-medium text-white transition-colors hover:bg-blue_dark focus:outline-none focus:ring-2 focus:ring-blue_primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {estado === "cargando" ? "Verificando..." : "Verificar"}
          </button>
        </form>

        <section className="mt-10" aria-live="polite">
          {estado === "inicial" && <p className="text-center text-gray-700">Ingresa el código para comenzar.</p>}
          {estado === "cargando" && <p className="text-center text-gray-700">Verificando diploma...</p>}
          {estado === "vacio" && <p className="text-center text-gray-700">No encontramos ningún diploma activo con ese código.</p>}
          {estado === "error" && <p className="text-center text-red-700" role="alert">{mensajeError}</p>}
          {estado === "resultado" && diploma && (
            <div className="evot-surface-card mx-auto max-w-xl">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-green-700">Diploma verificado</p>
              <h2 className="mb-4 text-xl font-bold text-black_primary">{diploma.nombrePrograma}</h2>
              <dl className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-blue_primary">Código</dt>
                  <dd>{diploma.codigoDiploma}</dd>
                </div>
                <div>
                  <dt className="font-medium text-blue_primary">Nivel</dt>
                  <dd>{diploma.nivelPrograma}</dd>
                </div>
                <div>
                  <dt className="font-medium text-blue_primary">Institución</dt>
                  <dd>{diploma.institucion?.nombreInstitucion}</dd>
                </div>
                <div>
                  <dt className="font-medium text-blue_primary">Graduado</dt>
                  <dd>{diploma.graduado?.numeroDocumento}</dd>
                </div>
                <div>
                  <dt className="font-medium text-blue_primary">Fecha de grado</dt>
                  <dd>{new Date(diploma.fechaGrados).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                </div>
              </dl>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
