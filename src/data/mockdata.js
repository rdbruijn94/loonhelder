export const organisatie = {
  naam: "Verzekeraar De Amstel",
  sector: "Verzekeringen",
  medewerkers: 18,
  complianceScore: 61,
  loonkloof: 8.4,
  gemiddeldSalaris: 3840,
};

export const functiegroepen = [
  {
    id: 1,
    naam: "Assurantieadviseur",
    schaal: "5-8",
    niveaus: [
      {
        niveau: "Junior",
        schaal: "5",
        salarisBand: { min: 2600, max: 3100 },
        man: { aantal: 4, gemiddeld: 2920 },
        vrouw: { aantal: 2, gemiddeld: 2720 },
        loonkloof: 6.8,
      },
      {
        niveau: "Medior",
        schaal: "6-7",
        salarisBand: { min: 3100, max: 3800 },
        man: { aantal: 4, gemiddeld: 3580 },
        vrouw: { aantal: 4, gemiddeld: 3460 },
        loonkloof: 3.2,
      },
      {
        niveau: "Senior",
        schaal: "8",
        salarisBand: { min: 3800, max: 4800 },
        man: { aantal: 2, gemiddeld: 4480 },
        vrouw: { aantal: 2, gemiddeld: 3840 },
        loonkloof: 14.2,
      },
    ],
  },
];

export const medewerker = {
  naam: "Lisa Jansen",
  email: "medewerker@demo.nl",
  functie: "Medior Assurantieadviseur",
  salaris: 3460,
  geslacht: "vrouw",
  niveauData: {
    niveau: "Medior",
    salarisBand: { min: 3100, max: 3800 },
    gemiddeldVergelijkbaar: 3520,
  },
};
