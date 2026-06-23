import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import TopNav from "../components/TopNav";
import {
  alleMedewerkers,
  gemCompetentieScore,
  getNiveauBand,
  organisatie,
} from "../data/mockdata";

const formatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const NIVEAU_FILTERS = ["Alle niveaus", "Junior", "Medior", "Senior"];

function niveauBadge(niveau) {
  if (niveau === "Junior") return "bg-man/15 text-man";
  if (niveau === "Medior") return "bg-vrouw/15 text-vrouw";
  return "bg-amber/20 text-amber";
}

function MiniBand({ salaris, niveau }) {
  const band = getNiveauBand(niveau);
  if (!band) return null;
  const pct = ((salaris - band.min) / (band.max - band.min)) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-achtergrond">
        <div className="h-full rounded-full bg-navy" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-navy/50">{Math.round(pct)}%</span>
    </div>
  );
}

export default function Medewerkers() {
  const navigate = useNavigate();
  const [zoek, setZoek] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("Alle niveaus");

  const gefilterd = useMemo(() => {
    return alleMedewerkers.filter((m) => {
      const matchZoek =
        m.naam.toLowerCase().includes(zoek.toLowerCase()) ||
        m.functie.toLowerCase().includes(zoek.toLowerCase());
      const matchNiveau =
        niveauFilter === "Alle niveaus" || m.niveau === niveauFilter;
      return matchZoek && matchNiveau;
    });
  }, [zoek, niveauFilter]);

  return (
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        <h1 className="text-xl font-bold text-navy md:text-2xl">Medewerkers</h1>
        <p className="mt-1 text-sm text-navy/60 md:text-base">
          {organisatie.naam} · {organisatie.medewerkers} medewerkers
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="search"
            placeholder="Zoek op naam of functie..."
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-navy/20 px-4 py-2 text-navy outline-none focus:border-amber focus:ring-1 focus:ring-amber"
          />

          <div className="flex flex-wrap gap-2">
            {NIVEAU_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setNiveauFilter(filter)}
                className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium ${
                  niveauFilter === filter
                    ? "bg-navy text-white"
                    : "bg-white text-navy ring-1 ring-navy/20 hover:bg-achtergrond"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="kaart mt-6 hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy/10 bg-achtergrond">
              <tr>
                <th className="px-4 py-3 font-medium text-navy/60">Naam</th>
                <th className="px-4 py-3 font-medium text-navy/60">Niveau</th>
                <th className="px-4 py-3 font-medium text-navy/60">Geslacht</th>
                <th className="px-4 py-3 font-medium text-navy/60">Salaris</th>
                <th className="px-4 py-3 font-medium text-navy/60">Positie in band</th>
                <th className="px-4 py-3 font-medium text-navy/60">Score</th>
                <th className="px-4 py-3 font-medium text-navy/60">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {gefilterd.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => navigate(`/medewerkers/${m.id}`)}
                  className="cursor-pointer hover:bg-achtergrond/60"
                >
                  <td className="px-4 py-3 font-medium text-navy">{m.naam}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${niveauBadge(m.niveau)}`}>
                      {m.niveau}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${m.geslacht === "man" ? "text-man" : "text-vrouw"}`}>
                    {m.geslacht === "man" ? "Man" : "Vrouw"}
                  </td>
                  <td className="px-4 py-3">{formatter.format(m.salaris)}</td>
                  <td className="px-4 py-3">
                    <MiniBand salaris={m.salaris} niveau={m.niveau} />
                  </td>
                  <td className="px-4 py-3 font-medium">{gemCompetentieScore(m.competenties)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/medewerkers/${m.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex min-h-11 items-center rounded bg-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-navy/90"
                    >
                      Bekijk
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          {gefilterd.map((m) => (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/medewerkers/${m.id}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/medewerkers/${m.id}`)}
              className="kaart p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-navy">{m.naam}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${niveauBadge(m.niveau)}`}>
                    {m.niveau}
                  </span>
                </div>
                <p className="font-medium text-navy">{formatter.format(m.salaris)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-navy/60">
                <span className={m.geslacht === "man" ? "text-man" : "text-vrouw"}>
                  {m.geslacht === "man" ? "Man" : "Vrouw"}
                </span>
                <span>Score: {gemCompetentieScore(m.competenties)}</span>
              </div>
              <div className="mt-2">
                <MiniBand salaris={m.salaris} niveau={m.niveau} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
