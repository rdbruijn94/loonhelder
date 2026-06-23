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

const COMPETENTIE_DEFS = [
  {
    naam: "Klantgerichtheid",
    categorie: "Klant",
    omschrijving: "Begrijpt klantvragen en handelt adequaat",
  },
  {
    naam: "Productkennis",
    categorie: "Vakkennis",
    omschrijving: "Kent de verzekeringsproducten en kan deze uitleggen",
  },
  {
    naam: "Communicatie",
    categorie: "Persoonlijk",
    omschrijving: "Communiceert helder en professioneel",
  },
  {
    naam: "Probleemoplossend vermogen",
    categorie: "Persoonlijk",
    omschrijving: "Lost complexe klantvragen zelfstandig op",
  },
  {
    naam: "Samenwerking",
    categorie: "Team",
    omschrijving: "Werkt effectief samen met collega's",
  },
];

const VEREIST_PER_NIVEAU = { Junior: 2, Medior: 3, Senior: 3 };

const SCORE_PROFIELEN = {
  Junior: [2, 1, 2, 1, 3],
  Medior: [2, 2, 3, 2, 4],
  Senior: [4, 4, 4, 4, 3],
};

export function getNiveauBand(niveau) {
  return functiegroepen[0].niveaus.find((n) => n.niveau === niveau)?.salarisBand;
}

export function getGemiddeldNiveau(niveau) {
  const data = functiegroepen[0].niveaus.find((n) => n.niveau === niveau);
  if (!data) return 0;
  const totaal =
    data.man.aantal * data.man.gemiddeld + data.vrouw.aantal * data.vrouw.gemiddeld;
  return Math.round(totaal / (data.man.aantal + data.vrouw.aantal));
}

export function genereerCompetenties(niveau, scores) {
  const vereist = VEREIST_PER_NIVEAU[niveau];
  return COMPETENTIE_DEFS.map((def, i) => ({
    ...def,
    huidigNiveau: scores[i],
    vereistNiveau: vereist,
    maximaalNiveau: 5,
  }));
}

export function gemCompetentieScore(competenties) {
  if (!competenties?.length) return 0;
  const totaal = competenties.reduce((s, c) => s + c.huidigNiveau, 0);
  return Math.round((totaal / competenties.length) * 10) / 10;
}

export const alleMedewerkersBase = [
  { id: 1, naam: "Kevin van der Berg", geslacht: "man", niveau: "Junior", salaris: 2980, ervaringsjaren: 1, beoordelingResultaat: "Goed", startdatum: "2023-03-01" },
  { id: 2, naam: "Daan Hoekstra", geslacht: "man", niveau: "Junior", salaris: 2920, ervaringsjaren: 2, beoordelingResultaat: "Goed", startdatum: "2022-06-15" },
  { id: 3, naam: "Finn Jacobs", geslacht: "man", niveau: "Junior", salaris: 2900, ervaringsjaren: 1, beoordelingResultaat: "Voldoende", startdatum: "2023-09-01" },
  { id: 4, naam: "Lars Mulder", geslacht: "man", niveau: "Junior", salaris: 2900, ervaringsjaren: 2, beoordelingResultaat: "Goed", startdatum: "2022-11-01" },
  { id: 5, naam: "Sophie de Vries", geslacht: "vrouw", niveau: "Junior", salaris: 2720, ervaringsjaren: 1, beoordelingResultaat: "Goed", startdatum: "2023-05-01" },
  { id: 6, naam: "Emma Smit", geslacht: "vrouw", niveau: "Junior", salaris: 2720, ervaringsjaren: 2, beoordelingResultaat: "Voldoende", startdatum: "2022-08-01" },
  { id: 7, naam: "Bram van Dijk", geslacht: "man", niveau: "Medior", salaris: 3620, ervaringsjaren: 5, beoordelingResultaat: "Uitstekend", startdatum: "2019-02-01" },
  { id: 8, naam: "Noah Pietersen", geslacht: "man", niveau: "Medior", salaris: 3580, ervaringsjaren: 4, beoordelingResultaat: "Goed", startdatum: "2020-04-01" },
  { id: 9, naam: "Tim van den Berg", geslacht: "man", niveau: "Medior", salaris: 3560, ervaringsjaren: 4, beoordelingResultaat: "Goed", startdatum: "2020-07-01" },
  { id: 10, naam: "Joris Hendriks", geslacht: "man", niveau: "Medior", salaris: 3540, ervaringsjaren: 3, beoordelingResultaat: "Goed", startdatum: "2021-01-01" },
  { id: 11, naam: "Lisa Jansen", geslacht: "vrouw", niveau: "Medior", salaris: 3460, ervaringsjaren: 3, beoordelingResultaat: "Goed", startdatum: "2021-03-01", email: "medewerker@demo.nl" },
  { id: 12, naam: "Anna Kok", geslacht: "vrouw", niveau: "Medior", salaris: 3460, ervaringsjaren: 4, beoordelingResultaat: "Goed", startdatum: "2020-09-01" },
  { id: 13, naam: "Julia Vermeer", geslacht: "vrouw", niveau: "Medior", salaris: 3460, ervaringsjaren: 3, beoordelingResultaat: "Voldoende", startdatum: "2021-06-01" },
  { id: 14, naam: "Sara Bakker", geslacht: "vrouw", niveau: "Medior", salaris: 3440, ervaringsjaren: 3, beoordelingResultaat: "Goed", startdatum: "2021-08-01" },
  { id: 15, naam: "Thomas Bakker", geslacht: "man", niveau: "Senior", salaris: 4480, ervaringsjaren: 8, beoordelingResultaat: "Uitstekend", startdatum: "2016-01-01" },
  { id: 16, naam: "Mark de Groot", geslacht: "man", niveau: "Senior", salaris: 4480, ervaringsjaren: 7, beoordelingResultaat: "Uitstekend", startdatum: "2017-03-01" },
  { id: 17, naam: "Sandra Visser", geslacht: "vrouw", niveau: "Senior", salaris: 3840, ervaringsjaren: 4, beoordelingResultaat: "Goed", startdatum: "2020-01-01" },
  { id: 18, naam: "Iris van Leeuwen", geslacht: "vrouw", niveau: "Senior", salaris: 3840, ervaringsjaren: 5, beoordelingResultaat: "Goed", startdatum: "2019-06-01" },
];

const CUSTOM_SCORES = {
  1: [2, 2, 2, 1, 3],
  3: [1, 1, 2, 1, 2],
  5: [2, 1, 2, 2, 3],
  6: [1, 1, 2, 1, 3],
  7: [4, 3, 4, 3, 4],
  11: [2, 1, 3, 2, 4],
  13: [2, 2, 3, 2, 3],
  15: [4, 4, 4, 4, 3],
  17: [3, 2, 3, 2, 3],
  18: [3, 3, 3, 3, 3],
};

export const alleMedewerkers = alleMedewerkersBase.map((m) => {
  const scores =
    CUSTOM_SCORES[m.id] ||
    SCORE_PROFIELEN[m.niveau].map((s, i) =>
      Math.min(5, Math.max(1, s + ((m.id + i) % 2 === 0 ? 0 : -1)))
    );
  return {
    ...m,
    functie: `${m.niveau} Assurantieadviseur`,
    competenties: genereerCompetenties(m.niveau, scores),
  };
});

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
  competenties: alleMedewerkers.find((m) => m.id === 11).competenties,
};

export const seniorMedewerkers = [
  {
    id: 1,
    naam: "Thomas Bakker",
    geslacht: "man",
    salaris: 4480,
    ervaringsjaren: 8,
    beoordelingResultaat: "Uitstekend",
    competenties: alleMedewerkers.find((m) => m.id === 15).competenties.map((c) => ({
      naam: c.naam,
      huidigNiveau: c.huidigNiveau,
      vereistNiveau: c.vereistNiveau,
    })),
  },
  {
    id: 2,
    naam: "Sandra Visser",
    geslacht: "vrouw",
    salaris: 3840,
    ervaringsjaren: 4,
    beoordelingResultaat: "Goed",
    competenties: alleMedewerkers.find((m) => m.id === 17).competenties.map((c) => ({
      naam: c.naam,
      huidigNiveau: c.huidigNiveau,
      vereistNiveau: c.vereistNiveau,
    })),
  },
];

export function getMedewerkerById(id) {
  return alleMedewerkers.find((m) => m.id === Number(id));
}

export const gesprekken = [
  { id: 1, medewerkerId: 11, type: "Ontwikkelgesprek", datum: "2024-03-15", samenvatting: "Focus op verbetering Productkennis. Trainingstraject afgesproken voor Q2.", doelen: ["Productcertificering behalen voor juli 2024", "Klantgerichtheid niveau 3 bereiken"] },
  { id: 2, medewerkerId: 11, type: "Doelengesprek", datum: "2024-01-10", samenvatting: "Jaardoelen vastgesteld voor 2024. Goede start van het jaar.", doelen: ["Klanttevredenheid boven 8.0 houden", "10 nieuwe polissen afsluiten in Q1"] },
  ...alleMedewerkersBase.flatMap((m, idx) => {
    if (m.id === 11) return [];
    return [
      {
        id: 100 + m.id * 2,
        medewerkerId: m.id,
        type: "Doelengesprek",
        datum: "2024-01-15",
        samenvatting: `Jaardoelen besproken voor ${m.naam.split(" ")[0]}. Prioriteiten afgestemd op ${m.niveau.toLowerCase()} niveau.`,
        doelen: ["Klanttevredenheid verbeteren", "Competentiedoelen behalen"],
      },
      {
        id: 101 + m.id * 2,
        medewerkerId: m.id,
        type: "Ontwikkelgesprek",
        datum: "2024-06-20",
        samenvatting: `Voortgang besproken. ${m.beoordelingResultaat === "Uitstekend" ? "Sterke prestaties erkend." : "Ontwikkelpunten geïdentificeerd."}`,
        doelen: ["Vakkennis verdiepen", "Samenwerking binnen team versterken"],
      },
    ];
  }),
];

export function getGesprekkenVoorMedewerker(medewerkerId) {
  return gesprekken.filter((g) => g.medewerkerId === Number(medewerkerId));
}
