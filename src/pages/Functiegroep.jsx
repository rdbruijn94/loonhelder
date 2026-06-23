import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import FunctiegroepDocumenten from "../components/FunctiegroepDocumenten";
import { functiegroepen, organisatie, seniorMedewerkers } from "../data/mockdata";
import { generateOnderbouwingPDF } from "../utils/generatePDF";

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

function LoonkloofActie({ loonkloof, onGenereer, onBekijk }) {
  if (loonkloof < 5) return null;

  if (loonkloof > 10) {
    return (
      <button
        type="button"
        onClick={onGenereer}
        className="mt-4 min-h-11 rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90"
      >
        Genereer onderbouwing
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onBekijk}
      className="mt-4 min-h-11 rounded border-2 border-navy px-4 py-2 text-sm font-medium text-navy hover:bg-navy/5"
    >
      Bekijk onderbouwing
    </button>
  );
}

function NiveauKaart({ data, id, onGenereerOnderbouwing, onBekijkOnderbouwing }) {
  const loonkloof = loonkloofKleur(data.loonkloof);

  return (
    <div id={id} className="kaart w-full p-4 md:p-6">
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

      <LoonkloofActie
        loonkloof={data.loonkloof}
        onGenereer={onGenereerOnderbouwing ?? (() => {})}
        onBekijk={onBekijkOnderbouwing ?? (() => {})}
      />

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

function MedewerkerKolom({ persoon }) {
  const isMan = persoon.geslacht === "man";

  return (
    <div className="kaart p-4 md:p-5">
      <h3 className="font-semibold text-navy">{persoon.naam}</h3>
      <p className={`mt-1 text-sm ${isMan ? "text-man" : "text-vrouw"}`}>
        {isMan ? "Man" : "Vrouw"} · {formatter.format(persoon.salaris)}
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-navy/60">Ervaringsjaren</dt>
          <dd className="font-medium text-navy">{persoon.ervaringsjaren}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-navy/60">Beoordeling</dt>
          <dd className="font-medium text-navy">{persoon.beoordelingResultaat}</dd>
        </div>
      </dl>
      <ul className="mt-4 space-y-2 text-sm">
        {persoon.competenties.map((c) => {
          const onderVereist = c.huidigNiveau < c.vereistNiveau;
          return (
            <li
              key={c.naam}
              className={`flex justify-between ${onderVereist ? "text-[#DC2626]" : "text-navy"}`}
            >
              <span>{c.naam}</span>
              <span className="font-medium">Niveau {c.huidigNiveau}</span>
            </li>
          );
        })}
      </ul>
      <span className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        Salarispositie objectief onderbouwd
      </span>
    </div>
  );
}

function ExternInhoud() {
  const senior = functiegroepen[0].niveaus.find((n) => n.niveau === "Senior");

  return (
    <div>
      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
        Dit rapport is geschikt voor externe rapportage conform EU Richtlijn 2023/970.
      </div>

      <div className="kaart mt-4 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-achtergrond">
            <tr>
              <th className="px-4 py-2 font-medium text-navy/60">Groep</th>
              <th className="px-4 py-2 font-medium text-navy/60">Aantal</th>
              <th className="px-4 py-2 font-medium text-navy/60">Gem. salaris</th>
              <th className="hidden px-4 py-2 font-medium text-navy/60 sm:table-cell">
                Gem. ervaring
              </th>
              <th className="hidden px-4 py-2 font-medium text-navy/60 md:table-cell">
                Gem. score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/10">
            <tr>
              <td className="px-4 py-3 font-medium text-man">Man</td>
              <td className="px-4 py-3">{senior?.man.aantal ?? 2}</td>
              <td className="px-4 py-3">{formatter.format(senior?.man.gemiddeld ?? 4480)}</td>
              <td className="hidden px-4 py-3 sm:table-cell">8 jaar</td>
              <td className="hidden px-4 py-3 md:table-cell">4,0</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-vrouw">Vrouw</td>
              <td className="px-4 py-3">{senior?.vrouw.aantal ?? 2}</td>
              <td className="px-4 py-3">{formatter.format(senior?.vrouw.gemiddeld ?? 3840)}</td>
              <td className="hidden px-4 py-3 sm:table-cell">4 jaar</td>
              <td className="hidden px-4 py-3 md:table-cell">2,8</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-3xl font-bold text-navy">14,2%</p>
      <p className="mt-2 text-sm leading-relaxed text-navy/70">
        Senior Assurantieadviseur — man (n=2): gemiddeld €4.480 / vrouw (n=2): gemiddeld
        €3.840. Loonverschil 14,2% verklaard door gemiddeld ervaringsverschil (8 vs 4 jaar)
        en gemiddelde competentiescore (4,0 vs 2,8).
      </p>
    </div>
  );
}

function SeniorOnderbouwingModal({ open, onClose }) {
  const [actieveTab, setActieveTab] = useState("intern");

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) setActieveTab("intern");
  }, [open]);

  if (!open) return null;

  const [thomas, sandra] = seniorMedewerkers;

  const conclusieIntern =
    "Het loonverschil van 14,2% is verklaarbaar op basis van ervaringsverschil (8 vs 4 jaar) en competentiescores. Thomas Bakker scoort op alle competenties niveau 4, Sandra Visser scoort op Productkennis en Probleemoplossend vermogen nog niveau 2. Dit verschil is objectief en niet gebaseerd op geslacht.";

  const conclusieExtern =
    "Loonverschil 14,2% verklaard door gemiddeld ervaringsverschil (8 vs 4 jaar) en gemiddelde competentiescore (4,0 vs 2,8). Dit verschil is objectief en niet gebaseerd op geslacht.";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[10px] bg-white md:max-w-4xl md:rounded-[10px]">
        <div className="sticky top-0 z-10 border-b border-navy/10 bg-white">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div>
              <h2 className="text-lg font-bold text-navy md:text-xl">
                Onderbouwing loonverschil — Senior Assurantieadviseur
              </h2>
              <p className="mt-1 text-sm text-navy/60">
                Automatisch gegenereerd op basis van competentie- en ervaringsdata
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 flex min-h-11 min-w-11 items-center justify-center text-2xl text-navy"
              aria-label="Sluiten"
            >
              ×
            </button>
          </div>

          <div className="flex border-t border-navy/10 px-4 md:px-6">
            {[
              { id: "intern", label: "Intern" },
              { id: "extern", label: "Extern rapport" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActieveTab(tab.id)}
                className={`min-h-11 px-4 text-sm font-medium ${
                  actieveTab === tab.id
                    ? "border-b-2 border-amber text-navy"
                    : "border-b-2 border-transparent text-navy/50 hover:text-navy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6">
          {actieveTab === "intern" ? (
            <>
              <div className="rounded-lg bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">
                Dit document bevat persoonsgegevens en is uitsluitend bestemd voor intern
                gebruik door HR en directie.
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <MedewerkerKolom persoon={thomas} />
                <MedewerkerKolom persoon={sandra} />
              </div>
            </>
          ) : (
            <ExternInhoud />
          )}

          <div className="mt-6 border-t border-navy/10 pt-6">
            <h3 className="font-semibold text-navy">Conclusie</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">
              {actieveTab === "intern" ? conclusieIntern : conclusieExtern}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Loonverschil objectief verklaard
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => generateOnderbouwingPDF(actieveTab)}
              className="min-h-11 flex-1 rounded bg-amber px-4 py-3 text-sm font-semibold text-navy hover:bg-amber/90"
            >
              Download als PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 flex-1 rounded bg-gray-200 px-4 py-3 text-sm font-medium text-navy hover:bg-gray-300"
            >
              Sluit
            </button>
          </div>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [seniorModalOpen, setSeniorModalOpen] = useState(false);

  const groep = functiegroepen.find((g) => g.id === Number(id));

  useEffect(() => {
    if (searchParams.get("modal") === "senior") {
      setSeniorModalOpen(true);
    }
  }, [searchParams]);

  function openSeniorModal() {
    setSeniorModalOpen(true);
    setSearchParams({ modal: "senior" });
  }

  function closeSeniorModal() {
    setSeniorModalOpen(false);
    setSearchParams({});
  }

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
          <div className="order-1 space-y-4 md:space-y-6 lg:col-span-2">
            {groep.niveaus.map((niveau) => (
              <NiveauKaart
                key={niveau.niveau}
                id={niveau.niveau === "Junior" ? "junior-niveau" : undefined}
                data={niveau}
                onGenereerOnderbouwing={
                  niveau.niveau === "Senior" ? openSeniorModal : undefined
                }
                onBekijkOnderbouwing={
                  niveau.niveau === "Junior"
                    ? () =>
                        document
                          .getElementById("junior-niveau")
                          ?.scrollIntoView({ behavior: "smooth" })
                    : undefined
                }
              />
            ))}
            <FunctiegroepDocumenten />
          </div>
          <div className="order-2 lg:order-2">
            <Zijbalk groep={groep} />
          </div>
        </div>
      </main>

      <SeniorOnderbouwingModal open={seniorModalOpen} onClose={closeSeniorModal} />
    </div>
  );
}
