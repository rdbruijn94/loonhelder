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
    <div className={`kaart p-4 md:p-5 ${variants[variant]}`}>
      <p className={`text-xs font-medium md:text-sm ${variant === "default" ? "text-navy/60" : ""}`}>
        {label}
      </p>
      <p className="mt-1 text-xl font-bold md:text-2xl">{waarde}</p>
    </div>
  );
}

function ActieRij({ kleur, tekst, knopLabel, naar }) {
  const dotKleur = kleur === "rood" ? "bg-[#DC2626]" : "bg-[#EA580C]";

  return (
    <div className="flex flex-col gap-3 border-b border-navy/10 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotKleur}`} />
        <p className="text-sm text-navy">{tekst}</p>
      </div>
      <Link
        to={naar}
        className="min-h-11 shrink-0 rounded bg-navy px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-navy/90 sm:min-w-[120px]"
      >
        {knopLabel}
      </Link>
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
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        {organisatie.complianceScore < 70 && (
          <div className="kaart mb-6 flex flex-col gap-4 border-amber/30 bg-[#FFF7ED] p-4 md:mb-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-navy">
              Jullie compliance-score is {organisatie.complianceScore}%. Verbeter jullie
              score met de volwassenheidsscan.
            </p>
            <Link
              to="/onboarding"
              className="min-h-11 shrink-0 rounded bg-amber px-4 py-3 text-center text-sm font-semibold text-navy hover:bg-amber/90"
            >
              Start scan
            </Link>
          </div>
        )}

        <h1 className="text-xl font-bold text-navy md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-navy/60 md:text-base">{organisatie.naam}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-4 lg:grid-cols-5">
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

        <section className="mt-6 md:mt-8">
          <Link
            to="/functiegroepen/1"
            className="kaart block w-full p-4 transition-shadow hover:shadow-md md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-navy md:text-xl">{groep.naam}</h2>
                <p className="mt-1 text-sm text-navy/60">
                  {organisatie.medewerkers} medewerkers · Schaal {groep.schaal}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <span className="w-fit rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-medium text-[#EA580C]">
                    Loonkloof {organisatie.loonkloof.toLocaleString("nl-NL")}%
                  </span>
                  <span className="w-fit rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-medium text-[#DC2626]">
                    Compliance {organisatie.complianceScore}%
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-2xl text-navy/30" aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        </section>

        <section className="kaart mt-6 p-4 md:mt-8 md:p-6">
          <h2 className="text-base font-semibold text-navy md:text-lg">Vereiste acties</h2>
          <div className="mt-2">
            <ActieRij
              kleur="rood"
              tekst="Senior loonkloof 14,2% vereist schriftelijke onderbouwing"
              knopLabel="Genereer nu"
              naar="/functiegroepen/1?modal=senior"
            />
            <ActieRij
              kleur="oranje"
              tekst="Junior loonkloof 6,8% — controleer op objectieve verklaring"
              knopLabel="Bekijk"
              naar="/functiegroepen/1"
            />
            <ActieRij
              kleur="oranje"
              tekst="2 medewerkers zonder actuele competentiebeoordeling"
              knopLabel="Bekijk"
              naar="/functiegroepen/1"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
