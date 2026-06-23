import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Functiegroepen from "./pages/Functiegroepen";
import Functiegroep from "./pages/Functiegroep";
import Medewerkers from "./pages/Medewerkers";
import MijnProfiel from "./pages/MijnProfiel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute toegestaneRollen={["hr"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/functiegroepen"
        element={
          <ProtectedRoute toegestaneRollen={["hr"]}>
            <Functiegroepen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/functiegroepen/:id"
        element={
          <ProtectedRoute toegestaneRollen={["hr"]}>
            <Functiegroep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medewerkers"
        element={
          <ProtectedRoute toegestaneRollen={["hr"]}>
            <Medewerkers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mijn-profiel"
        element={
          <ProtectedRoute toegestaneRollen={["medewerker"]}>
            <MijnProfiel />
          </ProtectedRoute>
        }
      />

      <Route path="/functiegroep" element={<Navigate to="/functiegroepen/1" replace />} />
    </Routes>
  );
}
