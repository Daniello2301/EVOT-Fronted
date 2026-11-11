import { useAuth } from "../context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import DiplomasViewDashboard from "./DiplomasViewDashboard";
import StudentsViewDashboard from "./StudentsViewDashBoard";
import InstitutionsViewDashboard from "./InstitutionsViewDashboard";
import PrincipalDashboard from "../components/Dashboard/principal";


const AdminDashboard = () => {
  const { authUser } = useAuth();
 
  if (!authUser) {
    return <Navigate to="/home" replace />;
  }

  // DashboardLayout already renders the shared navigation and sidebar.
  return (
    <Routes>
      <Route index element={<PrincipalDashboard />} />
      <Route path="institutions" element={<InstitutionsViewDashboard />} />
      <Route path="my-institution" element={<InstitutionsViewDashboard />} />
      <Route path="diplomas" element={<DiplomasViewDashboard />} />
      <Route path="students" element={<StudentsViewDashboard />} />
    </Routes>
  );
};

export default AdminDashboard;
