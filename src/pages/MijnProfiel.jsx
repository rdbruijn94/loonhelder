import TopNav from "../components/TopNav";
import { gebruiker } from "../data/mockdata";

function ProfielVeld({ label, waarde }) {
  return (
    <div className="border-b border-navy/10 py-4">
      <p className="text-sm text-navy/60">{label}</p>
      <p className="mt-0.5 font-medium text-navy">{waarde}</p>
    </div>
  );
}

export default function MijnProfiel() {
  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const geslachtLabel = gebruiker.geslacht === "man" ? "Man" : "Vrouw";
  const geslachtKleur = gebruiker.geslacht === "man" ? "text-man" : "text-vrouw";

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Mijn profiel</h1>
        <p className="mt-1 text-navy/60">Uw persoonlijke gegevens en salarisinformatie</p>

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
            <p className={`mt-2 text-sm font-medium ${geslachtKleur}`}>
              {geslachtLabel}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-navy">Persoonlijke gegevens</h2>
            <div className="mt-2">
              <ProfielVeld label="Afdeling" waarde={gebruiker.afdeling} />
              <ProfielVeld label="Functiegroep" waarde={gebruiker.functiegroep} />
              <ProfielVeld label="Dienstverband" waarde={gebruiker.dienstverband} />
              <ProfielVeld label="FTE" waarde={gebruiker.fte.toFixed(1)} />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-navy p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">Salaris</h2>
          <p className="mt-1 text-sm text-white/60">Bruto maandsalaris</p>
          <p className="mt-2 text-3xl font-bold text-amber">
            {formatter.format(gebruiker.salaris)}
          </p>
        </div>
      </main>
    </div>
  );
}
