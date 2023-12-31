import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Diplomas from "./pages/Diplomas";
import About from "./pages/About";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import { InsitutionsProvider } from "./context/InstitutionsContext";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search/diploma" element={<Diplomas />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <InsitutionsProvider>
        <Routes>
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </InsitutionsProvider>

    </>
  );
}

export default App;
