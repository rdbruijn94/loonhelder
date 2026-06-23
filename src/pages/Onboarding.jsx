import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { modules, vragen } from "../data/onboarding";
import { saveScanAntwoorden } from "../utils/scan";

export default function Onboarding() {
  const navigate = useNavigate();
  const [stap, setStap] = useState(0);
  const [antwoorden, setAntwoorden] = useState({});

  const vraag = vragen[stap];
  const huidigAntwoord = antwoorden[vraag.id];
  const moduleVoltooid = (moduleId) =>
    vragen.filter((v) => v.moduleId === moduleId).every((v) => antwoorden[v.id]);

  function selecteer(optie) {
    setAntwoorden((prev) => ({ ...prev, [vraag.id]: optie }));
  }

  function volgende() {
    if (!huidigAntwoord) return;

    if (stap === vragen.length - 1) {
      saveScanAntwoorden(antwoorden);
      navigate("/resultaten");
      return;
    }

    setStap((s) => s + 1);
  }

  function vorige() {
    if (stap > 0) setStap((s) => s - 1);
  }

  const moduleVragen = vragen.filter((v) => v.moduleId === vraag.moduleId);
  const voortgangModule = moduleVragen.filter((v) => antwoorden[v.id]).length;

  return (
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        <div className="-mx-4 mb-6 overflow-x-auto border-b border-navy/10 px-4 pb-4 md:mx-0 md:mb-8 md:px-0">
          <div className="flex min-w-max gap-4 md:min-w-0 md:flex-wrap md:gap-2">
            {modules.map((mod) => {
              const actief = mod.id === vraag.moduleId;
              const voltooid = moduleVoltooid(mod.id);
              return (
                <span
                  key={mod.id}
                  className={`shrink-0 whitespace-nowrap pb-2 text-xs font-medium md:text-sm ${
                    actief
                      ? "border-b-2 border-amber text-navy"
                      : voltooid
                        ? "border-b-2 border-green-600 text-green-700"
                        : "border-b-2 border-transparent text-navy/40"
                  }`}
                >
                  {mod.naam}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="order-1 lg:col-span-2">
            <p className="text-xs font-medium text-navy/50 md:text-sm">
              Module {vraag.moduleId} · Vraag {stap + 1} van {vragen.length}
            </p>
            <h1 className="mt-2 text-xl font-bold text-navy md:text-2xl">{vraag.titel}</h1>
            <p className="mt-2 text-sm text-navy/60 md:text-base">{vraag.subtitel}</p>

            <div className="mt-6 space-y-3 md:mt-8">
              {vraag.opties.map((optie) => (
                <button
                  key={optie}
                  type="button"
                  onClick={() => selecteer(optie)}
                  className={`kaart flex min-h-[52px] w-full cursor-pointer items-center gap-4 p-4 text-left transition-shadow hover:shadow-sm ${
                    huidigAntwoord === optie ? "ring-2 ring-amber" : ""
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      huidigAntwoord === optie
                        ? "border-amber bg-amber"
                        : "border-navy/30"
                    }`}
                  >
                    {huidigAntwoord === optie && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-navy md:text-base">{optie}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row md:justify-between">
              <button
                type="button"
                onClick={vorige}
                disabled={stap === 0}
                className="min-h-11 w-full rounded border border-navy/20 px-6 py-3 text-sm font-medium text-navy/60 transition-colors hover:text-navy disabled:opacity-40 md:w-auto md:py-2.5"
              >
                Vorige
              </button>
              <button
                type="button"
                onClick={volgende}
                disabled={!huidigAntwoord}
                className="min-h-11 w-full rounded bg-amber px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-amber/90 disabled:opacity-40 md:w-auto md:py-2.5"
              >
                {stap === vragen.length - 1 ? "Bekijk resultaten" : "Volgende"}
              </button>
            </div>
          </div>

          <aside className="order-2 space-y-4 md:space-y-6">
            <div className="kaart p-4 md:p-6">
              <h3 className="font-semibold text-navy">Voortgang module</h3>
              <p className="mt-1 text-sm text-navy/60">
                {modules.find((m) => m.id === vraag.moduleId)?.naam}
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-achtergrond">
                <div
                  className="h-full rounded-full bg-amber transition-all"
                  style={{
                    width: `${(voortgangModule / moduleVragen.length) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-navy/50">
                {voortgangModule} van {moduleVragen.length} vragen beantwoord
              </p>
            </div>

            <div className="kaart p-4 md:p-6">
              <h3 className="font-semibold text-navy">Tip</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">{vraag.tip}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
