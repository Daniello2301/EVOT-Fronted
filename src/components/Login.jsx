import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Llamamos a la función de login del contexto de autenticación, que se encargará de hacer la llamada al backend, guardar el token y la información del usuario en el estado global, y devolver el estado pendiente (si es que hay uno guardado)
      const estadoPendiente = await login(correo, contraseña);

      // Si hay un estado pendiente guardado, redirigimos al usuario a la página que intentaba acceder originalmente
      if (estadoPendiente) {
        // Redirigimos al usuario a la URL que intentaba acceder originalmente, que está guardada en el estado pendiente
        navigate(estadoPendiente.url);
      }else {
        // Si no hay un estado pendiente, redirigimos al usuario a la página de admin-dashboard por defecto después de iniciar sesión
        navigate("/admin-dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Correo o contraseña incorrecta";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = (e) => {
    // Evitamos que el enlace realice su comportamiento por defecto de recargar la página
    e.preventDefault();

    // Redirigimos al usuario a la página de registro de estudiantes
    navigate("/student-register");
  }

  return (
    <div className="flex items-center justify-center flex-1 py-12 px-4 ">
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-blue_primary md:text-2xl">
            Ingresa a tu cuenta
          </h1>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-blue_primary"
              >
                Tu correo
              </label>
              <input
                type="email"
                id="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-blue_primary"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="••••••••"
                className="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            {/* Login Estudiante */}
            <div className="text-sm font-medium text-gray-500">
              ¿Eres estudiante?{" "}
              <a
                href="/student-register"
                className="text-blue-600 hover:underline"
                onClick={handleGoToRegister}
              >
                Registrarse aquí  
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
