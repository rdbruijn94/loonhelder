import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "loonhelder_user";

const AuthContext = createContext(null);

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    if (user?.email && user?.rol && user?.naam) return user;
    return null;
  } catch {
    return null;
  }
}

function resolveRol(account) {
  const email = account.email?.trim().toLowerCase();
  if (email === "hr@demo.nl") return "hr";
  if (email === "medewerker@demo.nl") return "medewerker";
  return account.rol;
}

export function getHomeRoute(rol) {
  return rol === "hr" ? "/dashboard" : "/mijn-profiel";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  function login(account) {
    const rol = resolveRol(account);
    const sessionUser = {
      email: account.email.trim().toLowerCase(),
      rol,
      naam: `${account.voornaam} ${account.achternaam}`,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);

    console.log("[LoonHelder] Sessie opgeslagen:", sessionUser);
    console.log("[LoonHelder] Rol na inloggen:", sessionUser.rol);

    return sessionUser;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth moet binnen AuthProvider worden gebruikt");
  }
  return context;
}
