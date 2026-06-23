export const accounts = [
  {
    email: "hr@demo.nl",
    wachtwoord: "demo",
    rol: "hr",
    voornaam: "Mark",
    achternaam: "Bakker",
  },
  {
    email: "medewerker@demo.nl",
    wachtwoord: "demo",
    rol: "medewerker",
    voornaam: "Lisa",
    achternaam: "Jansen",
    functie: "Medior Assurantieadviseur",
    niveau: "medior",
    functiegroepId: 1,
    salaris: 3460,
    geslacht: "vrouw",
    afdeling: "Schade",
    dienstverband: "Vast",
    fte: 1.0,
  },
];

export const functiegroepen = [
  {
    id: 1,
    naam: "Assurantieadviseur",
    niveaus: [
      {
        id: "junior",
        naam: "Junior",
        schaal: { min: 2600, max: 3100 },
        man: { aantal: 4, gemiddeldSalaris: 2920 },
        vrouw: { aantal: 2, gemiddeldSalaris: 2720 },
      },
      {
        id: "medior",
        naam: "Medior",
        schaal: { min: 3100, max: 3800 },
        man: { aantal: 4, gemiddeldSalaris: 3580 },
        vrouw: { aantal: 4, gemiddeldSalaris: 3460 },
      },
      {
        id: "senior",
        naam: "Senior",
        schaal: { min: 3800, max: 4800 },
        man: { aantal: 2, gemiddeldSalaris: 4480 },
        vrouw: { aantal: 2, gemiddeldSalaris: 3840 },
      },
    ],
  },
];

export const compliance = {
  totaalMedewerkers: 18,
  gemiddeldeLoonkloof: 8.4,
  aantalFunctiegroepen: 1,
  complianceScore: 61,
  laatsteUpdate: "2026-03-01",
};

export function berekenLoonkloof(manSalaris, vrouwSalaris) {
  if (manSalaris === 0) return 0;
  return Math.round(((manSalaris - vrouwSalaris) / manSalaris) * 1000) / 10;
}

export function loonkloofKleur(percentage) {
  if (percentage < 5) return "groen";
  if (percentage <= 10) return "oranje";
  return "rood";
}

export function salarisPositieInSchaal(salaris, schaal) {
  const range = schaal.max - schaal.min;
  if (range === 0) return 0;
  return Math.min(100, Math.max(0, ((salaris - schaal.min) / range) * 100));
}

export function gemiddeldeNiveau(niveau) {
  const totaal =
    niveau.man.aantal * niveau.man.gemiddeldSalaris +
    niveau.vrouw.aantal * niveau.vrouw.gemiddeldSalaris;
  const aantal = niveau.man.aantal + niveau.vrouw.aantal;
  return Math.round(totaal / aantal);
}

export function getFunctiegroep(id) {
  return functiegroepen.find((g) => g.id === Number(id));
}

export function getIngelogdeGebruiker() {
  const raw = sessionStorage.getItem("loonhelder_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function login(email, wachtwoord) {
  const account = accounts.find(
    (a) => a.email === email && a.wachtwoord === wachtwoord
  );
  if (account) {
    sessionStorage.setItem("loonhelder_user", JSON.stringify(account));
    return account;
  }
  return null;
}

export function logout() {
  sessionStorage.removeItem("loonhelder_user");
}
