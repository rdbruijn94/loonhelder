import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import TopNav from "../components/TopNav";
import FunctieprofielSectie from "../components/FunctieprofielSectie";
import CompetentiehandboekSectie from "../components/CompetentiehandboekSectie";
import GesprekkenSectie from "../components/GesprekkenSectie";
import MedewerkerDocumenten from "../components/MedewerkerDocumenten";
import { getUser } from "../utils/auth";
import {
  alleMedewerkers,
  gemCompetentieScore,
  getGemiddeldNiveau,
  getGesprekkenVoorMedewerker,
  getMedewerkerById,
  getNiveauBand,
} from "../data/mockdata";
import { generateMedewerkerPDF } from "../utils/generatePDF";

const formatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function bandPositie(salaris, band) {
  return ((salaris - band.min) / (band.max - band.min)) * 100;
}

function formatDatum(iso) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function berekenLoonkloof(medewerkers) {
  const mannen = medewerkers.filter((m) => m.geslacht === "man");
  const vrouwen = medewerkers.filter((m) => m.geslacht === "vrouw");
  if (!mannen.length || !vrouwen.length) return 0;
  const gemMan = mannen.reduce((s, m) => s + m.salaris, 0) / mannen.length;
  const gemVrouw = vrouwen.reduce((s, m) => s + m.salaris, 0) / vrouwen.length;
  return ((gemMan - gemVrouw) / gemMan) * 100;
}

function CompetentieBlokken({ huidigNiveau, vereistNiveau, maximaalNiveau }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: maximaalNiveau }, (_, i) => {
        const niveau = i + 1;
        let klasse = "bg-navy/10";
        if (niveau <= huidigNiveau) klasse = "bg-navy";
        else if (huidigNiveau < vereistNiveau && niveau <= vereistNiveau) klasse = "bg-amber";
        return <div key={niveau} className={`h-3 flex-1 rounded-sm ${klasse}`} />;
      })}
    </div>
  );
}

function ComplianceBadge({ ok, label }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-navy/70">{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          ok ? "bg-green-50 text-green-700" : "bg-[#FEF2F2] text-[#DC2626]"
        }`}
      >
        {ok ? "Ja" : "Nee"}
      </span>
    </div>
  );
}

function TeamScatter({ medewerker, salaris }) {
  const collegas = alleMedewerkers.filter(
    (m) => m.niveau === medewerker.niveau && m.id !== medewerker.id
  );
  const band = getNiveauBand(medewerker.niveau);
  const eigenPct = bandPositie(salaris, band);

  return (
    <div className="relative mt-4 h-24 rounded-lg bg-achtergrond px-2">
      <div className="absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 bg-navy/20" />
      {collegas.map((c, i) => {
        const pct = bandPositie(c.salaris, band);
        return (
          <div
            key={c.id}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy/30"
            style={{ left: `${pct}%` }}
            title="Collega (anoniem)"
          />
        );
      })}
      <div
        className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
        style={{
          left: `${eigenPct}%`,
          backgroundColor: medewerker.geslacht === "man" ? "#3B7DD8" : "#8B5CF6",
        }}
        title="Deze medewerker"
      />
      <div className="absolute bottom-1 left-2 text-[10px] text-navy/40">
        {formatter.format(band.min)}
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] text-navy/40">
        {formatter.format(band.max)}
      </div>
    </div>
  );
}

function OnderbouwingModal({ open, onClose, medewerker, salaris, competenties }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[10px] bg-white md:max-w-2xl md:rounded-[10px]">
        <div className="flex items-center justify-between border-b border-navy/10 px-4 py-4 md:px-6">
          <div>
            <h2 className="text-lg font-bold text-navy">Onderbouwingsdocument</h2>
            <p className="text-sm text-navy/60">{medewerker.naam}</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl text-navy" aria-label="Sluiten">
            ×
          </button>
        </div>
        <div className="p-4 md:p-6">
          <div className="rounded-lg bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">
            Dit document bevat persoonsgegevens en is uitsluitend bestemd voor intern gebruik.
          </div>
          <div className="mt-4 space-y-2 text-sm text-navy/70">
            <p>
              <strong>Functie:</strong> {medewerker.functie}
            </p>
            <p>
              <strong>Salaris:</strong> {formatter.format(salaris)}
            </p>
            <p>
              <strong>Competentiescore:</strong> {gemCompetentieScore(competenties)}
            </p>
            <p>
              <strong>Beoordeling:</strong> {medewerker.beoordelingResultaat}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                generateMedewerkerPDF({ ...medewerker, salaris, competenties })
              }
              className="min-h-11 flex-1 rounded bg-amber px-4 py-3 text-sm font-semibold text-navy hover:bg-amber/90"
            >
              Download als PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 flex-1 rounded bg-gray-200 px-4 py-3 text-sm font-medium text-navy"
            >
              Sluit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MedewerkerDetail() {
  const { id } = useParams();
  const bron = getMedewerkerById(id);

  const [profiel, setProfiel] = useState(() => (bron ? { ...bron } : null));
  const [salaris, setSalaris] = useState(() => bron?.salaris ?? 0);
  const [competenties, setCompetenties] = useState(
    () => bron?.competenties.map((c) => ({ ...c })) ?? []
  );
  const [gesprekkenLijst, setGesprekkenLijst] = useState(() =>
    bron ? getGesprekkenVoorMedewerker(id) : []
  );

  const [profielBewerken, setProfielBewerken] = useState(false);
  const [profielDraft, setProfielDraft] = useState({});
  const [salarisBewerken, setSalarisBewerken] = useState(false);
  const [salarisDraft, setSalarisDraft] = useState("");
  const [salarisFout, setSalarisFout] = useState("");
  const [loonkloofWaarschuwing, setLoonkloofWaarschuwing] = useState(false);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [competentiesOpgeslagen, setCompetentiesOpgeslagen] = useState(false);

  const isHR = getUser()?.rol === "hr";

  useEffect(() => {
    if (!bron) return;
    setProfiel({ ...bron });
    setSalaris(bron.salaris);
    setCompetenties(bron.competenties.map((c) => ({ ...c })));
    setGesprekkenLijst(getGesprekkenVoorMedewerker(id));
    setProfielBewerken(false);
    setSalarisBewerken(false);
    setLoonkloofWaarschuwing(false);
  }, [id, bron]);

  const band = profiel ? getNiveauBand(profiel.niveau) : null;
  const gemNiveau = profiel ? getGemiddeldNiveau(profiel.niveau) : 0;
  const positiePct = band ? Math.round(bandPositie(salaris, band)) : 0;
  const kleur = profiel?.geslacht === "man" ? "#3B7DD8" : "#8B5CF6";

  const compliance = useMemo(() => {
    if (!profiel || !band) return {};
    const competentiesOk = competenties.every((c) => c.huidigNiveau >= 1);
    const inBand = salaris >= band.min && salaris <= band.max;
    return {
      functiebeschrijving: true,
      competenties: competentiesOk,
      salarisInBand: inBand,
      gedocumenteerd: inBand && competentiesOk,
    };
  }, [profiel, band, salaris, competenties]);

  if (!bron || !profiel) {
    return (
      <div className="pagina">
        <TopNav />
        <main className="inhoud">
          <p className="text-navy">Medewerker niet gevonden.</p>
          <Link to="/medewerkers" className="mt-4 inline-block text-amber">
            Terug naar overzicht
          </Link>
        </main>
      </div>
    );
  }

  function startProfielBewerken() {
    setProfielDraft({ ...profiel });
    setProfielBewerken(true);
  }

  function slaProfielOp() {
    setProfiel({ ...profielDraft, functie: `${profielDraft.niveau} Assurantieadviseur` });
    setProfielBewerken(false);
  }

  function controleerLoonkloof(nieuwSalaris) {
    const zelfdeNiveau = alleMedewerkers
      .filter((m) => m.niveau === profiel.niveau)
      .map((m) => (m.id === profiel.id ? { ...m, salaris: nieuwSalaris } : m));
    const huidig = alleMedewerkers.filter((m) => m.niveau === profiel.niveau);
    return berekenLoonkloof(zelfdeNiveau) > berekenLoonkloof(huidig);
  }

  function slaSalarisOp() {
    const waarde = Number(salarisDraft);
    if (!band || waarde < band.min || waarde > band.max) {
      setSalarisFout(
        `Salaris moet tussen ${formatter.format(band.min)} en ${formatter.format(band.max)} liggen.`
      );
      return;
    }
    setSalaris(waarde);
    setLoonkloofWaarschuwing(controleerLoonkloof(waarde));
    setSalarisBewerken(false);
    setSalarisFout("");
  }

  function updateCompetentie(index, niveau) {
    setCompetenties((prev) =>
      prev.map((c, i) => (i === index ? { ...c, huidigNiveau: Number(niveau) } : c))
    );
    setCompetentiesOpgeslagen(false);
  }

  function slaCompetentiesOp() {
    setCompetentiesOpgeslagen(true);
    setTimeout(() => setCompetentiesOpgeslagen(false), 2500);
  }

  const p = profielBewerken ? profielDraft : profiel;

  return (
    <div className="pagina">
      <TopNav />
      <OnderbouwingModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        medewerker={profiel}
        salaris={salaris}
        competenties={competenties}
      />

      <main className="inhoud">
        <nav className="text-sm text-navy/60">
          <Link to="/medewerkers" className="hover:text-amber">
            Medewerkers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{profiel.naam}</span>
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            {/* Sectie 1 — Profiel */}
            <section className="kaart p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-base font-semibold text-navy md:text-lg">Medewerkerprofiel</h2>
                {!profielBewerken ? (
                  <button
                    type="button"
                    onClick={startProfielBewerken}
                    className="min-h-11 rounded bg-navy/10 px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy/20"
                  >
                    Bewerk profiel
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={slaProfielOp}
                      className="min-h-11 rounded bg-navy px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Sla op
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfielBewerken(false)}
                      className="min-h-11 rounded bg-gray-200 px-3 py-1.5 text-xs font-medium text-navy"
                    >
                      Annuleer
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Naam", key: "naam" },
                  { label: "Functie", key: "functie", readOnly: true },
                  { label: "Niveau", key: "niveau", options: ["Junior", "Medior", "Senior"] },
                  { label: "Geslacht", key: "geslacht", options: ["man", "vrouw"] },
                  { label: "Startdatum", key: "startdatum", type: "date" },
                  { label: "Ervaringsjaren", key: "ervaringsjaren", type: "number" },
                  { label: "Beoordeling laatste gesprek", key: "beoordelingResultaat" },
                ].map(({ label, key, options, type, readOnly }) => (
                  <div key={key}>
                    <p className="text-xs text-navy/50">{label}</p>
                    {profielBewerken && !readOnly ? (
                      options ? (
                        <select
                          value={profielDraft[key]}
                          onChange={(e) =>
                            setProfielDraft((d) => ({ ...d, [key]: e.target.value }))
                          }
                          className="mt-1 w-full rounded border border-navy/20 px-2 py-1.5 text-sm"
                        >
                          {options.map((o) => (
                            <option key={o} value={o}>
                              {o === "man" ? "Man" : o === "vrouw" ? "Vrouw" : o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type || "text"}
                          value={profielDraft[key]}
                          onChange={(e) =>
                            setProfielDraft((d) => ({
                              ...d,
                              [key]: type === "number" ? Number(e.target.value) : e.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded border border-navy/20 px-2 py-1.5 text-sm"
                        />
                      )
                    ) : (
                      <p className="mt-1 font-medium text-navy">
                        {key === "geslacht"
                          ? p.geslacht === "man"
                            ? "Man"
                            : "Vrouw"
                          : key === "startdatum"
                            ? formatDatum(p.startdatum)
                            : p[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Sectie 2 — Salaris */}
            <section className="kaart p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-base font-semibold text-navy md:text-lg">Salarispositie</h2>
                {!salarisBewerken && (
                  <button
                    type="button"
                    onClick={() => {
                      setSalarisDraft(String(salaris));
                      setSalarisBewerken(true);
                      setSalarisFout("");
                    }}
                    className="min-h-11 rounded bg-navy/10 px-3 py-1.5 text-xs font-medium text-navy"
                  >
                    Pas salaris aan
                  </button>
                )}
              </div>

              {salarisBewerken && (
                <div className="mt-4 rounded-lg bg-achtergrond p-4">
                  <label className="text-sm text-navy/70">Nieuw salaris (€)</label>
                  <input
                    type="number"
                    value={salarisDraft}
                    onChange={(e) => setSalarisDraft(e.target.value)}
                    className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                  />
                  {salarisFout && <p className="mt-2 text-sm text-[#DC2626]">{salarisFout}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={slaSalarisOp}
                      className="min-h-11 rounded bg-navy px-4 py-2 text-sm text-white"
                    >
                      Sla op
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalarisBewerken(false)}
                      className="min-h-11 rounded bg-gray-200 px-4 py-2 text-sm text-navy"
                    >
                      Annuleer
                    </button>
                  </div>
                </div>
              )}

              {loonkloofWaarschuwing && (
                <div className="mt-4 rounded-lg bg-amber/15 px-4 py-3 text-sm text-amber">
                  Let op: dit salaris vergroot de loonkloof binnen het {profiel.niveau}-niveau.
                </div>
              )}

              <p className="mt-4 text-xs text-navy/60 md:text-sm">
                Salarisband {formatter.format(band.min)} – {formatter.format(band.max)}
              </p>

              <div className="relative mt-8">
                <div className="relative h-3 rounded-full bg-achtergrond">
                  <div
                    className="absolute -top-7 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium md:text-xs"
                    style={{ left: `${positiePct}%`, color: kleur }}
                  >
                    {profiel.naam.split(" ")[0]}
                  </div>
                  <div
                    className="absolute -top-7 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-gray-500 md:text-xs"
                    style={{ left: `${bandPositie(gemNiveau, band)}%` }}
                  >
                    Gemiddelde
                  </div>
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow md:h-5 md:w-5"
                    style={{ left: `${positiePct}%`, backgroundColor: kleur }}
                  />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-400 shadow md:h-5 md:w-5"
                    style={{ left: `${bandPositie(gemNiveau, band)}%` }}
                  />
                </div>
                <div className="mt-6 flex justify-between text-[10px] text-navy/50 md:text-xs">
                  <span>{formatter.format(band.min)}</span>
                  <span>{formatter.format(band.max)}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-navy/50">Huidig salaris</p>
                  <p className="font-semibold text-navy">{formatter.format(salaris)}</p>
                </div>
                <div>
                  <p className="text-navy/50">Positie in band</p>
                  <p className="font-semibold text-navy">{positiePct}%</p>
                </div>
                <div>
                  <p className="text-navy/50">Gemiddelde vergelijkbaar</p>
                  <p className="font-semibold text-navy">{formatter.format(gemNiveau)}</p>
                </div>
              </div>
            </section>

            <FunctieprofielSectie niveau={profiel.niveau} />

            <CompetentiehandboekSectie competenties={competenties} />

            {/* Sectie 3 — Competenties */}
            <section>
              <h2 className="text-base font-semibold text-navy md:text-lg">Competentieprofiel</h2>
              <div className="mt-4 space-y-3">
                {competenties.map((comp, index) => {
                  const opNiveau = comp.huidigNiveau >= comp.vereistNiveau;
                  return (
                    <div key={comp.naam} className="kaart p-4 md:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-navy">{comp.naam}</h3>
                          <p className="text-xs text-navy/50">{comp.categorie}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {opNiveau ? (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                              Op niveau
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-medium text-[#DC2626]">
                              Ontwikkelpunt
                            </span>
                          )}
                          <select
                            value={comp.huidigNiveau}
                            onChange={(e) => updateCompetentie(index, e.target.value)}
                            className="rounded border border-navy/20 px-2 py-1 text-sm"
                            aria-label={`Niveau ${comp.naam}`}
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <CompetentieBlokken
                          huidigNiveau={comp.huidigNiveau}
                          vereistNiveau={comp.vereistNiveau}
                          maximaalNiveau={comp.maximaalNiveau}
                        />
                        <p className="mt-2 text-xs text-navy/60">
                          Niveau {comp.huidigNiveau} van {comp.maximaalNiveau}
                        </p>
                      </div>
                      <p className="mt-3 text-sm text-navy/50">{comp.omschrijving}</p>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={slaCompetentiesOp}
                className="mt-4 min-h-11 rounded bg-navy px-6 py-2 text-sm font-medium text-white"
              >
                {competentiesOpgeslagen ? "Opgeslagen ✓" : "Sla competenties op"}
              </button>
            </section>

            <GesprekkenSectie
              medewerkerId={profiel.id}
              gevoerdeGesprekken={gesprekkenLijst}
              isHR={isHR}
            />
          </div>

          {/* Rechterkolom */}
          <aside className="space-y-4">
            <div className="kaart p-4">
              <h3 className="font-semibold text-navy">Snelle acties</h3>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setPdfModalOpen(true)}
                  className="min-h-11 w-full rounded bg-navy px-4 py-2 text-sm font-medium text-white"
                >
                  Genereer onderbouwingsdocument
                </button>
                <button
                  type="button"
                  className="min-h-11 w-full rounded border-2 border-navy bg-white px-4 py-2 text-sm font-medium text-navy"
                >
                  Plan ontwikkelgesprek
                </button>
                <button
                  type="button"
                  className="min-h-11 w-full rounded border-2 border-navy bg-white px-4 py-2 text-sm font-medium text-navy"
                >
                  Stuur bericht
                </button>
              </div>
            </div>

            <MedewerkerDocumenten medewerkerId={profiel.id} />

            <div className="kaart p-4">
              <h3 className="font-semibold text-navy">Compliance-status</h3>
              <div className="mt-2 divide-y divide-navy/10">
                <ComplianceBadge ok={compliance.functiebeschrijving} label="Actuele functiebeschrijving" />
                <ComplianceBadge ok={compliance.competenties} label="Competenties beoordeeld" />
                <ComplianceBadge ok={compliance.salarisInBand} label="Salaris binnen band" />
                <ComplianceBadge ok={compliance.gedocumenteerd} label="Salarispositie gedocumenteerd" />
              </div>
            </div>

            <div className="kaart p-4">
              <h3 className="font-semibold text-navy">Positie ten opzichte van team</h3>
              <p className="mt-1 text-xs text-navy/50">
                {profiel.niveau} · anonieme collega's
              </p>
              <TeamScatter medewerker={profiel} salaris={salaris} />
              <div className="mt-3 flex items-center gap-3 text-xs text-navy/60">
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: kleur }}
                  />
                  Deze medewerker
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-navy/30" />
                  Collega's
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
