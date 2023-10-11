import { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Home() {


  const { authUser } = useAuth()

  console.log(authUser);

  useEffect(() => {
    if(authUser == null){
      localStorage.clear()
    }
  })

  return (
    <>
      <Navbar />
      <section className="bg-white_primary h-screen">
        <div className="grid justify-center h-full max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-blue_dark dark:text-blue_dark">
              Valida tus titulos
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Utiliza tu documento de identificación para explorar de manera sencilla todos los cursos, diplomas y programas que has completado en colaboración con nuestros socios
            </p>
            <a
              href="/search/diploma"
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue_dark hover:bg-blue_primary transition delay-75 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-900"
            >
              Buscar Diplomas
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-blue_dark border border-blue_dark rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-blue_dark "
            >
                Volverme Socio
            </a>
          </div>
          <div className="grid items-center justify-center lg:m t-0 lg:col-span-5 lg:flex w-full h-full text-center ">
            <img
            className="w-3/4 h-full object-contain"
              src="https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="mockup"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
