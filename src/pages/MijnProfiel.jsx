import TopNav from "../components/TopNav";
import { medewerker } from "../data/mockdata";

function salarisPositie(salaris, band) {
  return ((salaris - band.min) / (band.max - band.min)) * 100;
}

export default function MijnProfiel() {
  const { salarisBand, gemiddeldVergelijkbaar } = medewerker.niveauData;
  const eigenPositie = salarisPositie(medewerker.salaris, salarisBand);
  const gemPositie = salarisPositie(gemiddeldVergelijkbaar, salarisBand);

  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const voornaam = medewerker.naam.split(" ")[0];
  const schaalLabel = "6-7";

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Goedemiddag, {voornaam}</h1>
        <p className="mt-1 text-navy/60">Uw persoonlijke salarisinformatie</p>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy">{medewerker.functie}</h2>
          <p className="mt-1 text-sm text-navy/60">Schaal {schaalLabel}</p>
        </div>

        <section className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy">Salarispositie</h2>
          <p className="mt-1 text-sm text-navy/60">
            Uw positie binnen de salarisband ({formatter.format(salarisBand.min)} –{" "}
            {formatter.format(salarisBand.max)})
          </p>

          <div className="relative mt-8 pb-2">
            <div className="relative h-3 rounded-full bg-achtergrond">
              <div
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-man shadow"
                style={{ left: `${eigenPositie}%` }}
                title={`Jouw salaris: ${formatter.format(medewerker.salaris)}`}
              />
              <div
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-400 shadow"
                style={{ left: `${gemPositie}%` }}
                title={`Gemiddelde collega's: ${formatter.format(gemiddeldVergelijkbaar)}`}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-navy/50">
              <span>{formatter.format(salarisBand.min)}</span>
              <span>{formatter.format(salarisBand.max)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-man" />
              <span className="text-navy/70">
                Jouw salaris: {formatter.format(medewerker.salaris)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-gray-400" />
              <span className="text-navy/70">
                Gemiddelde collega's: {formatter.format(gemiddeldVergelijkbaar)}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-lg border border-navy/10 bg-white p-6 text-sm leading-relaxed text-navy/70 shadow-sm">
          Op basis van jouw functiewaardering en competentieprofiel sta je in de onderste
          helft van de salarisband. Bespreek je groeimogelijkheden in je volgende
          ontwikkelgesprek.
        </div>
      </main>
    </div>
  );
}
