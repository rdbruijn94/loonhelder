export const competentieNamen = [
  "Klantgerichtheid",
  "Productkennis",
  "Communicatie",
  "Probleemoplossend vermogen",
  "Samenwerking",
];

export function getFunctieprofiel(niveau = "Medior") {
  const titels = {
    Junior: "Junior Assurantieadviseur",
    Medior: "Medior Assurantieadviseur",
    Senior: "Senior Assurantieadviseur",
  };

  const ervaring = {
    Junior: "0–2 jaar",
    Medior: "minimaal 2 jaar",
    Senior: "minimaal 5 jaar",
  };

  return {
    functietitel: titels[niveau] || titels.Medior,
    afdeling: "Particulieren",
    rapporteertAan: "Teamleider Assurantie",
    doel:
      "Als Assurantieadviseur ben je het eerste aanspreekpunt voor particuliere klanten en adviseer je hen over passende verzekeringsoplossingen. Je combineert commercieel inzicht met vakkennis om klanten optimaal te bedienen en te behouden.",
    taken: [
      "Adviseren van klanten over verzekeringsproducten op maat",
      "Opstellen en beheren van polissen en offertes",
      "Behandelen van schademeldingen en poliswijzigingen",
      "Onderhouden van klantrelaties en proactief contact onderhouden",
      "Bijdragen aan het behalen van teamdoelstellingen",
      "Bijhouden van klantdossiers en naleven van compliance-eisen",
    ],
    opleiding: "MBO4 of HBO Financiële Dienstverlening",
    ervaring: ervaring[niveau] || ervaring.Medior,
    competenties: competentieNamen,
  };
}
