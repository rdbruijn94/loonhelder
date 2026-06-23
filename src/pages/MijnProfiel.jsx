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

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Goedemiddag, Lisa</h1>
        <p className="mt-1 text-navy/60">Uw persoonlijke salarisinformatie</p>

        <div className="kaart mt-8 p-6">
          <h2 className="text-lg font-semibold text-navy">Medior Assurantieadviseur</h2>
          <p className="mt-1 text-sm text-navy/60">Schaal 6-7</p>
        </div>

        <section className="kaart mt-8 p-6">
          <h2 className="text-lg font-semibold text-navy">Salarispositie</h2>
          <p className="mt-1 text-sm text-navy/60">
            Uw positie binnen de salarisband ({formatter.format(3100)} –{" "}
            {formatter.format(3800)})
          </p>

          <div className="relative mt-10 mb-2">
            <div className="relative h-3 rounded-full bg-achtergrond">
              <div
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `${eigenPositie}%`, backgroundColor: "#3B7DD8" }}
                title={`Jouw salaris: ${formatter.format(3460)}`}
              />
              <div
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-400 shadow"
                style={{ left: `${gemPositie}%` }}
                title={`Gemiddelde collega's: ${formatter.format(3520)}`}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-navy/50">
              <span>{formatter.format(3100)}</span>
              <span>{formatter.format(3800)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: "#3B7DD8" }}
              />
              <span className="text-navy/70">
                Jouw salaris: {formatter.format(3460)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-gray-400" />
              <span className="text-navy/70">
                Gemiddelde collega's: {formatter.format(3520)}
              </span>
            </div>
          </div>
        </section>

        <div className="kaart mt-8 p-6 text-sm leading-relaxed text-navy/70">
          Op basis van jouw functiewaardering sta je in de onderste helft van de
          salarisband. Bespreek je groeimogelijkheden in je volgende ontwikkelgesprek.
        </div>
      </main>
    </div>
  );
}
