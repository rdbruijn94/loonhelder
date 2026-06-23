import { Link, useParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import { functiegroepen, organisatie } from "../data/mockdata";

const formatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function loonkloofKleur(percentage) {
  if (percentage < 5) {
    return { bg: "bg-green-50", text: "text-green-700", label: "Op orde" };
  }
  if (percentage > 10) {
    return { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", label: "Kritiek" };
  }
  return { bg: "bg-[#FFF7ED]", text: "text-[#EA580C]", label: "Aandacht vereist" };
}

function niveauBadgeKleur(niveau) {
  if (niveau === "Junior") return "bg-man/15 text-man";
  if (niveau === "Medior") return "bg-vrouw/15 text-vrouw";
  return "bg-amber/20 text-amber";
}

function bandBreedte(salaris, band) {
  const range = band.max - band.min;
  if (range === 0) return 0;
  return Math.min(100, Math.max(0, ((salaris - band.min) / range) * 100));
}

function SalarisBalk({ label, salaris, band, kleur }) {
  const breedte = bandBreedte(salaris, band);

  return (
    <div>
      <div className="mb-1 text-[11px] font-medium text-navy/70 md:text-sm">{label}</div>
      <div className="relative h-9 rounded bg-achtergrond">
        <div
          className={`absolute top-0 left-0 flex h-9 min-w-0 items-center overflow-hidden rounded px-1.5 text-[11px] font-semibold text-white md:px-2 md:text-xs ${kleur}`}
          style={{ width: `${breedte}%` }}
        >
          <span className="truncate">{formatter.format(salaris)}</span>
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-navy/40 md:text-xs">
        <span>{formatter.format(band.min)}</span>
        <span>{formatter.format(band.max)}</span>
      </div>
    </div>
  );
}

function NiveauKaart({ data }) {
  const loonkloof = loonkloofKleur(data.loonkloof);

  return (
    <div className="kaart w-full p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${niveauBadgeKleur(data.niveau)}`}
        >
          {data.niveau}
        </span>
        <span className="text-xs text-navy/50 md:text-sm">
          {formatter.format(data.salarisBand.min)} – {formatter.format(data.salarisBand.max)}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <SalarisBalk
          label={`Man (${data.man.aantal})`}
          salaris={data.man.gemiddeld}
          band={data.salarisBand}
          kleur="bg-man"
        />
        <SalarisBalk
          label={`Vrouw (${data.vrouw.aantal})`}
          salaris={data.vrouw.gemiddeld}
          band={data.salarisBand}
          kleur="bg-vrouw"
        />
      </div>

      <div
        className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium md:text-sm ${loonkloof.bg} ${loonkloof.text}`}
      >
        Loonkloof {data.loonkloof.toLocaleString("nl-NL")}% · {loonkloof.label}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="rounded bg-achtergrond p-3">
          <p className="text-xs text-navy/50">Mannen</p>
          <p className="mt-0.5 font-semibold text-navy">{data.man.aantal}</p>
        </div>
        <div className="rounded bg-achtergrond p-3">
          <p className="text-xs text-navy/50">Vrouwen</p>
          <p className="mt-0.5 font-semibold text-navy">{data.vrouw.aantal}</p>
        </div>
        <div className="rounded bg-achtergrond p-3">
          <p className="text-xs text-navy/50">Gem. man</p>
          <p className="mt-0.5 text-sm font-semibold text-man md:text-base">
            {formatter.format(data.man.gemiddeld)}
          </p>
        </div>
        <div className="rounded bg-achtergrond p-3">
          <p className="text-xs text-navy/50">Gem. vrouw</p>
          <p className="mt-0.5 text-sm font-semibold text-vrouw md:text-base">
            {formatter.format(data.vrouw.gemiddeld)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Zijbalk({ groep }) {
  const totaal = groep.niveaus.reduce(
    (sum, n) => sum + n.man.aantal + n.vrouw.aantal,
    0
  );
  const totaalMan = groep.niveaus.reduce((sum, n) => sum + n.man.aantal, 0);
  const totaalVrouw = groep.niveaus.reduce((sum, n) => sum + n.vrouw.aantal, 0);

  return (
    <aside className="space-y-4 md:space-y-6">
      <div className="kaart p-4 md:p-6">
        <h3 className="font-semibold text-navy">Compliance-status</h3>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#DC2626] sm:mx-0"
            style={{
              background: `conic-gradient(#DC2626 ${organisatie.complianceScore}%, #F0F2F5 0)`,
            }}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-bold text-[#DC2626]">
              {organisatie.complianceScore}%
            </span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-green-700">Op orde</p>
            <ul className="mt-1 list-inside list-disc text-navy/60">
              <li>Salarisbanden gepubliceerd</li>
              <li>Genderverdeling zichtbaar</li>
              <li>Medior loonkloof onder 5%</li>
            </ul>
            <p className="mt-3 font-medium text-[#DC2626]">Niet op orde</p>
            <ul className="mt-1 list-inside list-disc text-navy/60">
              <li>Compliance onder 70%</li>
              <li>Senior loonkloof boven 10%</li>
              <li>Junior loonkloof boven 5%</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="kaart p-4 md:p-6">
        <h3 className="font-semibold text-navy">Genderverdeling per niveau</h3>
        <div className="mt-4 space-y-4">
          {groep.niveaus.map((n) => {
            const totaalNiveau = n.man.aantal + n.vrouw.aantal;
            const manPct = (n.man.aantal / totaalNiveau) * 100;
            const vrouwPct = (n.vrouw.aantal / totaalNiveau) * 100;
            return (
              <div key={n.niveau}>
                <p className="mb-1 text-sm font-medium text-navy">{n.niveau}</p>
                <div className="flex h-4 overflow-hidden rounded-full">
                  <div className="bg-man" style={{ width: `${manPct}%` }} />
                  <div className="bg-vrouw" style={{ width: `${vrouwPct}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-xs text-navy/50">
                  <span>{n.man.aantal} man</span>
                  <span>{n.vrouw.aantal} vrouw</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 border-t border-navy/10 pt-3 text-xs text-navy/50">
          Totaal: {totaalMan} man · {totaalVrouw} vrouw ({totaal} medewerkers)
        </div>
      </div>

      <div className="kaart p-4 md:p-6">
        <h3 className="font-semibold text-navy">Aandachtspunten</h3>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="rounded bg-[#FEF2F2] px-3 py-2 text-[#DC2626]">
            Senior loonkloof kritiek ({groep.niveaus[2].loonkloof.toLocaleString("nl-NL")}%)
          </li>
          <li className="rounded bg-[#FFF7ED] px-3 py-2 text-[#EA580C]">
            Junior loonkloof hoog ({groep.niveaus[0].loonkloof.toLocaleString("nl-NL")}%)
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default function Functiegroep() {
  const { id } = useParams();
  const groep = functiegroepen.find((g) => g.id === Number(id));

  if (!groep) {
    return (
      <div className="pagina">
        <TopNav />
        <main className="inhoud">
          <p className="text-navy">Functiegroep niet gevonden.</p>
          <Link to="/functiegroepen" className="mt-4 inline-block min-h-11 text-amber hover:underline">
            Terug naar functiegroepen
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        <nav className="text-xs text-navy/50 md:text-sm">
          <Link to="/functiegroepen" className="hover:text-navy">
            Functiegroepen
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{groep.naam}</span>
        </nav>

        <h1 className="mt-4 text-xl font-bold text-navy md:text-2xl">{groep.naam}</h1>
        <p className="mt-1 text-sm text-navy/60 md:text-base">
          {organisatie.medewerkers} medewerkers · Schaal {groep.schaal}
        </p>

        <div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8 lg:grid lg:grid-cols-3">
          <div className="order-1 space-y-4 md:space-y-6 lg:order-1 lg:col-span-2">
            {groep.niveaus.map((niveau) => (
              <NiveauKaart key={niveau.niveau} data={niveau} />
            ))}
          </div>
          <div className="order-2 lg:order-2">
            <Zijbalk groep={groep} />
          </div>
        </div>
      </main>
    </div>
  );
}
