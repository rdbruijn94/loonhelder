import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { functiegroepen, organisatie } from "../data/mockdata";

function StatCard({ label, waarde, variant = "default" }) {
  const variants = {
    default: "bg-white text-navy",
    oranje: "bg-[#FFF7ED] text-[#EA580C]",
    rood: "bg-[#FEF2F2] text-[#DC2626]",
  };

  return (
    <div className={`rounded-lg p-5 shadow-sm ${variants[variant]}`}>
      <p className={`text-sm font-medium ${variant === "default" ? "text-navy/60" : ""}`}>
        {label}
      </p>
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
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="mt-1 text-navy/60">{organisatie.naam}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Totaal medewerkers" waarde={organisatie.medewerkers} />
          <StatCard
            label="Gemiddeld salaris"
            waarde={formatter.format(organisatie.gemiddeldSalaris)}
          />
          <StatCard
            label="Loonkloof"
            waarde={`${organisatie.loonkloof.toLocaleString("nl-NL")}%`}
            variant="oranje"
          />
          <StatCard
            label="Compliance-score"
            waarde={`${organisatie.complianceScore}%`}
            variant="rood"
          />
          <StatCard label="Functiegroepen" waarde={1} />
        </div>

        <section className="mt-8">
          <Link
            to="/functiegroepen/1"
            className="block rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-navy">{groep.naam}</h2>
                <p className="mt-1 text-sm text-navy/60">
                  {organisatie.medewerkers} medewerkers · Schaal {groep.schaal}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-medium text-[#EA580C]">
                    Loonkloof {organisatie.loonkloof.toLocaleString("nl-NL")}%
                  </span>
                  <span className="rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-medium text-[#DC2626]">
                    Compliance {organisatie.complianceScore}%
                  </span>
                </div>
              </div>
              <span className="text-2xl text-navy/30" aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
