import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { compliance, functiegroepen } from "../data/mockdata";

function StatCard({ label, waarde, kleur }) {
  const kleurClasses = {
    navy: "text-navy",
    oranje: "text-amber",
    rood: "text-red-600",
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-navy/60">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${kleurClasses[kleur] ?? "text-navy"}`}>
        {waarde}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const groep = functiegroepen[0];
  const totaalNiveau = groep.niveaus.reduce(
    (sum, n) => sum + n.man.aantal + n.vrouw.aantal,
    0
  );

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Compliance-overzicht</h1>
        <p className="mt-1 text-navy/60">
          Status loontransparantie en loonkloof binnen uw organisatie
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Totaal medewerkers"
            waarde={compliance.totaalMedewerkers}
            kleur="navy"
          />
          <StatCard
            label="Gemiddelde loonkloof"
            waarde={`${compliance.gemiddeldeLoonkloof}%`}
            kleur="oranje"
          />
          <StatCard
            label="Aantal functiegroepen"
            waarde={compliance.aantalFunctiegroepen}
            kleur="navy"
          />
          <StatCard
            label="Compliance-score"
            waarde={`${compliance.complianceScore}%`}
            kleur="rood"
          />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-navy">Functiegroepen</h2>
          <p className="mt-1 text-sm text-navy/60">
            Klik op een functiegroep voor het detailoverzicht
          </p>

          <Link
            to="/functiegroepen/1"
            className="mt-4 block rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy">{groep.naam}</h3>
                <p className="mt-1 text-sm text-navy/50">
                  {totaalNiveau} medewerkers · {groep.niveaus.length} niveaus
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
        </section>

        <p className="mt-6 text-xs text-navy/40">
          Laatste update:{" "}
          {new Date(compliance.laatsteUpdate).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </main>
    </div>
  );
}
