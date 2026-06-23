import { Link } from "react-router-dom";
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

export default function Resultaten() {
  const antwoorden = getScanAntwoorden();
  const { onderdelen, telling } = berekenRapport(antwoorden);

  return (
    <div className="pagina">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Jouw compliance-rapport</h1>
        <p className="mt-1 text-navy/60">
          Op basis van jullie antwoorden hebben we de huidige situatie in kaart gebracht.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="kaart p-6">
            <p className="text-sm font-medium text-[#DC2626]">Directe aandachtspunten</p>
            <p className="mt-1 text-3xl font-bold text-[#DC2626]">{telling.rood}</p>
          </div>
          <div className="kaart p-6">
            <p className="text-sm font-medium text-[#EA580C]">Punten die aandacht verdienen</p>
            <p className="mt-1 text-3xl font-bold text-[#EA580C]">{telling.oranje}</p>
          </div>
          <div className="kaart p-6">
            <p className="text-sm font-medium text-green-700">Al op orde</p>
            <p className="mt-1 text-3xl font-bold text-green-700">{telling.groen}</p>
          </div>
        </div>

        <div className="kaart mt-8 overflow-hidden">
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
                    {item.status === "rood" && (
                      <button
                        type="button"
                        className="rounded bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy/90"
                      >
                        {item.actieRood}
                      </button>
                    )}
                    {item.status === "oranje" && (
                      <button
                        type="button"
                        className="rounded bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy/90"
                      >
                        {item.actieOranje}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-[10px] bg-navy p-8 text-white">
          <h2 className="text-xl font-semibold">
            Laat AI de ontbrekende documenten genereren
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Salarisschalen, functiebeschrijvingen en beloningsbeleid op maat. Klaar als
            startpunt, jij bepaalt de definitieve versie.
          </p>
          <button
            type="button"
            className="mt-6 rounded bg-amber px-6 py-2.5 text-sm font-semibold text-navy hover:bg-amber/90"
          >
            Bekijk wat AI kan genereren
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-navy/50">
          <Link to="/dashboard" className="text-amber hover:underline">
            Terug naar dashboard
          </Link>
        </p>
      </main>
    </div>
  );
}
