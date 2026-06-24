import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import { organisatie } from "../data/mockdata";
import { detectDominantColor } from "../utils/logoColor";
import { generateFunctieprofiel, regenerateSection } from "../utils/generateFunctieprofiel";
import { generateFunctieprofielPDF } from "../utils/generateFunctieprofielPDF";
import { saveFunctieprofiel } from "../utils/functieprofielStorage";

const STAPPEN = ["Huisstijl", "Functies", "Intake", "Review"];
const NIVEAUS = ["Junior", "Medior", "Senior", "Expert"];

const REVIEW_SECTIES = [
  { key: "doelVanDeFunctie", label: "Doel van de functie", type: "text" },
  { key: "taken", label: "Taken en verantwoordelijkheden", type: "list" },
  { key: "bevoegdheden", label: "Bevoegdheden", type: "list" },
  { key: "resultaatgebieden", label: "Resultaatgebieden", type: "list" },
  { key: "samenwerking", label: "Samenwerking", type: "text" },
  { key: "vereisten", label: "Vereiste opleiding en ervaring", type: "vereisten" },
  { key: "competenties", label: "Competenties", type: "list" },
  { key: "bijzondereOmstandigheden", label: "Bijzondere omstandigheden", type: "text" },
];

function legeIntake(titel) {
  return {
    functietitel: titel,
    afdeling: "",
    rapporteertAan: "",
    geeftLeidingAan: "",
    omschrijving: "",
    niveau: "Medior",
    vereistOpleiding: "",
    vereistWerkervaring: "",
  };
}

function sectieWaarde(profiel, key) {
  if (key === "vereisten") {
    return `${profiel.vereistOpleiding || ""}\n${profiel.vereistWerkervaring || ""}`.trim();
  }
  const val = profiel[key];
  if (Array.isArray(val)) return val.join("\n");
  return val || "";
}

function parseSectieInput(key, text, profiel) {
  if (key === "vereisten") {
    const [opleiding, ...rest] = text.split("\n");
    return {
      ...profiel,
      vereistOpleiding: opleiding,
      vereistWerkervaring: rest.join("\n"),
    };
  }
  const sectie = REVIEW_SECTIES.find((s) => s.key === key);
  if (sectie?.type === "list") {
    return {
      ...profiel,
      [key]: text.split("\n").map((l) => l.replace(/^[-•]\s*/, "").trim()).filter(Boolean),
    };
  }
  return { ...profiel, [key]: text };
}

export default function FunctieprofielWizard() {
  const [stap, setStap] = useState(1);
  const [logoDataURL, setLogoDataURL] = useState("");
  const [primairKleur, setPrimairKleur] = useState("");
  const [kleurHandmatig, setKleurHandmatig] = useState(false);
  const [organisatienaam, setOrganisatienaam] = useState(organisatie.naam);
  const [functies, setFuncties] = useState([]);
  const [nieuweFunctie, setNieuweFunctie] = useState("");
  const [intakes, setIntakes] = useState({});
  const [actieveFunctie, setActieveFunctie] = useState(0);
  const [profielen, setProfielen] = useState({});
  const [generating, setGenerating] = useState({});
  const [reviewFunctie, setReviewFunctie] = useState(0);
  const [goedgekeurd, setGoedgekeurd] = useState({});
  const [bewerktSectie, setBewerktSectie] = useState(null);
  const [bewerkTekst, setBewerkTekst] = useState("");
  const [regenerating, setRegenerating] = useState(null);
  const [vastgesteld, setVastgesteld] = useState({});

  const stap1Klaar = Boolean(logoDataURL || kleurHandmatig);
  const functieIds = functies;

  const alleGegenereerd = functieIds.every((id) => profielen[id]);

  const huidigeReviewId = functieIds[reviewFunctie];
  const huidigProfiel = huidigeReviewId ? profielen[huidigeReviewId] : null;
  const huidigeGoedkeuring = goedgekeurd[huidigeReviewId] || {};

  const goedgekeurdCount = REVIEW_SECTIES.filter(
    (s) => huidigeGoedkeuring[s.key]
  ).length;

  const alleSectiesGoedgekeurd =
    huidigProfiel && goedgekeurdCount === REVIEW_SECTIES.length;

  async function handleLogoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setLogoDataURL(dataUrl);
      try {
        const kleur = await detectDominantColor(dataUrl);
        setPrimairKleur(kleur);
        setKleurHandmatig(false);
      } catch {
        setPrimairKleur("#1B2E4B");
      }
    };
    reader.readAsDataURL(file);
  }

  function voegFunctieToe() {
    const titel = nieuweFunctie.trim();
    if (!titel || functies.includes(titel)) return;
    setFuncties([...functies, titel]);
    setIntakes((prev) => ({ ...prev, [titel]: legeIntake(titel) }));
    setNieuweFunctie("");
  }

  function verwijderFunctie(titel) {
    setFuncties(functies.filter((f) => f !== titel));
    setIntakes((prev) => {
      const next = { ...prev };
      delete next[titel];
      return next;
    });
    setProfielen((prev) => {
      const next = { ...prev };
      delete next[titel];
      return next;
    });
  }

  function handleCsvImport(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const regels = reader.result
        .split(/\r?\n/)
        .map((l) => l.split(",")[0].trim())
        .filter(Boolean);
      const uniek = [...new Set([...functies, ...regels])];
      setFuncties(uniek);
      setIntakes((prev) => {
        const next = { ...prev };
        regels.forEach((t) => {
          if (!next[t]) next[t] = legeIntake(t);
        });
        return next;
      });
    };
    reader.readAsText(file);
  }

  function updateIntake(titel, veld, waarde) {
    setIntakes((prev) => ({
      ...prev,
      [titel]: { ...prev[titel], [veld]: waarde },
    }));
  }

  async function genereerProfiel(titel) {
    setGenerating((g) => ({ ...g, [titel]: true }));
    try {
      const input = intakes[titel];
      const result = await generateFunctieprofiel(input);
      setProfielen((p) => ({ ...p, [titel]: result }));
      setGoedgekeurd((g) => ({ ...g, [titel]: {} }));
    } finally {
      setGenerating((g) => ({ ...g, [titel]: false }));
    }
  }

  async function regenereerSectie(sectionKey, sectionLabel) {
    const titel = huidigeReviewId;
    if (!titel) return;
    setRegenerating(sectionKey);
    try {
      const input = intakes[titel];
      const result = await regenerateSection(input, sectionKey, sectionLabel);
      setProfielen((p) => {
        const current = { ...p[titel] };
        if (sectionKey === "vereisten") {
          return {
            ...p,
            [titel]: {
              ...current,
              vereistOpleiding: result.vereistOpleiding ?? current.vereistOpleiding,
              vereistWerkervaring: result.vereistWerkervaring ?? current.vereistWerkervaring,
            },
          };
        }
        return { ...p, [titel]: { ...current, [sectionKey]: result } };
      });
      setGoedgekeurd((g) => ({
        ...g,
        [titel]: { ...(g[titel] || {}), [sectionKey]: false },
      }));
    } finally {
      setRegenerating(null);
    }
  }

  function startBewerken(sectionKey) {
    setBewerktSectie(sectionKey);
    setBewerkTekst(sectieWaarde(huidigProfiel, sectionKey));
  }

  function slaBewerkingOp() {
    if (!huidigeReviewId || !bewerktSectie) return;
    setProfielen((p) => ({
      ...p,
      [huidigeReviewId]: parseSectieInput(bewerktSectie, bewerkTekst, p[huidigeReviewId]),
    }));
    setBewerktSectie(null);
    setGoedgekeurd((g) => ({
      ...g,
      [huidigeReviewId]: { ...(g[huidigeReviewId] || {}), [bewerktSectie]: false },
    }));
  }

  function keurSectieGoed(sectionKey) {
    setGoedgekeurd((g) => ({
      ...g,
      [huidigeReviewId]: { ...(g[huidigeReviewId] || {}), [sectionKey]: true },
    }));
  }

  function stelVast() {
    const titel = huidigeReviewId;
    const entry = {
      id: `${Date.now()}-${titel}`,
      functietitel: titel,
      functiegroepId: 1,
      functiegroepNaam: "Assurantieadviseur",
      aangemaaktOp: new Date().toISOString(),
      profiel: profielen[titel],
      organisatienaam,
      primairKleur,
      logoDataURL,
      aiGenerated: true,
    };
    saveFunctieprofiel(entry);
    setVastgesteld((v) => ({ ...v, [titel]: true }));
  }

  async function downloadPdf() {
    await generateFunctieprofielPDF({
      profiel: huidigProfiel,
      organisatienaam,
      logoDataURL,
      primairKleur: primairKleur || "#1B2E4B",
    });
  }

  return (
    <div className="pagina">
      <TopNav />
      <main className="inhoud mx-auto max-w-3xl">
        <nav className="text-sm text-navy/60">
          <Link to="/resultaten" className="hover:text-amber">
            Resultaten
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Functieprofiel wizard</span>
        </nav>

        <h1 className="mt-4 text-xl font-bold text-navy md:text-2xl">
          Functieprofiel genereren
        </h1>

        <div className="mt-6 flex gap-2">
          {STAPPEN.map((label, i) => (
            <div
              key={label}
              className={`flex-1 rounded-lg px-2 py-2 text-center text-xs font-medium md:text-sm ${
                stap === i + 1
                  ? "bg-navy text-white"
                  : stap > i + 1
                    ? "bg-amber/20 text-navy"
                    : "bg-achtergrond text-navy/50"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {stap === 1 && (
          <div className="kaart mt-6 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-navy">Huisstijl instellen</h2>
            <p className="mt-1 text-sm text-navy/60">
              Het gegenereerde document wordt opgemaakt in de huisstijl van jullie organisatie.
            </p>

            <div className="mt-4">
              <label className="text-sm font-medium text-navy">Organisatienaam</label>
              <input
                value={organisatienaam}
                onChange={(e) => setOrganisatienaam(e.target.value)}
                className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-navy">Logo uploaden</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,.png,.jpg,.jpeg,.svg"
                onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                className="mt-1 w-full text-sm"
              />
              {logoDataURL && (
                <img src={logoDataURL} alt="Logo preview" className="mt-3 h-16 object-contain" />
              )}
            </div>

            {(primairKleur || kleurHandmatig) && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div
                  className="h-10 w-10 rounded border border-navy/20"
                  style={{ backgroundColor: primairKleur || "#1B2E4B" }}
                />
                <span className="text-sm text-navy">
                  Gedetecteerde primaire kleur: {primairKleur || "#1B2E4B"}
                </span>
                <input
                  type="color"
                  value={primairKleur || "#1B2E4B"}
                  onChange={(e) => {
                    setPrimairKleur(e.target.value);
                    setKleurHandmatig(true);
                  }}
                  className="h-10 w-14 cursor-pointer"
                />
              </div>
            )}

            {!logoDataURL && (
              <div className="mt-4">
                <label className="text-sm text-navy/70">Of kies handmatig een primaire kleur</label>
                <input
                  type="color"
                  value={primairKleur || "#1B2E4B"}
                  onChange={(e) => {
                    setPrimairKleur(e.target.value);
                    setKleurHandmatig(true);
                  }}
                  className="mt-1 h-10 w-14 cursor-pointer"
                />
              </div>
            )}

            <button
              type="button"
              disabled={!stap1Klaar}
              onClick={() => setStap(2)}
              className="mt-6 min-h-11 rounded bg-navy px-6 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Volgende stap
            </button>
          </div>
        )}

        {stap === 2 && (
          <div className="kaart mt-6 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-navy">Welke functies wil je beschrijven?</h2>

            <div className="mt-4 flex gap-2">
              <input
                value={nieuweFunctie}
                onChange={(e) => setNieuweFunctie(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && voegFunctieToe()}
                placeholder="Functietitel..."
                className="min-h-11 flex-1 rounded border border-navy/20 px-3 py-2"
              />
              <button
                type="button"
                onClick={voegFunctieToe}
                className="min-h-11 rounded bg-navy px-4 py-2 text-sm text-white"
              >
                Voeg toe
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {functies.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-2 rounded-full bg-achtergrond px-3 py-1 text-sm text-navy"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => verwijderFunctie(f)}
                    className="text-navy/50 hover:text-[#DC2626]"
                    aria-label={`Verwijder ${f}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded border-2 border-navy/30 px-4 py-2 text-sm font-medium text-navy">
              Importeer via CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  handleCsvImport(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>

            <p className="mt-4 text-sm text-navy/70">
              Je gaat {functies.length} functieprofiel{functies.length !== 1 ? "en" : ""} aanmaken.
            </p>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStap(1)} className="min-h-11 rounded bg-gray-200 px-4 py-2 text-sm">
                Terug
              </button>
              <button
                type="button"
                disabled={functies.length === 0}
                onClick={() => {
                  setActieveFunctie(0);
                  setStap(3);
                }}
                className="min-h-11 rounded bg-navy px-6 py-2 text-sm text-white disabled:opacity-40"
              >
                Volgende stap
              </button>
            </div>
          </div>
        )}

        {stap === 3 && functieIds.length > 0 && (
          <div className="kaart mt-6 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-navy">Intake per functie</h2>

            <div className="mt-4 flex flex-wrap gap-2 border-b border-navy/10 pb-3">
              {functieIds.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActieveFunctie(i)}
                  className={`min-h-11 rounded-full px-4 py-1 text-sm ${
                    actieveFunctie === i ? "bg-navy text-white" : "bg-achtergrond text-navy"
                  }`}
                >
                  {id}
                  {profielen[id] && " ✓"}
                </button>
              ))}
            </div>

            {(() => {
              const titel = functieIds[actieveFunctie];
              const intake = intakes[titel] || legeIntake(titel);
              return (
                <div className="mt-4 space-y-3">
                  {[
                    ["functietitel", "Functietitel", "text"],
                    ["afdeling", "Afdeling", "text"],
                    ["rapporteertAan", "Rapporteert aan", "text"],
                    ["geeftLeidingAan", "Geeft leiding aan (optioneel)", "text"],
                  ].map(([veld, label]) => (
                    <div key={veld}>
                      <label className="text-sm text-navy/70">{label}</label>
                      <input
                        value={intake[veld]}
                        onChange={(e) => updateIntake(titel, veld, e.target.value)}
                        className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm text-navy/70">
                      Beschrijf in 1-2 zinnen wat deze persoon doet
                    </label>
                    <textarea
                      value={intake.omschrijving}
                      maxLength={300}
                      rows={3}
                      onChange={(e) => updateIntake(titel, "omschrijving", e.target.value)}
                      className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                    />
                    <p className="text-xs text-navy/40">{intake.omschrijving.length}/300</p>
                  </div>
                  <div>
                    <label className="text-sm text-navy/70">Niveau</label>
                    <select
                      value={intake.niveau}
                      onChange={(e) => updateIntake(titel, "niveau", e.target.value)}
                      className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                    >
                      {NIVEAUS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-navy/70">Vereiste opleiding (optioneel)</label>
                      <input
                        value={intake.vereistOpleiding}
                        onChange={(e) => updateIntake(titel, "vereistOpleiding", e.target.value)}
                        className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-navy/70">Vereiste werkervaring (jaren)</label>
                      <input
                        type="number"
                        min="0"
                        value={intake.vereistWerkervaring}
                        onChange={(e) => updateIntake(titel, "vereistWerkervaring", e.target.value)}
                        className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={generating[titel]}
                    onClick={() => genereerProfiel(titel)}
                    className="min-h-11 rounded bg-amber px-6 py-2 text-sm font-semibold text-navy disabled:opacity-50"
                  >
                    {generating[titel] ? "AI genereert functieprofiel..." : "Genereer functieprofiel"}
                  </button>
                </div>
              );
            })()}

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStap(2)} className="min-h-11 rounded bg-gray-200 px-4 py-2 text-sm">
                Terug
              </button>
              <button
                type="button"
                disabled={!alleGegenereerd}
                onClick={() => {
                  setReviewFunctie(0);
                  setStap(4);
                }}
                className="min-h-11 rounded bg-navy px-6 py-2 text-sm text-white disabled:opacity-40"
              >
                Volgende stap
              </button>
            </div>
          </div>
        )}

        {stap === 4 && huidigProfiel && (
          <div className="kaart mt-6 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-navy">Review functieprofiel</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {functieIds.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setReviewFunctie(i)}
                  className={`min-h-11 rounded-full px-4 py-1 text-sm ${
                    reviewFunctie === i ? "bg-navy text-white" : "bg-achtergrond text-navy"
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {REVIEW_SECTIES.map((section) => (
                <div key={section.key} className="rounded-lg border border-navy/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-navy">{section.label}</h3>
                    {huidigeGoedkeuring[section.key] && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Goedgekeurd
                      </span>
                    )}
                  </div>

                  {bewerktSectie === section.key ? (
                    <textarea
                      value={bewerkTekst}
                      onChange={(e) => setBewerkTekst(e.target.value)}
                      rows={5}
                      className="mt-2 w-full rounded border border-navy/20 px-3 py-2 text-sm"
                    />
                  ) : (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy/70">
                      {section.type === "list"
                        ? (huidigProfiel[section.key] || []).map((item) => `• ${item}`).join("\n")
                        : sectieWaarde(huidigProfiel, section.key)}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {bewerktSectie === section.key ? (
                      <>
                        <button
                          type="button"
                          onClick={slaBewerkingOp}
                          className="rounded bg-navy px-3 py-1.5 text-xs text-white"
                        >
                          Opslaan
                        </button>
                        <button
                          type="button"
                          onClick={() => setBewerktSectie(null)}
                          className="rounded bg-gray-200 px-3 py-1.5 text-xs text-navy"
                        >
                          Annuleer
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startBewerken(section.key)}
                          className="rounded bg-navy/10 px-3 py-1.5 text-xs text-navy"
                        >
                          Bewerk
                        </button>
                        <button
                          type="button"
                          disabled={regenerating === section.key}
                          onClick={() => regenereerSectie(section.key, section.label)}
                          className="rounded bg-amber/20 px-3 py-1.5 text-xs text-navy disabled:opacity-50"
                        >
                          {regenerating === section.key ? "Regenereren..." : "Regenereer sectie"}
                        </button>
                        {!huidigeGoedkeuring[section.key] && (
                          <button
                            type="button"
                            onClick={() => keurSectieGoed(section.key)}
                            className="rounded bg-green-600 px-3 py-1.5 text-xs text-white"
                          >
                            Goedkeuren
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm font-medium text-navy">
              {goedgekeurdCount} van {REVIEW_SECTIES.length} secties goedgekeurd
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!alleSectiesGoedgekeurd || vastgesteld[huidigeReviewId]}
                onClick={stelVast}
                className="min-h-11 rounded bg-navy px-6 py-2 text-sm text-white disabled:opacity-40"
              >
                {vastgesteld[huidigeReviewId] ? "Vastgesteld ✓" : "Stel functieprofiel vast"}
              </button>
              {vastgesteld[huidigeReviewId] && (
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="min-h-11 rounded bg-amber px-6 py-2 text-sm font-semibold text-navy"
                >
                  Download als PDF
                </button>
              )}
            </div>

            <button type="button" onClick={() => setStap(3)} className="mt-4 text-sm text-navy/60 hover:text-navy">
              ← Terug naar intake
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
