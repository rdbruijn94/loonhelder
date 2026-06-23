import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, toegestaneRollen }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (toegestaneRollen && !toegestaneRollen.includes(user.rol)) {
    return (
      <Navigate
        to={user.rol === "hr" ? "/dashboard" : "/mijn-profiel"}
        replace
      />
    );
  }

  return children;
}
