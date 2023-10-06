import { redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  console.log(isLoggedIn)

  const loggIn = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    console.log(isLoggedIn)
    try {
      redirect("/admin-dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  1;
  return (
    <>
      <section class="bg-gray_primary h-screen">
        <div class="flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-center text-xl font-bold leading-tight tracking-tight text-blue_dark md:text-2xl ">
                Ingresa a tu cuenta
              </h1>
              <form class="space-y-4 md:space-y-6">
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
                    placeholder="••••••••"
                    class="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required=""
                  />
                </div>
                <button
                  onClick={(e) => loggIn(e)}
                  type="submit"
                  class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Iniciar Sesion
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
