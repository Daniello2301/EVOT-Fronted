import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ============================================================
// Sección Hero
// ============================================================
const Hero = () => (
  <section className="bg-white_primary pt-36 pb-16">
    <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">

      <div className="mr-auto place-self-center lg:col-span-7">
        <span className="bg-blue-100 text-blue_dark text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">
          Verificación de títulos académicos
        </span>
        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-blue_dark">
          Valida tus títulos académicos
        </h1>
        <p className="max-w-2xl mb-8 font-light text-gray-500 md:text-lg lg:text-xl">
          Utiliza tu documento de identificación para explorar de manera sencilla
          todos los cursos, diplomas y programas que has completado en colaboración
          con nuestras instituciones socias.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/search/diploma"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white rounded-lg bg-blue_dark hover:bg-blue_primary transition-colors duration-200 focus:ring-4 focus:ring-blue-300"
          >
            Buscar Diplomas
            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            to="/partners"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-blue_dark border border-blue_dark rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:ring-4 focus:ring-gray-100"
          >
            Ver instituciones socias
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
        <img
          className="w-3/4 h-full object-contain rounded-xl"
          src="https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          alt="Verificación de diplomas"
        />
      </div>

    </div>
  </section>
);

// ============================================================
// Sección Cómo funciona
// ============================================================
const steps = [
  {
    number: '01',
    title: 'Ingresa tu documento',
    description: 'Escribe tu número de identificación en el buscador de títulos.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
      </svg>
    )
  },
  {
    number: '02',
    title: 'Consulta tus títulos',
    description: 'Visualiza todos los diplomas y certificados emitidos a tu nombre por instituciones socias.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    number: '03',
    title: 'Solicita tu documento',
    description: 'Pide el documento físico de tu diploma y recíbelo directamente en tu correo.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

const HowItWorks = () => (
  <section className="bg-gray_primary py-16">
    <div className="max-w-screen-xl px-4 mx-auto">

      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-blue_dark mb-4">
          ¿Cómo funciona?
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          En tres simples pasos puedes verificar y obtener tus títulos académicos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-white_primary rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-extrabold text-gray_primary">
                {step.number}
              </span>
              <div className="p-2 bg-blue-100 rounded-lg text-blue_dark">
                {step.icon}
              </div>
            </div>
            <h3 className="text-lg font-bold text-blue_dark mb-2">
              {step.title}
            </h3>
            <p className="text-gray-500 text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  </section>
);

// ============================================================
// Sección CTA
// ============================================================
const CTA = () => (
  <section className="bg-blue_dark py-16">
    <div className="max-w-screen-xl px-4 mx-auto text-center">
      <h2 className="text-3xl font-extrabold text-white_primary mb-4">
        ¿Listo para verificar tus títulos?
      </h2>
      <p className="text-blue-200 mb-8 max-w-xl mx-auto">
        Accede de forma rápida y segura a todos tus certificados y diplomas académicos.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/search/diploma"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-blue_dark bg-white_primary rounded-lg hover:bg-gray_primary transition-colors duration-200 focus:ring-4 focus:ring-blue-300"
        >
          Buscar mis títulos
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white_primary border border-white_primary rounded-lg hover:bg-blue_primary transition-colors duration-200"
        >
          Conocer más
        </Link>
      </div>
    </div>
  </section>
);

// ============================================================
// Home
// ============================================================
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}