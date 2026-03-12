import { Routes, Route, Navigate } from "react-router-dom";
import 'goey-toast/styles.css'
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import BuscarTitulo from "./pages/Diplomas";
import About from "./pages/About";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import { InsitutionsProvider } from "./context/InstitutionsContext";
import { PrivateRoute, RoleRoute, PublicOnlyRoute } from "./routes/PrivateRoute";

function App() {

  return (
    <>
      <Routes>

      {/* ================= PUBLIC LAYOUT ================= */}

      <Route element={<PublicLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search/diploma" element={<BuscarTitulo />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/partners" element={<Partners />} />

        {/* Login solo si no está autenticado */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

      </Route>

      {/* ================= DASHBOARD ================= */}

      <Route element={<PrivateRoute />}>
        <Route element={<RoleRoute roles={['ADMIN','INSTITUCION']} />}>
          <Route element={<DashboardLayout />}>

            <Route
              path="/admin-dashboard/*"
              element={
                <InsitutionsProvider>
                  <AdminDashboard />
                </InsitutionsProvider>
              }
            />

          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/home" replace />} />

    </Routes>

    </>
  );
}

export default App;
