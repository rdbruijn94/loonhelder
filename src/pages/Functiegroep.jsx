import { Link, useParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import {
  berekenLoonkloof,
  getFunctiegroep,
  loonkloofKleur,
} from "../data/mockdata";

const kleurMap = {
  groen: { tekst: "text-green-600", bg: "bg-green-600" },
  oranje: { tekst: "text-amber", bg: "bg-amber" },
  rood: { tekst: "text-red-600", bg: "bg-red-600" },
};

function SalarisBalk({ label, salaris, schaal, kleur }) {
  const positie = ((salaris - schaal.min) / (schaal.max - schaal.min)) * 100;
  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex-1">
      <div className="mb-1 flex items-center justify-between">
        <span className={`text-sm font-medium ${kleur}`}>{label}</span>
        <span className={`text-sm font-semibold ${kleur}`}>
          {formatter.format(salaris)}
        </span>
      </div>
      <div className="relative h-8 rounded bg-achtergrond">
        <div
          className={`absolute top-0 left-0 h-full rounded ${kleur === "text-man" ? "bg-man" : "bg-vrouw"}`}
          style={{ width: `${Math.min(100, Math.max(0, positie))}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-navy/40">
        <span>{formatter.format(schaal.min)}</span>
        <span>{formatter.format(schaal.max)}</span>
      </div>
    </div>
  );
}

function NiveauSectie({ niveau }) {
  const loonkloof = berekenLoonkloof(
    niveau.man.gemiddeldSalaris,
    niveau.vrouw.gemiddeldSalaris
  );
  const kleur = loonkloofKleur(loonkloof);
  const kleurClasses = kleurMap[kleur];

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-navy">{niveau.naam}</h2>
          <p className="mt-1 text-sm text-navy/50">
            Salarisschaal {niveau.schaal.min.toLocaleString("nl-NL")} –{" "}
            {niveau.schaal.max.toLocaleString("nl-NL")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-navy/60">Loonkloof</p>
          <p className={`text-2xl font-bold ${kleurClasses.tekst}`}>{loonkloof}%</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row">
        <SalarisBalk
          label={`Man (${niveau.man.aantal})`}
          salaris={niveau.man.gemiddeldSalaris}
          schaal={niveau.schaal}
          kleur="text-man"
        />
        <SalarisBalk
          label={`Vrouw (${niveau.vrouw.aantal})`}
          salaris={niveau.vrouw.gemiddeldSalaris}
          schaal={niveau.schaal}
          kleur="text-vrouw"
        />
      </div>

      <div className="mt-4 flex gap-6 text-sm text-navy/60">
        <span>{niveau.man.aantal} mannen</span>
        <span>{niveau.vrouw.aantal} vrouwen</span>
        <span>{niveau.man.aantal + niveau.vrouw.aantal} totaal</span>
      </div>
    </section>
  );
}

export default function Functiegroep() {
  const { id } = useParams();
  const groep = getFunctiegroep(id);

  if (!groep) {
    return (
      <div className="min-h-screen bg-achtergrond">
        <TopNav />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-navy">Functiegroep niet gevonden.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-amber hover:underline">
            Terug naar dashboard
          </Link>
        </main>
      </div>
    );
  }

  const totaalMedewerkers = groep.niveaus.reduce(
    (sum, n) => sum + n.man.aantal + n.vrouw.aantal,
    0
  );

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Link to="/functiegroepen" className="text-sm text-navy/50 hover:text-navy">
          Terug naar functiegroepen
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-navy">{groep.naam}</h1>
        <p className="mt-1 text-navy/60">
          {totaalMedewerkers} medewerkers verdeeld over {groep.niveaus.length} niveaus
        </p>

        <div className="mt-4 flex flex-wrap gap-4 rounded bg-white px-4 py-3 text-xs text-navy/60 shadow-sm">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-600" />
            Loonkloof onder 5%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber" />
            Loonkloof 5–10%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" />
            Loonkloof boven 10%
          </span>
        </div>

        <div className="mt-8 space-y-6">
          {groep.niveaus.map((niveau) => (
            <NiveauSectie key={niveau.id} niveau={niveau} />
          ))}
        </div>
      </main>
    </div>
  );
}
