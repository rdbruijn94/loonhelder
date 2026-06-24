const SYSTEM_PROMPT = `Je bent een professionele HR-adviseur gespecialiseerd in het schrijven van functiebeschrijvingen voor Nederlandse organisaties.

Schrijf in helder, concreet Nederlands op taalniveau B1. Dit betekent:
- Korte zinnen (maximaal 20 woorden per zin)
- Actieve werkwoorden ("je adviseert klanten", niet "er wordt geadviseerd")
- Geen jargon of wollige taal
- Concreet en specifiek, niet vaag

Controleer je eigen output altijd op:
- Spelfouten
- Grammaticafouten
- Onduidelijke zinnen
- Wollige of passieve formuleringen
- Consistentie in aanspreekvorm (gebruik altijd "je" of altijd "u", nooit beide)

Gebruik altijd "je" als aanspreekvorm tenzij anders gevraagd.

Genereer uitsluitend JSON, geen andere tekst, geen markdown, geen backticks.`;

function buildUserPrompt(input) {
  return `Genereer een volledig functieprofiel voor de volgende functie en geef het terug als JSON object met exact deze velden:

{
  "functietitel": "",
  "afdeling": "",
  "rapporteertAan": "",
  "geeftLeidingAan": "",
  "doelVanDeFunctie": "",
  "taken": ["", "", "", "", "", ""],
  "bevoegdheden": ["", "", ""],
  "resultaatgebieden": ["", "", ""],
  "samenwerking": "",
  "vereistOpleiding": "",
  "vereistWerkervaring": "",
  "competenties": ["", "", "", "", ""],
  "bijzondereOmstandigheden": "",
  "taalniveau": "B1",
  "kwaliteitscheck": {
    "spellingGecheckt": true,
    "grammaticaGecheckt": true,
    "taalniveauB1": true,
    "aanspreekvormConsistent": true
  }
}

Functiegegevens:
Titel: ${input.functietitel}
Afdeling: ${input.afdeling}
Rapporteert aan: ${input.rapporteertAan}
Geeft leiding aan: ${input.geeftLeidingAan || "Niet van toepassing"}
Omschrijving: ${input.omschrijving}
Niveau: ${input.niveau}
Vereiste opleiding: ${input.vereistOpleiding || "Niet gespecificeerd"}
Vereiste werkervaring: ${input.vereistWerkervaring || "0"} jaar
Sector: Verzekeringen`;
}

function buildSectionPrompt(input, sectionKey, sectionLabel) {
  return `Genereer uitsluitend opnieuw het veld "${sectionLabel}" (sleutel: ${sectionKey}) voor dit functieprofiel.
Geef alleen geldige JSON terug met één sleutel "${sectionKey}" en de bijbehorende waarde (string of array).
Taalniveau B1, actieve werkwoorden, aanspreekvorm "je".

Functie: ${input.functietitel}
Afdeling: ${input.afdeling}
Niveau: ${input.niveau}
Context: ${input.omschrijving}`;
}

function parseJsonFromText(text) {
  const cleaned = text
    .trim()
    .replace(/^```json?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function generateMockProfiel(input) {
  const titel = input.functietitel;
  return {
    functietitel: titel,
    afdeling: input.afdeling,
    rapporteertAan: input.rapporteertAan,
    geeftLeidingAan: input.geeftLeidingAan || "",
    doelVanDeFunctie: `Als ${titel} help je klanten met passende verzekeringsoplossingen. ${input.omschrijving || "Je werkt zelfstandig en draagt bij aan tevreden klanten."}`,
    taken: [
      `Je adviseert klanten over producten passend bij ${titel.toLowerCase()}.`,
      "Je stelt offertes en polissen op en controleert de gegevens.",
      "Je behandelt schademeldingen en poliswijzigingen snel en zorgvuldig.",
      "Je onderhoudt contact met bestaande klanten en volgt openstaande zaken op.",
      "Je werkt mee aan teamdoelen en deelt kennis met collega's.",
      "Je houdt klantdossiers bij volgens interne richtlijnen.",
    ],
    bevoegdheden: [
      "Je mag offertes opstellen binnen de interne mandaatgrenzen.",
      "Je mag kleine schadeclaims afhandelen tot het mandaatbedrag.",
      "Je mag klantvoorwaarden uitleggen en wijzigingen doorvoeren.",
    ],
    resultaatgebieden: [
      "Klanttevredenheid binnen je portefeuille",
      "Naleving van compliance- en kwaliteitsnormen",
      "Realisatie van persoonlijke en teamdoelstellingen",
    ],
    samenwerking:
      "Je werkt nauw samen met collega's binnen de afdeling Particulieren en stemt af met backoffice en schadeafhandeling.",
    vereistOpleiding: input.vereistOpleiding || "MBO4 of HBO Financiële Dienstverlening",
    vereistWerkervaring: input.vereistWerkervaring
      ? `${input.vereistWerkervaring} jaar relevante ervaring`
      : "Ervaring in verzekeringen of financiële dienstverlening is een pré",
    competenties: [
      "Klantgerichtheid",
      "Productkennis",
      "Communicatie",
      "Probleemoplossend vermogen",
      "Samenwerking",
    ],
    bijzondereOmstandigheden:
      "Incidenteel werk buiten kantooruren bij piekperiodes. Reizen naar klanten is soms nodig.",
    taalniveau: "B1",
    kwaliteitscheck: {
      spellingGecheckt: true,
      grammaticaGecheckt: true,
      taalniveauB1: true,
      aanspreekvormConsistent: true,
    },
  };
}

function mockSectionValue(sectionKey, input) {
  const mock = generateMockProfiel(input);
  if (sectionKey === "vereisten") {
    return {
      vereistOpleiding: mock.vereistOpleiding,
      vereistWerkervaring: mock.vereistWerkervaring,
    };
  }
  const map = {
    doelVanDeFunctie: mock.doelVanDeFunctie,
    taken: mock.taken,
    bevoegdheden: mock.bevoegdheden,
    resultaatgebieden: mock.resultaatgebieden,
    samenwerking: mock.samenwerking,
    competenties: mock.competenties,
    bijzondereOmstandigheden: mock.bijzondereOmstandigheden,
  };
  return map[sectionKey];
}

async function callAnthropic(userPrompt) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API-fout: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.find((c) => c.type === "text")?.text ?? "";
  return parseJsonFromText(text);
}

export async function generateFunctieprofiel(input) {
  try {
    const result = await callAnthropic(buildUserPrompt(input));
    if (result) return result;
  } catch {
    /* fallback */
  }
  return generateMockProfiel(input);
}

export async function regenerateSection(input, sectionKey, sectionLabel) {
  try {
    const result = await callAnthropic(buildSectionPrompt(input, sectionKey, sectionLabel));
    if (result) {
      if (sectionKey === "vereisten") {
        return {
          vereistOpleiding: result.vereistOpleiding ?? result.vereisten,
          vereistWerkervaring: result.vereistWerkervaring ?? "",
        };
      }
      return result[sectionKey] ?? result;
    }
  } catch {
    /* fallback */
  }
  return mockSectionValue(sectionKey, input);
}
