import { Navigate } from "react-router-dom";
import { getHomeRoute, getStoredUser, useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, toegestaneRollen }) {
  const { user: contextUser } = useAuth();
  const user = getStoredUser() ?? contextUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (toegestaneRollen && !toegestaneRollen.includes(user.rol)) {
    return <Navigate to={getHomeRoute(user.rol)} replace />;
  }

  return children;
}
