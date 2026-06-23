export const SCAN_STORAGE_KEY = "loonhelder_scan";

export const modules = [
  { id: 1, naam: "Organisatie" },
  { id: 2, naam: "Salarisstructuur" },
  { id: 3, naam: "Functieclassificatie" },
  { id: 4, naam: "Genderverdeling" },
  { id: 5, naam: "Werving" },
  { id: 6, naam: "Medewerkerrechten" },
];

export const vragen = [
  {
    id: 1,
    moduleId: 1,
    titel: "Hoeveel medewerkers heeft jullie organisatie?",
    subtitel:
      "De omvang van uw organisatie bepaalt welke transparantie-eisen van toepassing zijn.",
    opties: [
      "Minder dan 50",
      "50 tot 99",
      "100 tot 249",
      "250 of meer",
    ],
    tip: "Organisaties met meer dan 250 medewerkers vallen onder striktere EU-transparantie-eisen.",
  },
  {
    id: 2,
    moduleId: 1,
    titel: "Is er een cao van toepassing?",
    subtitel:
      "Een cao vormt vaak de basis voor salarisbanden en functie-indeling.",
    opties: [
      "Ja sectorale cao",
      "Ja ondernemingscao",
      "Nee",
      "Weet ik niet",
    ],
    tip: "Documenteer welke cao van toepassing is en hoe salarisbanden daaraan gekoppeld zijn.",
  },
  {
    id: 3,
    moduleId: 2,
    titel: "Werkt jullie organisatie met vaste salarisschalen?",
    subtitel:
      "Gedocumenteerde salarisschalen zijn essentieel voor loontransparantie en compliance.",
    opties: [
      "Ja gedocumenteerd",
      "Gedeeltelijk",
      "Nee",
      "We zijn ermee bezig",
    ],
    tip: "Publiceer salarisbanden intern zodat medewerkers weten waar zij staan.",
  },
  {
    id: 4,
    moduleId: 2,
    titel: "Op basis waarvan wordt een startsalaris bepaald?",
    subtitel:
      "Een heldere startsalarismethodiek voorkomt willekeur en loonkloof.",
    opties: [
      "Vaste salarisschaal",
      "Marktinformatie",
      "Onderhandeling",
      "Combinatie",
    ],
    tip: "Koppel startsalarissen altijd aan een objectieve schaal of functiewaardering.",
  },
  {
    id: 5,
    moduleId: 3,
    titel: "Heeft jullie organisatie actuele functiebeschrijvingen?",
    subtitel:
      "Actuele functiebeschrijvingen zijn de basis voor eerlijke beloning en functiewaardering.",
    opties: [
      "Ja voor alle functies",
      "Ja maar niet allemaal",
      "Verouderd of onvolledig",
      "Nee",
    ],
    tip: "Werk functiebeschrijvingen minimaal eens per twee jaar bij.",
  },
  {
    id: 6,
    moduleId: 3,
    titel: "Gebruikt jullie organisatie een functiewaarderingssysteem?",
    subtitel:
      "Een functiewaarderingssysteem maakt beloning objectief vergelijkbaar.",
    opties: [
      "Ja Hay ORBA of vergelijkbaar",
      "Nee maar willen dit invoeren",
      "Nee en niet gepland",
      "Weet ik niet",
    ],
    tip: "Hay, ORBA of Mercer zijn gangbare systemen in Nederland.",
  },
  {
    id: 7,
    moduleId: 4,
    titel: "Heeft jullie organisatie inzicht in de loonkloof?",
    subtitel:
      "Inzicht in de loonkloof is wettelijk verplicht en essentieel voor gelijke beloning.",
    opties: [
      "Ja periodiek gemeten",
      "Globaal inzicht",
      "Nee",
      "Niet relevant",
    ],
    tip: "Meet de loonkloof minimaal jaarlijks en rapporteer de resultaten aan het management.",
  },
  {
    id: 8,
    moduleId: 5,
    titel: "Vermelden jullie salarisinfo in vacatures?",
    subtitel:
      "Salaristransparantie in vacatures trekt de juiste kandidaten en voorkomt loonkloof.",
    opties: [
      "Ja altijd",
      "Soms",
      "Nee nooit",
      "We zijn dit aan het invoeren",
    ],
    tip: "Vanaf 2026 gelden strengere eisen voor salarisvermelding in vacatures.",
  },
  {
    id: 9,
    moduleId: 5,
    titel: "Worden kandidaten gevraagd naar hun huidige salaris?",
    subtitel:
      "Vragen naar huidig salaris versterkt bestaande loonkloven bij indiensttreding.",
    opties: [
      "Nee nooit",
      "Soms",
      "Ja standaard",
      "Geen beleid",
    ],
    tip: "Stel een beleid op waarin salarisvragen aan kandidaten expliciet verboden zijn.",
  },
  {
    id: 10,
    moduleId: 6,
    titel: "Weten medewerkers op basis waarvan hun salaris is bepaald?",
    subtitel:
      "Medewerkers hebben recht op inzicht in hoe hun beloning tot stand komt.",
    opties: [
      "Ja transparant",
      "Gedeeltelijk",
      "Nee",
      "Weet ik niet",
    ],
    tip: "Bied medewerkers toegang tot hun functiegroep, schaal en salarisband.",
  },
  {
    id: 11,
    moduleId: 6,
    titel: "Is er een intern proces voor vragen over beloning?",
    subtitel:
      "Een formeel proces geeft medewerkers vertrouwen om salarisvragen te stellen.",
    opties: [
      "Ja formeel proces",
      "Informeel",
      "Nee",
      "We zijn dit aan het opzetten",
    ],
    tip: "Wijs een aanspreekpunt aan voor vragen over beloning en loontransparantie.",
  },
];
