import TopNav from "../components/TopNav";
import { salarisOverzicht, recenteWijzigingen, functiegroepen } from "../data/mockdata";

function StatCard({ label, waarde, toelichting }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-navy/60">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy">{waarde}</p>
      {toelichting && (
        <p className="mt-1 text-xs text-navy/50">{toelichting}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="mt-1 text-navy/60">
          Overzicht van salarisgegevens binnen uw organisatie
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Totaal medewerkers"
            waarde={salarisOverzicht.totaalMedewerkers}
          />
          <StatCard
            label="Gemiddeld salaris"
            waarde={formatter.format(salarisOverzicht.gemiddeldSalaris)}
          />
          <StatCard
            label="Mediaan salaris"
            waarde={formatter.format(salarisOverzicht.mediaanSalaris)}
          />
          <StatCard
            label="Loonkloof"
            waarde={`${salarisOverzicht.loonkloofPercentage}%`}
            toelichting="Verschil man/vrouw gemiddeld"
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy">Functiegroepen</h2>
            <ul className="mt-4 divide-y divide-navy/10">
              {functiegroepen.map((groep) => (
                <li key={groep.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy">{groep.naam}</p>
                    <p className="text-sm text-navy/50">
                      {groep.aantalMedewerkers} medewerkers
                    </p>
                  </div>
                  <p className="font-semibold text-navy">
                    {formatter.format(groep.gemiddeldSalaris)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy">Recente wijzigingen</h2>
            <ul className="mt-4 space-y-4">
              {recenteWijzigingen.map((wijziging) => (
                <li key={wijziging.id} className="border-l-2 border-amber pl-4">
                  <p className="text-sm text-navy/50">
                    {new Date(wijziging.datum).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-0.5 text-navy">{wijziging.beschrijving}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
