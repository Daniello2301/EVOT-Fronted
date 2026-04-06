import { Link } from 'react-router-dom'

import Logo from '../assets/logo1.png'
import { useAuth } from '../context/AuthContext';



function Navbar() {
  const { authUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // llama al backend y limpia localStorage
  };

  return (
    <>
      <nav className="bg-blue_primary max-w-screen z-10">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to={"/"} className="flex gap-2 items-center w-auto overflow-hidden justify-center text-white_primary hover:underline">
            <img className="object-contain justify-center h-8 w-8" src={Logo} alt="" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap tracking-tight dark:text-[#252525">
              Evot Project
            </span>
          </Link>

          <div className="flex items-center">

            {
              authUser ?
                (
                  <>
                  <div className="flex items-center justify-start">
                      <p className="text-white_primary text-l font-semibold px-2 text-center">
                        Hola, {authUser.nombreUsuario}
                      </p>
                      <button
                        onClick={handleLogout}
                        title="Cerrar sesión"
                        className="p-2 block text-sm rounded-md text-white_primary hover:bg-gray-100 hover:text-blue_primary hover:rounded-md transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
                          <path d="M15 12h-12l3 -3" />
                          <path d="M6 15l-3 -3" />
                        </svg>
                      </button>
                  </div>
                  </>
                )
                :

                (
                  <Link
                    to={`/login`}
                    className="py-2 px-2 bg-white_primary rounded-lg text-l text-blue_dark font-semibold transition delay-75 duration-300 ease-in-out hover:scale-105"
                  >
                    Login
                  </Link>
                )
            }

            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        </div>
        <nav className="backdrop-blur-sm bg-gray_primary relative z-50 h-12">
          <div className="max-w-screen-xl px-4 py-3 mx-auto place-items-center md:flex md:justify-between">
            <div className="flex items-center">
              <ul className="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm">
                <li>
                  <Link
                    to={"/home"}
                    className="text-black_primary dark:text-[#252525 hover:underline"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/search/diploma"}
                    className="text-black_primary dark:text-[#252525 hover:underline"
                    aria-current="page"
                  >
                    Buscar titulos
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/about`}
                    className="text-black_primary dark:text-[#252525 hover:underline"
                  >
                    Acerca de
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to={`/team`}
                    className="text-black_primary dark:text-[#252525 hover:underline"
                  >
                    Nuestro Equipo
                  </Link>
                </li> */}
                <li>
                  <Link
                    to={`/partners`}
                    className="text-black_primary dark:text-[#252525 hover:underline"
                  >
                    Nuestros Socios
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </>
  );
}

export default Navbar;
