import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Functiegroep from "./pages/Functiegroep";
import MijnProfiel from "./pages/MijnProfiel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/functiegroep" element={<Functiegroep />} />
      <Route path="/mijn-profiel" element={<MijnProfiel />} />
    </Routes>
  );
}
