import TopNav from "../components/TopNav";
import { functiegroepen, gebruiker } from "../data/mockdata";

export default function Functiegroep() {
  const huidigeGroep = functiegroepen.find(
    (g) => g.naam === gebruiker.functiegroep
  );

  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Functiegroep</h1>
        <p className="mt-1 text-navy/60">
          Salarisvergelijking binnen uw functiegroep
        </p>

        {huidigeGroep && (
          <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy">{huidigeGroep.naam}</h2>
            <p className="mt-1 text-sm text-navy/50">
              Uw functiegroep · {huidigeGroep.aantalMedewerkers} medewerkers
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded bg-achtergrond p-4">
                <p className="text-sm text-navy/60">Gemiddeld salaris</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {formatter.format(huidigeGroep.gemiddeldSalaris)}
                </p>
              </div>
              <div className="rounded bg-achtergrond p-4">
                <p className="text-sm text-navy/60">Mediaan salaris</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {formatter.format(huidigeGroep.mediaanSalaris)}
                </p>
              </div>
              <div className="rounded bg-achtergrond p-4">
                <p className="text-sm text-navy/60">Uw salaris</p>
                <p className="mt-1 text-xl font-bold text-amber">
                  {formatter.format(gebruiker.salaris)}
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-navy">Vergelijking naar geslacht</h2>
          <p className="mt-1 text-sm text-navy/60">
            Gemiddeld bruto maandsalaris per geslacht
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {functiegroepen.map((groep) => (
              <div key={groep.id} className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="font-medium text-navy">{groep.naam}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-man">Man</span>
                    <span className="font-semibold text-man">
                      {formatter.format(groep.manGemiddeld)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-achtergrond">
                    <div
                      className="h-full rounded-full bg-man"
                      style={{
                        width: `${(groep.manGemiddeld / groep.vrouwGemiddeld) * 50}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-vrouw">Vrouw</span>
                    <span className="font-semibold text-vrouw">
                      {formatter.format(groep.vrouwGemiddeld)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-achtergrond">
                    <div
                      className="h-full rounded-full bg-vrouw"
                      style={{
                        width: `${(groep.vrouwGemiddeld / groep.manGemiddeld) * 50}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
