import { Link, useLocation } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

const hrNavItems = [
  { pad: "/dashboard", label: "Dashboard" },
  { pad: "/functiegroepen", label: "Functiegroepen", prefix: true },
];

const medewerkerNavItems = [{ pad: "/mijn-profiel", label: "Mijn profiel" }];

export default function TopNav() {
  const location = useLocation();
  const user = getUser();

  if (!user) return null;

  const navItems = user.rol === "hr" ? hrNavItems : medewerkerNavItems;
  const homePad = user.rol === "hr" ? "/dashboard" : "/mijn-profiel";

  function isActive(item) {
    if (item.prefix) {
      return location.pathname.startsWith(item.pad);
    }
    return location.pathname === item.pad;
  }

  return (
    <header className="bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to={homePad} className="text-xl font-bold tracking-tight">
          Loon<span className="text-amber">Helder</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.pad}
              to={item.pad}
              className={`pb-1 text-sm font-medium transition-colors ${
                isActive(item)
                  ? "border-b-2 border-amber text-white"
                  : "border-b-2 border-transparent text-white/70 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-white/60 sm:inline">{user.naam}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </header>
  );
}
