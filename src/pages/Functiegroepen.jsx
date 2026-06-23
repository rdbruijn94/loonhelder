import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { functiegroepen, organisatie } from "../data/mockdata";

export default function Functiegroepen() {
  return (
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        <h1 className="text-xl font-bold text-navy md:text-2xl">Functiegroepen</h1>
        <p className="mt-1 text-sm text-navy/60 md:text-base">{organisatie.naam}</p>

        <div className="mt-6 space-y-3 md:mt-8 md:space-y-4">
          {functiegroepen.map((groep) => (
            <Link
              key={groep.id}
              to={`/functiegroepen/${groep.id}`}
              className="kaart block w-full p-4 transition-shadow hover:shadow-md md:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-navy md:text-lg">{groep.naam}</h2>
                  <p className="mt-1 text-sm text-navy/50">
                    {organisatie.medewerkers} medewerkers · Schaal {groep.schaal}
                  </p>
                </div>
                <span className="shrink-0 text-2xl text-navy/30" aria-hidden="true">
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
