import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import Logo from '../assets/logo1.webp'
import { useAuth } from '../context/AuthContext';



function Navbar() {
  const { authUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    const onScroll = () => {
      setHasScrolled(window.scrollY > 8);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await logout(); // llama al backend y limpia localStorage
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`sticky top-0 max-w-screen z-40 transition-all duration-300 ${hasScrolled ? 'bg-blue_primary/95 backdrop-blur-md shadow-evot-card' : 'bg-blue_primary'}`}
      >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to={"/"} className="flex gap-2 items-center w-auto overflow-hidden justify-center text-white_primary hover:underline" onClick={() => setIsMenuOpen(false)}>
            <img className="object-contain justify-center h-8 w-8" src={Logo} alt="Logo de Evot Project" />
            <span className="self-center text-2xl font-display font-semibold whitespace-nowrap tracking-tight dark:text-[#252525]">
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
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 px-2 bg-white_primary rounded-lg text-l text-blue_dark font-semibold transition delay-75 duration-300 ease-in-out hover:scale-105"
                  >
                    Login
                  </Link>
                )
            }
            {
              (authUser?.rol === 'ADMIN' || authUser?.rol === 'INSTITUCION') && (
                <Link
                  to={`/admin-dashboard`}
                  onClick={() => setIsMenuOpen(false)}
                  className="ml-4 py-2 px-2 bg-white_primary rounded-lg text-l text-blue_dark font-semibold transition delay-75 duration-300 ease-in-out hover:scale-105"
                >
                  Dashboard
                </Link>
              )
            }

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-100 rounded-lg md:hidden hover:bg-blue_dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white_primary"
              aria-controls="navbar-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menu principal' : 'Abrir menu principal'}
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
        <div
          id="navbar-menu"
          className={`backdrop-blur-sm bg-gray_primary/95 relative z-50 border-t border-slate-300/60 ${isMenuOpen ? 'block' : 'hidden'} md:block`}
        >
          <div className="max-w-screen-xl px-4 py-3 mx-auto place-items-center md:flex md:justify-between">
            <div className="flex items-center">
              <ul className="flex flex-col md:flex-row font-medium mt-0 mr-6 gap-3 md:space-x-8 text-sm">
                <li>
                  <Link
                    to={"/home"}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-black_primary hover:underline"
                    aria-current="page"
                  >
                    Principal
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/search/diploma"}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-black_primary hover:underline"
                    aria-current="page"
                  >
                    Buscar titulos
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/about`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-black_primary hover:underline"
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
                    onClick={() => setIsMenuOpen(false)}
                    className="text-black_primary hover:underline"
                  >
                    Nuestros Socios
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
