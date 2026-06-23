import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { compliance, functiegroepen, organisatie } from "../data/mockdata";

function StatCard({ label, waarde, achtergrond = "wit" }) {
  const achtergrondClasses = {
    wit: "bg-white text-navy",
    oranje: "bg-amber/20 text-navy",
    rood: "bg-red-100 text-red-700",
  };

  return (
    <div className={`rounded-lg p-6 shadow-sm ${achtergrondClasses[achtergrond]}`}>
      <p className="text-sm font-medium text-navy/60">{label}</p>
      <p className="mt-1 text-2xl font-bold">{waarde}</p>
    </div>
  );
}

export default function Dashboard() {
  const groep = functiegroepen[0];

  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Compliance-overzicht</h1>
        <p className="mt-1 text-navy/60">
          {organisatie.naam} · status loontransparantie en loonkloof
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Totaal medewerkers"
            waarde={compliance.totaalMedewerkers}
          />
          <StatCard
            label="Gemiddeld salaris"
            waarde={formatter.format(compliance.gemiddeldSalaris)}
          />
          <StatCard
            label="Loonkloof"
            waarde={`${compliance.loonkloof}%`}
            achtergrond="oranje"
          />
          <StatCard
            label="Compliance-score"
            waarde={`${compliance.complianceScore}%`}
            achtergrond="rood"
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
                  {organisatie.totaalMedewerkers} medewerkers
                </p>
              </div>
              <span className="text-sm font-medium text-amber">Bekijk details</span>
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
