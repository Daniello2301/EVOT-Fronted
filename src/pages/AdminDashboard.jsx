import { useAuth } from "../context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import DiplomasViewDashboard from "./DiplomasViewDashboard";
import StudentsViewDashboard from "./StudentsViewDashBoard";
import InstitutionsViewDashboard from "./InstitutionsViewDashboard";
import GraduadosViewDashboard from "./GraduadosViewDashboard";
import SolicitudesDocumentoDashboard from "./SolicitudesDocumentoDashboard";
import SolicitudesEdicionDashboard from "./SolicitudesEdicionDashboard";
import PrincipalDashboard from "../components/Dashboard/principal";
import { canAccessSection, dashboardPath, sectionByKey } from "../helpers/dashboardNav.js";

const SECTION_ELEMENTS = {
  diplomas: DiplomasViewDashboard,
  graduados: GraduadosViewDashboard,
  "solicitudes-documento": SolicitudesDocumentoDashboard,
  "solicitudes-edicion": SolicitudesEdicionDashboard,
  instituciones: InstitutionsViewDashboard,
  usuarios: StudentsViewDashboard,
  "mi-institucion": InstitutionsViewDashboard
};

/** Abre la sección solo si el rol la tiene; si no, vuelve al inicio del panel. */
function Guarded({ sectionKey, element: Element }) {
  const { authUser } = useAuth();
  if (!canAccessSection(sectionByKey(sectionKey), authUser?.rol)) {
    return <Navigate to={dashboardPath()} replace />;
  }
  return <Element />;
}

const AdminDashboard = () => {
  const { authUser } = useAuth();

  if (!authUser) {
    return <Navigate to="/home" replace />;
  }

  // DashboardLayout ya renderiza la navegación y la barra lateral.
  return (
    <Routes>
      <Route index element={<PrincipalDashboard />} />
      {Object.entries(SECTION_ELEMENTS).map(([key, Element]) => (
        <Route key={key} path={`${sectionByKey(key).path}/*`} element={<Guarded sectionKey={key} element={Element} />} />
      ))}
      {/* Ruta anterior de "Estudiantes", hoy "Usuarios". */}
      <Route path="students" element={<Navigate to={dashboardPath("users")} replace />} />
      <Route path="*" element={<Navigate to={dashboardPath()} replace />} />
    </Routes>
  );
};

export default AdminDashboard;
