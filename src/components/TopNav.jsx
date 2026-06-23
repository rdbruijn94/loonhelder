import { Link, useLocation } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

const hrNavItems = [
  { pad: "/dashboard", label: "Dashboard" },
  { pad: "/functiegroepen", label: "Functiegroepen", prefix: true },
  { pad: "/onboarding", label: "Scan" },
];

const medewerkerNavItems = [{ pad: "/mijn-profiel", label: "Mijn profiel" }];

export default function TopNav() {
  const location = useLocation();
  const user = getUser();
  const isPubliekeScan =
    location.pathname.startsWith("/onboarding") ||
    location.pathname === "/resultaten";

  if (!user && !isPubliekeScan) return null;

  const navItems = user?.rol === "hr" ? hrNavItems : medewerkerNavItems;
  const homePad = user?.rol === "hr" ? "/dashboard" : user ? "/mijn-profiel" : "/login";

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

        {user && (
          <>
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
          </>
        )}

        {!user && isPubliekeScan && (
          <Link
            to="/login"
            className="text-sm font-medium text-white/70 hover:text-white"
          >
            Inloggen
          </Link>
        )}
      </div>
    </header>
  );
}
