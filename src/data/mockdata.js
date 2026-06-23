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
  ervaringsjaren: 3,
  beoordelingResultaat: "Goed",
  niveauData: {
    niveau: "Medior",
    salarisBand: { min: 3100, max: 3800 },
    gemiddeldVergelijkbaar: 3520,
  },
  competenties: [
    {
      naam: "Klantgerichtheid",
      categorie: "Klant",
      huidigNiveau: 2,
      vereistNiveau: 3,
      maximaalNiveau: 5,
      omschrijving: "Begrijpt klantvragen en handelt adequaat",
    },
    {
      naam: "Productkennis",
      categorie: "Vakkennis",
      huidigNiveau: 1,
      vereistNiveau: 2,
      maximaalNiveau: 5,
      omschrijving: "Kent de verzekeringsproducten en kan deze uitleggen",
    },
    {
      naam: "Communicatie",
      categorie: "Persoonlijk",
      huidigNiveau: 3,
      vereistNiveau: 3,
      maximaalNiveau: 5,
      omschrijving: "Communiceert helder en professioneel",
    },
    {
      naam: "Probleemoplossend vermogen",
      categorie: "Persoonlijk",
      huidigNiveau: 2,
      vereistNiveau: 3,
      maximaalNiveau: 5,
      omschrijving: "Lost complexe klantvragen zelfstandig op",
    },
    {
      naam: "Samenwerking",
      categorie: "Team",
      huidigNiveau: 4,
      vereistNiveau: 3,
      maximaalNiveau: 5,
      omschrijving: "Werkt effectief samen met collega's",
    },
  ],
};

export const seniorMedewerkers = [
  {
    id: 1,
    naam: "Thomas Bakker",
    geslacht: "man",
    salaris: 4480,
    ervaringsjaren: 8,
    beoordelingResultaat: "Uitstekend",
    competenties: [
      { naam: "Klantgerichtheid", huidigNiveau: 4, vereistNiveau: 3 },
      { naam: "Productkennis", huidigNiveau: 4, vereistNiveau: 3 },
      { naam: "Communicatie", huidigNiveau: 4, vereistNiveau: 3 },
      { naam: "Probleemoplossend vermogen", huidigNiveau: 4, vereistNiveau: 3 },
      { naam: "Samenwerking", huidigNiveau: 3, vereistNiveau: 3 },
    ],
  },
  {
    id: 2,
    naam: "Sandra Visser",
    geslacht: "vrouw",
    salaris: 3840,
    ervaringsjaren: 4,
    beoordelingResultaat: "Goed",
    competenties: [
      { naam: "Klantgerichtheid", huidigNiveau: 3, vereistNiveau: 3 },
      { naam: "Productkennis", huidigNiveau: 2, vereistNiveau: 3 },
      { naam: "Communicatie", huidigNiveau: 3, vereistNiveau: 3 },
      { naam: "Probleemoplossend vermogen", huidigNiveau: 2, vereistNiveau: 3 },
      { naam: "Samenwerking", huidigNiveau: 3, vereistNiveau: 3 },
    ],
  },
];
