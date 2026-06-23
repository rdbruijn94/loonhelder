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

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-wrap gap-2 border-b border-navy/10 pb-4">
          {modules.map((mod) => {
            const actief = mod.id === vraag.moduleId;
            const voltooid = moduleVoltooid(mod.id);
            return (
              <span
                key={mod.id}
                className={`pb-2 text-sm font-medium ${
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

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm font-medium text-navy/50">
              Module {vraag.moduleId} · Vraag {stap + 1} van {vragen.length}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy">{vraag.titel}</h1>
            <p className="mt-2 text-navy/60">{vraag.subtitel}</p>

            <div className="mt-8 space-y-3">
              {vraag.opties.map((optie) => (
                <button
                  key={optie}
                  type="button"
                  onClick={() => selecteer(optie)}
                  className={`kaart flex w-full cursor-pointer items-center gap-4 p-4 text-left transition-shadow hover:shadow-sm ${
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
                  <span className="font-medium text-navy">{optie}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={vorige}
                disabled={stap === 0}
                className="rounded px-6 py-2.5 text-sm font-medium text-navy/60 transition-colors hover:text-navy disabled:opacity-40"
              >
                Vorige
              </button>
              <button
                type="button"
                onClick={volgende}
                disabled={!huidigAntwoord}
                className="rounded bg-amber px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-amber/90 disabled:opacity-40"
              >
                {stap === vragen.length - 1 ? "Bekijk resultaten" : "Volgende"}
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="kaart p-6">
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

            <div className="kaart p-6">
              <h3 className="font-semibold text-navy">Tip</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">{vraag.tip}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
