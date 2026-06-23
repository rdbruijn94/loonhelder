import { useState } from "react";
import { competentiehandboek, getHuidigNiveau } from "../data/competentiehandboek";

export default function CompetentiehandboekSectie({ competenties }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="kaart overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-11 w-full items-center justify-between p-4 text-left md:p-6"
        aria-expanded={open}
      >
        <h2 className="text-base font-semibold text-navy md:text-lg">Competentiehandboek</h2>
        <span className="text-xl text-navy/50">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-navy/10 px-4 pb-4 md:px-6 md:pb-6">
          {competentiehandboek.map((comp) => {
            const huidig = getHuidigNiveau(competenties, comp.naam);
            return (
              <div key={comp.naam} className="rounded-lg bg-achtergrond p-4">
                <h3 className="font-semibold text-navy">{comp.naam}</h3>
                <p className="text-xs text-navy/50">{comp.categorie}</p>
                <p className="mt-2 text-sm text-navy/70">{comp.beschrijving}</p>

                <div className="mt-4 space-y-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`rounded px-3 py-2 text-sm ${
                        huidig === n ? "bg-amber/20 font-medium text-navy" : "text-navy/70"
                      }`}
                    >
                      <span className="font-medium">Niveau {n}:</span> {comp.niveaus[n]}
                      {huidig === n && (
                        <span className="ml-2 text-xs text-amber">← Huidige score</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
