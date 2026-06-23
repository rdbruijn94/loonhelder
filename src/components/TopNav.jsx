import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getHomeRoute, useAuth } from "../context/AuthContext";

const hrNavItems = [
  { pad: "/dashboard", label: "Dashboard" },
  { pad: "/functiegroepen", label: "Functiegroepen", prefix: true },
  { pad: "/medewerkers", label: "Medewerkers" },
];

const medewerkerNavItems = [{ pad: "/mijn-profiel", label: "Mijn profiel" }];

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const navItems = user.rol === "hr" ? hrNavItems : medewerkerNavItems;
  const homePad = getHomeRoute(user.rol);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(item) {
    if (item.prefix) {
      return location.pathname.startsWith(item.pad);
    }
    return location.pathname === item.pad;
  }

  return (
    <header className="bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to={homePad} className="text-xl font-bold tracking-tight">
          Loon<span className="text-amber">Helder</span>
        </NavLink>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {navItems.map(({ pad, label, prefix }) => (
              <NavLink
                key={pad}
                to={pad}
                end={!prefix}
                className={() =>
                  `rounded px-4 py-2 text-sm font-medium transition-colors ${
                    isActive({ pad, prefix })
                      ? "bg-amber text-navy"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 border-l border-white/20 pl-4">
            <span className="hidden text-sm text-white/60 sm:inline">{user.naam}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
