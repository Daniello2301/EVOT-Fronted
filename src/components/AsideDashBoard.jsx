import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function AsideDashboard() {
  const { authUser, isloggedIn } = useAuth();

  const user =  JSON.parse(localStorage.getItem('USER'))

  return (
    <>
      <aside
        class="fixed top-0 left-0 z-40 w-56 h-screen pt-14 transition-transform -translate-x-full bg-gray_primary border-r border-gray-200 md:translate-x-0 "
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div class="overflow-y-auto py-5 px-3 h-full bg-gray_primary ">
          <ul class="space-y-2 mt-10">
            <li>
              <Link
                to={"diplomas"}
                class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3">Diplomas</span>
              </Link>
            </li>
            {
              user.rol == 'ADMIN' &&
              <li>
                <Link
                  to={"institutions"}
                  class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    aria-hidden="true"
                    class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                  </svg>
                  <span class="flex-1 ml-3 whitespace-nowrap">Instituciones</span>
                </Link>
              </li>
            }
            <li>
              <Link
                to={"students"}
                class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Estudiantes</span>
              </Link>
            </li>
          </ul>
        </div>
        <div class="absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-gray_primary z-20 border-r ">
          <p class="z-10 py-2 text-sm font-medium text-blue_dark rounded-lg shadow-sm">
            {authUser ? authUser.correo : "email user"}
          </p>
        </div>
      </aside>
    </>
  );
}
