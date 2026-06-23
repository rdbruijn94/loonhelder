import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Functiegroepen from "./pages/Functiegroepen";
import Functiegroep from "./pages/Functiegroep";
import MijnProfiel from "./pages/MijnProfiel";
import Medewerkers from "./pages/Medewerkers";
import MedewerkerDetail from "./pages/MedewerkerDetail";
import Onboarding from "./pages/Onboarding";
import Resultaten from "./pages/Resultaten";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/functiegroepen" element={<Functiegroepen />} />
      <Route path="/functiegroepen/:id" element={<Functiegroep />} />
      <Route path="/mijn-profiel" element={<MijnProfiel />} />
      <Route path="/medewerkers" element={<Medewerkers />} />
      <Route path="/medewerkers/:id" element={<MedewerkerDetail />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/resultaten" element={<Resultaten />} />
      <Route path="/functiegroep" element={<Navigate to="/functiegroepen/1" replace />} />
    </Routes>
  );
}
