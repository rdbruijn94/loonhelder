import { Link, useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { berekenRapport, getScanAntwoorden } from "../utils/scan";

const statusStyles = {
  rood: {
    badge: "bg-[#FEF2F2] text-[#DC2626]",
    label: "Directe aandacht",
  },
  oranje: {
    badge: "bg-[#FFF7ED] text-[#EA580C]",
    label: "Aandacht vereist",
  },
  groen: {
    badge: "bg-green-50 text-green-700",
    label: "Op orde",
  },
};

function ActieKnop({ item, className, onClick }) {
  if (item.status === "groen") return null;
  const label = item.status === "rood" ? item.actieRood : item.actieOranje;
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

export default function Resultaten() {
  const navigate = useNavigate();
  const antwoorden = getScanAntwoorden();
  const { onderdelen, telling } = berekenRapport(antwoorden);

  function handleActie(item) {
    if (item.id === "functiebeschrijvingen") {
      navigate("/functieprofiel-wizard");
    }
  }

  return (
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        <h1 className="text-xl font-bold text-navy md:text-2xl">Jouw compliance-rapport</h1>
        <p className="mt-1 text-sm text-navy/60 md:text-base">
          Op basis van jullie antwoorden hebben we de huidige situatie in kaart gebracht.
        </p>

        <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
          <div className="kaart p-4 md:p-6">
            <p className="text-sm font-medium text-[#DC2626]">Directe aandachtspunten</p>
            <p className="mt-1 text-2xl font-bold text-[#DC2626] md:text-3xl">{telling.rood}</p>
          </div>
          <div className="kaart p-4 md:p-6">
            <p className="text-sm font-medium text-[#EA580C]">Punten die aandacht verdienen</p>
            <p className="mt-1 text-2xl font-bold text-[#EA580C] md:text-3xl">{telling.oranje}</p>
          </div>
          <div className="kaart p-4 md:p-6">
            <p className="text-sm font-medium text-green-700">Al op orde</p>
            <p className="mt-1 text-2xl font-bold text-green-700 md:text-3xl">{telling.groen}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          {onderdelen.map((item) => (
            <div key={item.id} className="kaart p-4">
              <p className="font-medium text-navy">{item.naam}</p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[item.status].badge}`}
              >
                {statusStyles[item.status].label}
              </span>
              <div className="mt-3">
                <ActieKnop
                  item={item}
                  onClick={() => handleActie(item)}
                  className="min-h-11 w-full rounded bg-navy px-4 py-2 text-sm font-medium text-white"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="kaart mt-6 hidden overflow-hidden md:mt-8 md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy/10 bg-achtergrond">
              <tr>
                <th className="px-6 py-3 font-medium text-navy/60">Onderdeel</th>
                <th className="px-6 py-3 font-medium text-navy/60">Status</th>
                <th className="px-6 py-3 font-medium text-navy/60">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {onderdelen.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-navy">{item.naam}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[item.status].badge}`}
                    >
                      {statusStyles[item.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ActieKnop
                      item={item}
                      onClick={() => handleActie(item)}
                      className="min-h-11 rounded bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy/90"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-[10px] bg-navy p-6 text-white md:mt-8 md:p-8">
          <h2 className="text-lg font-semibold md:text-xl">
            Laat AI de ontbrekende documenten genereren
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Salarisschalen, functiebeschrijvingen en beloningsbeleid op maat. Klaar als
            startpunt, jij bepaalt de definitieve versie.
          </p>
          <button
            type="button"
            onClick={() => navigate("/functieprofiel-wizard")}
            className="mt-6 min-h-11 w-full rounded bg-amber px-6 py-3 text-sm font-semibold text-navy hover:bg-amber/90 md:w-auto md:py-2.5"
          >
            Bekijk wat AI kan genereren
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-navy/50">
          <Link to="/dashboard" className="inline-flex min-h-11 items-center text-amber hover:underline">
            Terug naar dashboard
          </Link>
        </p>
      </main>
    </div>
  );
}
