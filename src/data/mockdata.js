export const gebruiker = {
  id: 1,
  voornaam: "Sanne",
  achternaam: "de Vries",
  email: "sanne.devries@bedrijf.nl",
  functiegroep: "Medisch specialisten",
  salaris: 6850,
  geslacht: "vrouw",
  afdeling: "Cardiologie",
  dienstverband: "Vast",
  fte: 1.0,
};

export const functiegroepen = [
  {
    id: 1,
    naam: "Medisch specialisten",
    gemiddeldSalaris: 7200,
    mediaanSalaris: 6850,
    aantalMedewerkers: 42,
    manGemiddeld: 7450,
    vrouwGemiddeld: 6680,
  },
  {
    id: 2,
    naam: "Verpleegkundigen",
    gemiddeldSalaris: 3850,
    mediaanSalaris: 3720,
    aantalMedewerkers: 128,
    manGemiddeld: 3920,
    vrouwGemiddeld: 3810,
  },
  {
    id: 3,
    naam: "Administratief medewerkers",
    gemiddeldSalaris: 2950,
    mediaanSalaris: 2880,
    aantalMedewerkers: 56,
    manGemiddeld: 3010,
    vrouwGemiddeld: 2890,
  },
  {
    id: 4,
    naam: "IT-specialisten",
    gemiddeldSalaris: 5100,
    mediaanSalaris: 4950,
    aantalMedewerkers: 24,
    manGemiddeld: 5280,
    vrouwGemiddeld: 4720,
  },
];

export const salarisOverzicht = {
  totaalMedewerkers: 250,
  gemiddeldSalaris: 4120,
  mediaanSalaris: 3650,
  loonkloofPercentage: 8.4,
  laatsteUpdate: "2026-03-01",
};

export const recenteWijzigingen = [
  {
    id: 1,
    datum: "2026-02-15",
    beschrijving: "CAO-verhoging toegepast op functiegroep Verpleegkundigen",
    type: "cao",
  },
  {
    id: 2,
    datum: "2026-01-20",
    beschrijving: "Nieuwe medewerker toegevoegd aan afdeling Cardiologie",
    type: "personeel",
  },
  {
    id: 3,
    datum: "2025-12-01",
    beschrijving: "Jaarlijkse salarisindexatie uitgevoerd",
    type: "indexatie",
  },
];
