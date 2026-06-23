export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storageKeys = {
  gesprekkenIngepland: (id) => `loonhelder_gesprekken_ingepland_${id}`,
  medewerkerDocumenten: (id) => `loonhelder_medewerker_docs_${id}`,
  gesprekBeoordelingen: (id) => `loonhelder_gesprek_beoordelingen_${id}`,
  functiegroepDocumenten: (id) => `loonhelder_functiegroep_docs_${id}`,
};
