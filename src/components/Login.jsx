import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const { setIsLoggedIn,setAuthUser } = useAuth();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errores, setErrores] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {

    setLoading(true)
    e.preventDefault();

    const datosFormulario = {
      correo,
      contraseña,
    };

    try {
      const respuesta = await fetch("http://localhost:4000/api/auth", {
        method: "POST",
        body: JSON.stringify(datosFormulario),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await respuesta.json();

      
      if (data.error) {
        setErrores(data.errors);
      } else {
        /* localStorage.setItem('TOKEN', data?.usuario?.tokens?.token) */

        localStorage.setItem('REFRESH_TOKENS', data?.usuario?.tokens?.refreshToken)
        console.log("oken: ", data?.usuario?.tokens?.token)
        console.log("refreshToken: ", data?.usuario?.tokens?.refreshToken)

        localStorage.setItem('USER', JSON.stringify(data?.usuario))
        setUsuario(data.usuario);
        setAuthUser({ ...data.usuario, accessToken: data?.usuario?.tokens?.token });
        setIsLoggedIn(true)
      }

      setLoading(false)

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <>
        <section class="bg-gray_primary h-screen">
          <div class="flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-center text-xl font-bold leading-tight tracking-tight text-blue_dark md:text-2xl ">
                  Ingresa a tu cuenta
                </h1>
                <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-blue_dark "
                    >
                      Tu correo
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      class="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      placeholder="name@company.com"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="password"
                      class="block mb-2 text-sm font-medium text-blue_dark "
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                      placeholder="••••••••"
                      class="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      required=""
                    />
                  </div>
                  <button
                    type="submit"
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Iniciar Sesion
                  </button>
                </form>
                {
                errores.length > 0 && (
                  <div className="alert alert-danger">
                    `${errores.join(", ")}`
                  </div>
                )}
              </div>
            </div>
          </div>
          {usuario && navigate("/admin-dashboard")}
        </section>
      </>

    </>
  );
}

export default Login;
