import { Navigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import {
  functiegroepen,
  gemiddeldeNiveau,
  getIngelogdeGebruiker,
  salarisPositieInSchaal,
} from "../data/mockdata";

export default function MijnProfiel() {
  const gebruiker = getIngelogdeGebruiker();

  if (!gebruiker || gebruiker.rol !== "medewerker") {
    return <Navigate to="/login" replace />;
  }

  const groep = functiegroepen.find((g) => g.id === gebruiker.functiegroepId);
  const niveau = groep?.niveaus.find((n) => n.id === gebruiker.niveau);
  const schaal = niveau?.schaal;
  const positie = schaal ? salarisPositieInSchaal(gebruiker.salaris, schaal) : 0;
  const collegaGemiddelde = niveau ? gemiddeldeNiveau(niveau) : 0;
  const verschil = gebruiker.salaris - collegaGemiddelde;

  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Mijn profiel</h1>
        <p className="mt-1 text-navy/60">
          Uw persoonlijke salarisinformatie en vergelijking met collega's
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-1">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white">
              {gebruiker.voornaam[0]}
              {gebruiker.achternaam[0]}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-navy">
              {gebruiker.voornaam} {gebruiker.achternaam}
            </h2>
            <p className="text-sm text-navy/60">{gebruiker.email}</p>
            <p className="mt-3 font-medium text-navy">{gebruiker.functie}</p>
            <p className="mt-1 text-sm text-navy/50">{gebruiker.afdeling}</p>
          </div>

          <div className="rounded-lg bg-navy p-6 text-white shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold">Uw salaris</h2>
            <p className="mt-1 text-sm text-white/60">Bruto maandsalaris</p>
            <p className="mt-2 text-3xl font-bold text-amber">
              {formatter.format(gebruiker.salaris)}
            </p>
          </div>
        </div>

        {schaal && (
          <section className="mt-8 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy">Positie in salarisband</h2>
            <p className="mt-1 text-sm text-navy/60">
              {niveau.naam} Assurantieadviseur · schaal{" "}
              {formatter.format(schaal.min)} – {formatter.format(schaal.max)}
            </p>

            <div className="relative mt-6">
              <div className="h-10 rounded-lg bg-achtergrond">
                <div
                  className="absolute top-0 h-10 rounded-lg bg-vrouw/30"
                  style={{ left: 0, right: 0 }}
                />
                <div
                  className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded bg-navy"
                  style={{ left: `${positie}%`, marginLeft: "-2px" }}
                />
                <div
                  className="absolute -top-8 -translate-x-1/2 rounded bg-navy px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ left: `${positie}%` }}
                >
                  {formatter.format(gebruiker.salaris)}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-navy/50">
                <span>{formatter.format(schaal.min)}</span>
                <span>{formatter.format(schaal.max)}</span>
              </div>
            </div>
          </section>
        )}

        {niveau && (
          <section className="mt-8 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy">
              Vergelijking met collega's
            </h2>
            <p className="mt-1 text-sm text-navy/60">
              Anoniem gemiddelde van {niveau.man.aantal + niveau.vrouw.aantal} collega's
              op hetzelfde niveau ({niveau.naam})
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded bg-achtergrond p-4">
                <p className="text-sm text-navy/60">Gemiddelde collega's</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {formatter.format(collegaGemiddelde)}
                </p>
              </div>
              <div className="rounded bg-achtergrond p-4">
                <p className="text-sm text-navy/60">Verschil met gemiddelde</p>
                <p
                  className={`mt-1 text-xl font-bold ${
                    verschil >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {verschil >= 0 ? "+" : ""}
                  {formatter.format(verschil)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-navy/40">
              Individuele salarisgegevens van collega's worden niet getoond. Alleen
              geaggregeerde en anonieme gemiddelden zijn zichtbaar.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
