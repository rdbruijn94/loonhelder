import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { functiegroepen, organisatie } from "../data/mockdata";

export default function Functiegroepen() {
  return (
    <div className="pagina">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Functiegroepen</h1>
        <p className="mt-1 text-navy/60">{organisatie.naam}</p>

        <div className="mt-8 space-y-4">
          {functiegroepen.map((groep) => (
            <Link
              key={groep.id}
              to={`/functiegroepen/${groep.id}`}
              className="kaart block p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-navy">{groep.naam}</h2>
                  <p className="mt-1 text-sm text-navy/50">
                    {organisatie.medewerkers} medewerkers · Schaal {groep.schaal}
                  </p>
                </div>
                <span className="text-2xl text-navy/30" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
