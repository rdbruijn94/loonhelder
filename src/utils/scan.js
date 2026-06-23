import { SCAN_STORAGE_KEY } from "../data/onboarding";

export function getScanAntwoorden() {
  try {
    return JSON.parse(localStorage.getItem(SCAN_STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveScanAntwoorden(antwoorden) {
  localStorage.setItem(SCAN_STORAGE_KEY, JSON.stringify(antwoorden));
}

function scoreSalarisschalen(antwoord) {
  if (antwoord === "Ja gedocumenteerd") return "groen";
  if (antwoord === "Gedeeltelijk" || antwoord === "We zijn ermee bezig") return "oranje";
  return "rood";
}

function scoreFunctiebeschrijvingen(antwoord) {
  if (antwoord === "Ja voor alle functies") return "groen";
  if (antwoord === "Ja maar niet allemaal" || antwoord === "Verouderd of onvolledig")
    return "oranje";
  return "rood";
}

function scoreSalarisVacatures(antwoord) {
  if (antwoord === "Ja altijd") return "groen";
  if (antwoord === "Soms" || antwoord === "We zijn dit aan het invoeren") return "oranje";
  return "rood";
}

function scoreLoonkloof(antwoord) {
  if (antwoord === "Ja periodiek gemeten") return "groen";
  if (antwoord === "Globaal inzicht" || antwoord === "Niet relevant") return "oranje";
  return "rood";
}

function scoreKandidaatSalaris(antwoord) {
  if (antwoord === "Nee nooit") return "groen";
  if (antwoord === "Soms" || antwoord === "Geen beleid") return "oranje";
  return "rood";
}

function scoreMedewerkerInfo(antwoord) {
  if (antwoord === "Ja transparant") return "groen";
  if (antwoord === "Gedeeltelijk" || antwoord === "Weet ik niet") return "oranje";
  return "rood";
}

export function berekenRapport(antwoorden) {
  const onderdelen = [
    {
      id: "salarisschalen",
      naam: "Salarisschalen",
      status: scoreSalarisschalen(antwoorden[3]),
      actieRood: "Genereer met AI",
      actieOranje: "Verbeter met AI",
    },
    {
      id: "functiebeschrijvingen",
      naam: "Functiebeschrijvingen",
      status: scoreFunctiebeschrijvingen(antwoorden[5]),
      actieRood: "Genereer met AI",
      actieOranje: "Verbeter met AI",
    },
    {
      id: "salaris-vacatures",
      naam: "Salaris in vacatures",
      status: scoreSalarisVacatures(antwoorden[8]),
      actieRood: "Genereer met AI",
      actieOranje: "Verbeter met AI",
    },
    {
      id: "loonkloof-meting",
      naam: "Loonkloof meting",
      status: scoreLoonkloof(antwoorden[7]),
      actieRood: "Genereer met AI",
      actieOranje: "Verbeter met AI",
    },
    {
      id: "kandidaat-salaris",
      naam: "Kandidaten vragen naar salaris",
      status: scoreKandidaatSalaris(antwoorden[9]),
      actieRood: "Genereer met AI",
      actieOranje: "Verbeter met AI",
    },
    {
      id: "medewerker-info",
      naam: "Medewerker informatie",
      status: scoreMedewerkerInfo(antwoorden[10]),
      actieRood: "Genereer met AI",
      actieOranje: "Verbeter met AI",
    },
  ];

  const telling = onderdelen.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { rood: 0, oranje: 0, groen: 0 }
  );

  return { onderdelen, telling };
}
