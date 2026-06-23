import TopNav from "../components/TopNav";
import { medewerkers } from "../data/mockdata";

export default function Medewerkers() {
  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen bg-achtergrond">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-navy">Medewerkers</h1>
        <p className="mt-1 text-navy/60">
          Overzicht van medewerkers per functiegroep en niveau
        </p>

        <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy/10 bg-achtergrond">
              <tr>
                <th className="px-6 py-3 font-medium text-navy/60">Medewerker</th>
                <th className="px-6 py-3 font-medium text-navy/60">Functiegroep</th>
                <th className="px-6 py-3 font-medium text-navy/60">Niveau</th>
                <th className="px-6 py-3 font-medium text-navy/60">Geslacht</th>
                <th className="px-6 py-3 font-medium text-navy/60">Salaris</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {medewerkers.map((medewerker, index) => (
                <tr key={medewerker.id}>
                  <td className="px-6 py-4 font-medium text-navy">
                    Medewerker {index + 1}
                  </td>
                  <td className="px-6 py-4 text-navy/70">{medewerker.functiegroep}</td>
                  <td className="px-6 py-4 text-navy/70">{medewerker.niveau}</td>
                  <td
                    className={`px-6 py-4 font-medium ${
                      medewerker.geslacht === "man" ? "text-man" : "text-vrouw"
                    }`}
                  >
                    {medewerker.geslacht === "man" ? "Man" : "Vrouw"}
                  </td>
                  <td className="px-6 py-4 text-navy">
                    {formatter.format(medewerker.salaris)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-navy/40">
          Medewerkers worden anoniem weergegeven. Individuele namen zijn alleen zichtbaar
          in het medewerkerportaal.
        </p>
      </main>
    </div>
  );
}
