export const competentiehandboek = [
  {
    naam: "Klantgerichtheid",
    categorie: "Klant",
    beschrijving:
      "Klantgerichtheid gaat over het begrijpen van klantbehoeften en het leveren van passende service. De medewerker handelt vanuit het perspectief van de klant en streeft naar langdurige tevredenheid.",
    niveaus: {
      1: "Beantwoordt eenvoudige klantvragen correct",
      2: "Begrijpt klantvragen en handelt adequaat zonder hulp",
      3: "Anticipeert op klantbehoeften en lost complexe vragen zelfstandig op",
      4: "Bouwt langdurige klantrelaties en fungeert als vertrouwd adviseur",
      5: "Ontwikkelt klantgerichtheidsstrategie voor de organisatie",
    },
  },
  {
    naam: "Productkennis",
    categorie: "Vakkennis",
    beschrijving:
      "Productkennis omvat de kennis van verzekeringsproducten, voorwaarden en marktontwikkelingen. De medewerker kan producten helder uitleggen en passend adviseren.",
    niveaus: {
      1: "Kent de basisproducten en kan eenvoudige uitleg geven",
      2: "Kent alle standaardproducten en kan vergelijkingen maken",
      3: "Beheerst het volledige productportfolio en adviseert proactief",
      4: "Is expert op complexe producten en ondersteunt collega's",
      5: "Ontwikkelt en evalueert producten in samenwerking met productmanagement",
    },
  },
  {
    naam: "Communicatie",
    categorie: "Persoonlijk",
    beschrijving:
      "Communicatie omvat mondelinge en schriftelijke vaardigheden in contact met klanten en collega's. De medewerker communiceert helder, professioneel en empathisch.",
    niveaus: {
      1: "Communiceert begrijpelijk in standaardsituaties",
      2: "Past communicatiestijl aan op de klant en situatie",
      3: "Communiceert overtuigend en houdt moeilijke gesprekken constructief",
      4: "Fungeert als sparringpartner en geeft constructieve feedback aan collega's",
      5: "Vertegenwoordigt de organisatie extern en traint anderen in communicatie",
    },
  },
  {
    naam: "Probleemoplossend vermogen",
    categorie: "Persoonlijk",
    beschrijving:
      "Probleemoplossend vermogen gaat over het zelfstandig analyseren en oplossen van klant- en werksituaties. De medewerker denkt kritisch en komt met praktische oplossingen.",
    niveaus: {
      1: "Lost eenvoudige problemen op met ondersteuning",
      2: "Lost standaardproblemen zelfstandig op binnen kaders",
      3: "Analyseert complexe situaties en kiest de beste oplossing",
      4: "Lost structurele problemen op en verbetert processen",
      5: "Ontwikkelt oplossingsmethodieken voor de hele organisatie",
    },
  },
  {
    naam: "Samenwerking",
    categorie: "Team",
    beschrijving:
      "Samenwerking omvat effectief samenwerken met collega's en andere afdelingen. De medewerker draagt bij aan een positieve teamcultuur en deelt kennis.",
    niveaus: {
      1: "Werkt mee aan teamtaken en volgt afspraken",
      2: "Werkt actief samen en deelt informatie met collega's",
      3: "Initieert samenwerking en ondersteunt collega's proactief",
      4: "Coördineert teamactiviteiten en bevordert kennisdeling",
      5: "Leidt interdisciplinaire projecten en bouwt bruggen tussen teams",
    },
  },
];

export function getHuidigNiveau(competenties, naam) {
  return competenties.find((c) => c.naam === naam)?.huidigNiveau ?? 0;
}
