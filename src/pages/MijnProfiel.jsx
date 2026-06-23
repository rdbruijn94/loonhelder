import TopNav from "../components/TopNav";
import { medewerker } from "../data/mockdata";

function bandPositie(salaris, band) {
  return ((salaris - band.min) / (band.max - band.min)) * 100;
}

export default function MijnProfiel() {
  const { salarisBand, gemiddeldVergelijkbaar } = medewerker.niveauData;
  const eigenPositie = bandPositie(medewerker.salaris, salarisBand);
  const gemPositie = bandPositie(gemiddeldVergelijkbaar, salarisBand);

  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        <h1 className="text-xl font-bold text-navy md:text-2xl">Goedemiddag, Lisa</h1>
        <p className="mt-1 text-sm text-navy/60 md:text-base">Uw persoonlijke salarisinformatie</p>

        <div className="kaart mt-6 w-full p-4 md:mt-8 md:p-6">
          <h2 className="text-base font-semibold text-navy md:text-lg">Medior Assurantieadviseur</h2>
          <p className="mt-1 text-sm text-navy/60">Schaal 6-7</p>
        </div>

        <section className="kaart mt-4 w-full p-4 md:mt-8 md:p-6">
          <h2 className="text-base font-semibold text-navy md:text-lg">Salarispositie</h2>
          <p className="mt-1 text-xs text-navy/60 md:text-sm">
            Uw positie binnen de salarisband ({formatter.format(3100)} –{" "}
            {formatter.format(3800)})
          </p>

          <div className="relative mt-8 mb-2 md:mt-10">
            <div className="relative h-3 rounded-full bg-achtergrond">
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow md:h-5 md:w-5"
                style={{ left: `${eigenPositie}%`, backgroundColor: "#3B7DD8" }}
                title={`Jouw salaris: ${formatter.format(3460)}`}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-400 shadow md:h-5 md:w-5"
                style={{ left: `${gemPositie}%` }}
                title={`Gemiddelde collega's: ${formatter.format(3520)}`}
              />
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-navy/50 md:text-xs">
              <span>{formatter.format(3100)}</span>
              <span>{formatter.format(3800)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-xs md:flex-row md:flex-wrap md:gap-6 md:text-sm">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: "#3B7DD8" }}
              />
              <span className="text-navy/70">Jouw salaris: {formatter.format(3460)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-gray-400" />
              <span className="text-navy/70">
                Gemiddelde collega's: {formatter.format(3520)}
              </span>
            </div>
          </div>
        </section>

        <div className="kaart mt-4 w-full p-4 text-sm leading-relaxed text-navy/70 md:mt-8 md:p-6">
          Op basis van jouw functiewaardering sta je in de onderste helft van de
          salarisband. Bespreek je groeimogelijkheden in je volgende ontwikkelgesprek.
        </div>
      </main>
    </div>
  );
}
