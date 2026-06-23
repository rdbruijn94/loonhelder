import { getFunctieprofiel } from "../data/functieprofiel";
import { generateFunctieprofielPDF } from "../utils/generatePDF";

export default function FunctieprofielSectie({ niveau = "Medior" }) {
  const profiel = getFunctieprofiel(niveau);

  return (
    <section className="kaart p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-base font-semibold text-navy md:text-lg">Functieprofiel</h2>
        <button
          type="button"
          onClick={() => generateFunctieprofielPDF(profiel)}
          className="min-h-11 rounded bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy/90"
        >
          Download functieprofiel als PDF
        </button>
      </div>

      <div className="mt-4 space-y-4 text-sm text-navy/80">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-navy/50">Functietitel</p>
            <p className="font-medium text-navy">{profiel.functietitel}</p>
          </div>
          <div>
            <p className="text-xs text-navy/50">Afdeling</p>
            <p className="font-medium text-navy">{profiel.afdeling}</p>
          </div>
          <div>
            <p className="text-xs text-navy/50">Rapporteert aan</p>
            <p className="font-medium text-navy">{profiel.rapporteertAan}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-navy/50">Doel van de functie</p>
          <p className="mt-1 leading-relaxed">{profiel.doel}</p>
        </div>

        <div>
          <p className="text-xs text-navy/50">Taken en verantwoordelijkheden</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {profiel.taken.map((taak) => (
              <li key={taak}>{taak}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-navy/50">Vereiste opleiding</p>
            <p className="font-medium text-navy">{profiel.opleiding}</p>
          </div>
          <div>
            <p className="text-xs text-navy/50">Vereiste ervaring</p>
            <p className="font-medium text-navy">{profiel.ervaring}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-navy/50">Competenties</p>
          <p className="mt-1">
            Zie competentiehandboek: {profiel.competenties.join(", ")}
          </p>
        </div>
      </div>
    </section>
  );
}
