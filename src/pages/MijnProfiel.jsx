import TopNav from "../components/TopNav";
import { medewerker } from "../data/mockdata";

const formatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function bandPositie(salaris, band) {
  return ((salaris - band.min) / (band.max - band.min)) * 100;
}

function CompetentieBlokken({ huidigNiveau, vereistNiveau, maximaalNiveau }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: maximaalNiveau }, (_, i) => {
        const niveau = i + 1;
        let klasse = "bg-navy/10";

        if (niveau <= huidigNiveau) {
          klasse = "bg-navy";
        } else if (huidigNiveau < vereistNiveau && niveau <= vereistNiveau) {
          klasse = "bg-amber";
        }

        return (
          <div
            key={niveau}
            className={`h-3 flex-1 rounded-sm ${klasse}`}
            title={`Niveau ${niveau}`}
          />
        );
      })}
    </div>
  );
}

function CompetentieKaart({ comp }) {
  const opNiveau = comp.huidigNiveau >= comp.vereistNiveau;

  return (
    <div className="kaart p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-navy">{comp.naam}</h3>
          <p className="text-xs text-navy/50">{comp.categorie}</p>
        </div>
        {opNiveau ? (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            Op niveau
          </span>
        ) : (
          <span className="rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-medium text-[#DC2626]">
            Ontwikkelpunt · Vereist niveau: {comp.vereistNiveau}
          </span>
        )}
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
}

export default function MijnProfiel() {
  const { salarisBand, gemiddeldVergelijkbaar } = medewerker.niveauData;
  const eigenPositie = bandPositie(medewerker.salaris, salarisBand);
  const gemPositie = bandPositie(gemiddeldVergelijkbaar, salarisBand);

  const ontwikkelpunten = medewerker.competenties.filter(
    (c) => c.huidigNiveau < c.vereistNiveau
  );

  return (
    <div className="pagina">
      <TopNav />

      <main className="inhoud">
        <h1 className="text-xl font-bold text-navy md:text-2xl">Goedemiddag, Lisa</h1>

        <div className="kaart mt-6 w-full p-4 md:mt-8 md:p-6">
          <h2 className="text-base font-semibold text-navy md:text-lg">
            {medewerker.functie}
          </h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy/60">
            <span>Schaal 6-7</span>
            <span>{medewerker.ervaringsjaren} jaar ervaring</span>
            <span>Beoordeling: {medewerker.beoordelingResultaat}</span>
          </div>
        </div>

        <section className="kaart mt-4 w-full p-4 md:mt-6 md:p-6">
          <h2 className="text-base font-semibold text-navy md:text-lg">Jouw salarispositie</h2>
          <p className="mt-1 text-xs text-navy/60 md:text-sm">
            Salarisband {formatter.format(salarisBand.min)} –{" "}
            {formatter.format(salarisBand.max)}
          </p>

          <div className="relative mt-4 sm:mt-10">
            <div className="relative h-3 rounded-full bg-achtergrond">
              <div
                className="absolute -top-7 hidden -translate-x-1/2 whitespace-nowrap text-xs font-medium sm:block"
                style={{ left: `${eigenPositie}%`, color: "#3B7DD8" }}
              >
                Jouw salaris
              </div>
              <div
                className="absolute -top-7 hidden -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-500 sm:block"
                style={{ left: `${gemPositie}%` }}
              >
                Gemiddelde
              </div>
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow md:h-5 md:w-5"
                style={{ left: `${eigenPositie}%`, backgroundColor: "#3B7DD8" }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-400 shadow md:h-5 md:w-5"
                style={{ left: `${gemPositie}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-navy/50 sm:mt-6 md:text-xs">
              <span>{formatter.format(salarisBand.min)}</span>
              <span>{formatter.format(salarisBand.max)}</span>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-xs sm:hidden">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: "#3B7DD8" }}
                />
                <span className="text-navy/70">
                  Jouw salaris: {formatter.format(medewerker.salaris)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-gray-400" />
                <span className="text-navy/70">
                  Gemiddelde: {formatter.format(gemiddeldVergelijkbaar)}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-navy/70">
            Jouw salaris ligt onder het gemiddelde van vergelijkbare collega's. Dit komt
            doordat je op twee competenties nog niet het vereiste niveau hebt bereikt voor
            de middenrange van deze salarisband.
          </p>
        </section>

        <section className="mt-6 md:mt-8">
          <h2 className="text-base font-semibold text-navy md:text-lg">Jouw competenties</h2>
          <p className="mt-1 text-sm text-navy/60">
            Dit zijn de competenties die bepalend zijn voor jouw positie in de salarisband.
          </p>
          <div className="mt-4 space-y-3 md:space-y-4">
            {medewerker.competenties.map((comp) => (
              <CompetentieKaart key={comp.naam} comp={comp} />
            ))}
          </div>
        </section>

        {ontwikkelpunten.length > 0 && (
          <section className="mt-6 md:mt-8">
            <h2 className="text-base font-semibold text-navy md:text-lg">
              Zo groei je naar een hoger salaris
            </h2>
            <div className="mt-4 space-y-3">
              {ontwikkelpunten.map((comp) => (
                <div key={comp.naam} className="kaart p-4 md:p-5">
                  <p className="font-medium text-navy">
                    {comp.naam}: Nu niveau {comp.huidigNiveau} → Vereist niveau{" "}
                    {comp.vereistNiveau}
                  </p>
                  <p className="mt-1 text-sm text-navy/60">{comp.omschrijving}</p>
                </div>
              ))}
            </div>
            <div className="kaart mt-4 p-4 text-sm leading-relaxed text-navy/70 md:p-5">
              Als je Klantgerichtheid ontwikkelt van niveau 2 naar niveau 3 én Productkennis
              van niveau 1 naar niveau 2, kom je in aanmerking voor herziening van je
              salarispositie richting het midden van de band (ca. {formatter.format(3520)}).
            </div>
          </section>
        )}

        <div className="mt-6 rounded-[10px] bg-navy p-6 text-white md:mt-8 md:p-8">
          <h2 className="text-lg font-semibold md:text-xl">Bespreek je ontwikkeling</h2>
          <p className="mt-2 text-sm text-white/70">
            Plan een ontwikkelgesprek met je manager om concrete stappen te maken richting
            niveau 3 op Klantgerichtheid en Productkennis.
          </p>
          <button
            type="button"
            className="mt-6 min-h-11 w-full rounded bg-amber px-6 py-3 text-sm font-semibold text-navy hover:bg-amber/90 md:w-auto md:py-2.5"
          >
            Vraag ontwikkelgesprek aan
          </button>
        </div>
      </main>
    </div>
  );
}
