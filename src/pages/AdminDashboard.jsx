import { useAuth } from "../context/AuthContext";
import NavDashboard from "../components/NavDashboard";
import AsideDashboard from "../components/Dashboard/AsideDashBoard";
import { Navigate, Route, Routes } from "react-router-dom";
import DiplomasViewDashboard from "./DiplomasViewDashboard";
import StudentsViewDashboard from "./StudentsViewDashBoard";
import InstitutionsViewDashboard from "./InstitutionsViewDashboard";
import GraduadosViewDashboard from "./GraduadosViewDashboard";
import SolicitudesDocumentoDashboard from "./SolicitudesDocumentoDashboard";
import SolicitudesEdicionDashboard from "./SolicitudesEdicionDashboard";
import PrincipalDashboard from "../components/Dashboard/principal";


const AdminDashboard = () => {
  const { authUser } = useAuth();
 
  if (!authUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <NavDashboard />
        <AsideDashboard />
        <main className="md:ml-64 h-auto pt-20">
          <div className="grid grid-cols-1 mb-4">
            <Routes>
              <Route index element={<PrincipalDashboard />} />
              <Route path="institutions" element={<InstitutionsViewDashboard />} />
              <Route path="my-institution" element={<InstitutionsViewDashboard />} />
              <Route path="diplomas" element={<DiplomasViewDashboard />} />
              <Route path="graduados" element={<GraduadosViewDashboard />} />
              <Route path="solicitudes-documento" element={<SolicitudesDocumentoDashboard />} />
              <Route path="solicitudes-edicion" element={<SolicitudesEdicionDashboard />} />
              <Route path="students" element={<StudentsViewDashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
