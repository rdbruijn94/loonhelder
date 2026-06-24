export const FUNCTIEPROFIELEN_KEY = "loontransparant_functieprofielen";

export function loadFunctieprofielen() {
  try {
    return JSON.parse(localStorage.getItem(FUNCTIEPROFIELEN_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function saveFunctieprofiel(entry) {
  const lijst = loadFunctieprofielen();
  const updated = [entry, ...lijst.filter((p) => p.id !== entry.id)];
  localStorage.setItem(FUNCTIEPROFIELEN_KEY, JSON.stringify(updated));
  return updated;
}

export function getProfielenVoorFunctiegroep(functiegroepId) {
  return loadFunctieprofielen().filter(
    (p) => p.functiegroepId === Number(functiegroepId)
  );
}
