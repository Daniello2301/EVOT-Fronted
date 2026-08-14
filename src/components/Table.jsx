import { useEffect, useState } from "react";
import SolicitarDocumentoModal from "./SolicitarDocumentoModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GooeyToaster, gooeyToast } from 'goey-toast'

export default function Table({ diplomas }) {
  const [data, setData] = useState([]);

  const [diplomaSeleccionado, setDiplomaSeleccionado] = useState(null);

  const { isLoggedIn, guardarEstadoPendiente, recuperarEstadoPendiente, limpiarEstadoPendiente } = useAuth();
  const navigate = useNavigate();

  const columnas = ['Título', 'Nivel', 'Libro', 'Fecha', 'Institución', 'Acciones'];

  const showLoginInfoToast = () => {
    gooeyToast.info('Debes iniciar sesión para solicitar el diploma', {
      position: 'top-center',
      fillColor: '#eff6ff',
      borderColor: '#93c5fd',
      borderWidth: 1.5,
      showProgress: true,
      preset: 'smooth',
      classNames: {
        wrapper: 'evot-toast-info-wrapper',
        title: 'evot-toast-info-title',
        description: 'evot-toast-info-description',
        actionButton: 'evot-toast-info-action'
      },
      action: {
        label: 'Iniciar sesión',
        onClick: () => {
          navigate('/login');
        }
      }
    });
  };

  useEffect(() => {

    // Si el usuario no está autenticado, guardamos el estado pendiente (la página que intentaba acceder) y redirigimos al usuario a la página de login
    const estadoPendiente = recuperarEstadoPendiente();

    if (estadoPendiente && isLoggedIn) {
      // Si hay un estado pendiente guardado y el usuario ya está autenticado, redirigimos al usuario a la página que intentaba acceder originalmente
      setDiplomaSeleccionado(estadoPendiente.diploma);

      // Limpiamos el estado pendiente después de usarlo, para evitar redirecciones no deseadas en el futuro
      limpiarEstadoPendiente();

    }

    setData(diplomas);
    // Context helpers are stable for the provider lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diplomas, isLoggedIn]);

  const handleSolicitar = (diploma) => {
    // Validar si está logueado
    console.log(isLoggedIn);
    if (!isLoggedIn) {

      // Guardar el diploma y la URL actual
      guardarEstadoPendiente({
        diploma: diploma,
        url: window.location.pathname,
        accion: 'solicitar_diploma',
        timestamp: new Date().toISOString()
      });

      showLoginInfoToast();
      return;
    }

    // Si está logueado, proceder normalmente
    setDiplomaSeleccionado(diploma);
  };

  return (
    <>
      <GooeyToaster position="top-center" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {
                columnas.map((columna, index) => {
                  return (
                    <th scope="col" className="px-6 py-3" key={index}>
                      <div className="flex items-center">
                        {columna}
                        <a href="#">
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </a>
                      </div>
                    </th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((diploma, index) => {
                return (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {diploma.nombrePrograma}
                    </th>
                    <td className="px-6 py-4">{diploma.nivelPrograma}</td>
                    <td className="px-6 py-4">{diploma.libro}</td>
                    <td className="px-6 py-4">
                      {new Date(diploma.fechaGrados).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {diploma.institucion?.nombreInstitucion}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSolicitar(diploma)}
                        className="text-white bg-blue_primary hover:bg-blue_dark transition-colors text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        Solicitar
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {diplomaSeleccionado && (
        <SolicitarDocumentoModal
          diploma={diplomaSeleccionado}
          onClose={() => setDiplomaSeleccionado(null)}
        />
      )}
    </>
  );
}



