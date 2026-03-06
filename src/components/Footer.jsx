import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-gray_primary">
      <div className="p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center">
          © 2024 <Link to="/" className="hover:underline">Evot Project</Link>. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
          <li>
            <Link to="/about" className="ml-4 hover:underline md:mr-6">Acerca de</Link>
          </li>
          <li>
            <Link to="/partners" className="ml-4 hover:underline md:mr-6">Nuestros Socios</Link>
          </li>
          <li>
            <Link to="/team" className="ml-4 hover:underline md:mr-6">Nuestro Equipo</Link>
          </li>
          <li>
            <a href="mailto:contacto@evot.com" className="hover:underline">Contáctanos</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}