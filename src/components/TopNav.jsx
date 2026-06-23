import { NavLink } from "react-router-dom";

const navItems = [
  { pad: "/dashboard", label: "Dashboard" },
  { pad: "/functiegroep", label: "Functiegroep" },
  { pad: "/mijn-profiel", label: "Mijn profiel" },
];

export default function TopNav() {
  return (
    <header className="bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/dashboard" className="text-xl font-bold tracking-tight">
          Loon<span className="text-amber">Helder</span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {navItems.map(({ pad, label }) => (
            <NavLink
              key={pad}
              to={pad}
              className={({ isActive }) =>
                `rounded px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber text-navy"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
