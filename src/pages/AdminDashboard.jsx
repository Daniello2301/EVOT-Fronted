import { useAuth } from "../context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import DiplomasViewDashboard from "./DiplomasViewDashboard";
import StudentsViewDashboard from "./StudentsViewDashBoard";
import InstitucionesAdmin from "./InstitucionesAdmin";
import MiInstitucion from "./MiInstitucion";
import GraduadosViewDashboard from "./GraduadosViewDashboard";
import SolicitudesDocumentoDashboard from "./SolicitudesDocumentoDashboard";
import SolicitudesEdicionDashboard from "./SolicitudesEdicionDashboard";
import PrincipalDashboard from "../components/Dashboard/principal";
import { canAccessSection, dashboardPath, needsInstitucionOnboarding, sectionByKey } from "../helpers/dashboardNav.js";

const ONBOARDING_PATH = dashboardPath(sectionByKey("mi-institucion").path);

const SECTION_ELEMENTS = {
  diplomas: DiplomasViewDashboard,
  graduados: GraduadosViewDashboard,
  "solicitudes-documento": SolicitudesDocumentoDashboard,
  "solicitudes-edicion": SolicitudesEdicionDashboard,
  instituciones: InstitucionesAdmin,
  usuarios: StudentsViewDashboard,
  "mi-institucion": MiInstitucion
};

/** Abre la sección solo si el rol la tiene; si no, vuelve al inicio del panel. */
function Guarded({ sectionKey, element: Element }) {
  const { authUser } = useAuth();
  if (!canAccessSection(sectionByKey(sectionKey), authUser?.rol)) {
    return <Navigate to={dashboardPath()} replace />;
  }
  if (sectionKey !== "mi-institucion" && needsInstitucionOnboarding(authUser)) {
    return <Navigate to={ONBOARDING_PATH} replace />;
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
      <Route index element={needsInstitucionOnboarding(authUser) ? <Navigate to={ONBOARDING_PATH} replace /> : <PrincipalDashboard />} />
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
