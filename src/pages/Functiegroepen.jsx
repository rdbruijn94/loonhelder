import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { functiegroepen } from "../data/mockdata";

export default function Functiegroepen() {
  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Functiegroepen</h1>
        <p className="mt-1 text-navy/60">
          Overzicht van alle functiegroepen binnen uw organisatie
        </p>

        <div className="mt-8 space-y-4">
          {functiegroepen.map((groep) => {
            const totaalMedewerkers = groep.niveaus.reduce(
              (sum, n) => sum + n.man.aantal + n.vrouw.aantal,
              0
            );

            return (
              <Link
                key={groep.id}
                to={`/functiegroepen/${groep.id}`}
                className="block rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-navy">{groep.naam}</h2>
                    <p className="mt-1 text-sm text-navy/50">
                      {totaalMedewerkers} medewerkers · {groep.niveaus.length} niveaus
                    </p>
                  </div>
                  <span className="text-sm font-medium text-amber">Bekijk details</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {groep.niveaus.map((niveau) => (
                    <div key={niveau.id} className="rounded bg-achtergrond px-4 py-3">
                      <p className="text-sm font-medium text-navy">{niveau.naam}</p>
                      <p className="mt-0.5 text-xs text-navy/50">
                        {niveau.man.aantal + niveau.vrouw.aantal} medewerkers
                      </p>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
