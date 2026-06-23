import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "loonhelder_user";

const AuthContext = createContext(null);

function loadUser() {
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  function login(account) {
    const sessionUser = {
      email: account.email,
      rol: account.rol,
      naam: `${account.voornaam} ${account.achternaam}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
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
