import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const isPubliekeScan =
    location.pathname.startsWith("/onboarding") ||
    location.pathname === "/resultaten";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (!user && !isPubliekeScan) return null;

  const navItems = user?.rol === "hr" ? hrNavItems : medewerkerNavItems;
  const homePad = user?.rol === "hr" ? "/dashboard" : user ? "/mijn-profiel" : "/login";

  function isActive(item) {
    if (item.prefix) {
      return location.pathname.startsWith(item.pad);
    }
    return location.pathname === item.pad;
  }

  function handleLogout() {
    setMenuOpen(false);
    logout();
  }

  return (
    <header className="bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link to={homePad} className="text-lg font-bold tracking-tight md:text-xl">
          Loon<span className="text-amber">Helder</span>
        </Link>

        {user && (
          <>
            <nav className="hidden items-center gap-6 md:flex">
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

            <div className="hidden items-center gap-4 md:flex">
              <span className="text-sm text-white/60">{user.naam}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-11 rounded px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Uitloggen
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="Menu openen"
            >
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
            </button>
          </>
        )}

        {!user && isPubliekeScan && (
          <Link
            to="/login"
            className="min-h-11 rounded px-3 py-2 text-sm font-medium text-white/70 hover:text-white"
          >
            Inloggen
          </Link>
        )}
      </div>

      {user && menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-navy/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-white shadow-lg animate-[slideDown_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-navy/10 px-4 py-4">
              <span className="text-lg font-bold text-navy">
                Loon<span className="text-amber">Helder</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center text-2xl text-navy"
                aria-label="Menu sluiten"
              >
                ×
              </button>
            </div>

            <nav className="px-4 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.pad}
                  to={item.pad}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-12 items-center border-b border-navy/10 text-base font-medium ${
                    isActive(item) ? "text-amber" : "text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-navy/10 px-4 py-6">
              <p className="text-sm text-navy/60">{user.naam}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 min-h-11 w-full rounded bg-navy px-4 py-3 text-sm font-medium text-white"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
