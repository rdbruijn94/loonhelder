import { useEffect, useState } from "react";
import { loadJSON, saveJSON, storageKeys } from "../utils/localStorage";

const DEFAULT_INGEPLAND = {
  id: "default-1",
  type: "Ontwikkelgesprek",
  datum: "2024-07-15",
  tijd: "10:00",
  locatie: "Vergaderruimte 2",
  gespreksleider: "Peter Bosman",
  notities: "",
};

function formatDatum(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const TYPE_LABELS = {
  doelen: "Doelengesprek",
  ontwikkeling: "Ontwikkelgesprek",
  beoordeling: "Beoordelingsgesprek",
  functionering: "Functioneringsgesprek",
};

export default function GesprekkenSectie({
  medewerkerId,
  gevoerdeGesprekken,
  isHR = false,
}) {
  const [tab, setTab] = useState("ingepland");
  const [ingepland, setIngepland] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    type: "ontwikkeling",
    datum: "",
    tijd: "",
    locatie: "",
    gespreksleider: "",
    notities: "",
  });
  const [uitgeklapt, setUitgeklapt] = useState({});
  const [beoordelingen, setBeoordelingen] = useState({});

  useEffect(() => {
    const opgeslagen = loadJSON(storageKeys.gesprekkenIngepland(medewerkerId), null);
    if (opgeslagen) {
      setIngepland(opgeslagen);
    } else {
      setIngepland([DEFAULT_INGEPLAND]);
    }

    const uploads = loadJSON(storageKeys.gesprekBeoordelingen(medewerkerId), {});
    setBeoordelingen(uploads);
  }, [medewerkerId]);

  function persistIngepland(lijst) {
    setIngepland(lijst);
    saveJSON(storageKeys.gesprekkenIngepland(medewerkerId), lijst);
  }

  function slaGesprekToe() {
    const nieuw = {
      id: Date.now(),
      type: TYPE_LABELS[form.type] || form.type,
      datum: form.datum,
      tijd: form.tijd,
      locatie: form.locatie,
      gespreksleider: form.gespreksleider,
      notities: form.notities,
    };
    persistIngepland([nieuw, ...ingepland]);
    setFormOpen(false);
    setForm({
      type: "ontwikkeling",
      datum: "",
      tijd: "",
      locatie: "",
      gespreksleider: "",
      notities: "",
    });
  }

  function handleBeoordelingUpload(gesprekId, file) {
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    const entry = {
      bestandsnaam: file.name,
      objectURL,
      uploadDatum: new Date().toISOString(),
    };
    const updated = { ...beoordelingen, [gesprekId]: entry };
    setBeoordelingen(updated);
    saveJSON(storageKeys.gesprekBeoordelingen(medewerkerId), {
      ...updated,
      [gesprekId]: { bestandsnaam: file.name, uploadDatum: entry.uploadDatum },
    });
  }

  function getBeoordeling(gesprekId) {
    const meta = beoordelingen[gesprekId];
    return meta?.objectURL ? meta : null;
  }

  return (
    <section className="kaart p-4 md:p-6">
      <h2 className="text-base font-semibold text-navy md:text-lg">Gesprekken</h2>

      <div className="mt-4 flex border-b border-navy/10">
        {[
          { id: "ingepland", label: "Ingepland" },
          { id: "gevoerd", label: "Gevoerd" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`min-h-11 px-4 text-sm font-medium ${
              tab === t.id
                ? "border-b-2 border-amber text-navy"
                : "border-b-2 border-transparent text-navy/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ingepland" && (
        <div className="mt-4">
          {isHR && (
            <button
              type="button"
              onClick={() => setFormOpen(!formOpen)}
              className="mb-4 min-h-11 rounded bg-navy px-4 py-2 text-sm font-medium text-white"
            >
              Voeg gesprek toe
            </button>
          )}

          {formOpen && isHR && (
            <div className="mb-4 space-y-3 rounded-lg bg-achtergrond p-4">
              <div>
                <label className="text-sm text-navy/70">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                >
                  <option value="doelen">Doelen</option>
                  <option value="ontwikkeling">Ontwikkeling</option>
                  <option value="beoordeling">Beoordeling</option>
                  <option value="functionering">Functionering</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-navy/70">Datum</label>
                  <input
                    type="date"
                    value={form.datum}
                    onChange={(e) => setForm((f) => ({ ...f, datum: e.target.value }))}
                    className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-navy/70">Tijd</label>
                  <input
                    type="time"
                    value={form.tijd}
                    onChange={(e) => setForm((f) => ({ ...f, tijd: e.target.value }))}
                    className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-navy/70">Locatie</label>
                <input
                  value={form.locatie}
                  onChange={(e) => setForm((f) => ({ ...f, locatie: e.target.value }))}
                  className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-navy/70">Gespreksleider</label>
                <input
                  value={form.gespreksleider}
                  onChange={(e) => setForm((f) => ({ ...f, gespreksleider: e.target.value }))}
                  className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-navy/70">Notities vooraf</label>
                <textarea
                  value={form.notities}
                  onChange={(e) => setForm((f) => ({ ...f, notities: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full rounded border border-navy/20 px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={slaGesprekToe}
                className="min-h-11 rounded bg-navy px-4 py-2 text-sm text-white"
              >
                Opslaan
              </button>
            </div>
          )}

          <div className="divide-y divide-navy/10">
            {ingepland.map((g) => (
              <div key={g.id} className="py-4 first:pt-0">
                <p className="font-medium text-navy">{g.type}</p>
                <div className="mt-1 grid gap-1 text-sm text-navy/70 sm:grid-cols-2">
                  <span>{formatDatum(g.datum)} · {g.tijd}</span>
                  <span>{g.locatie}</span>
                  <span>Gespreksleider: {g.gespreksleider}</span>
                </div>
                {g.notities && (
                  <p className="mt-2 text-sm text-navy/50">{g.notities}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "gevoerd" && (
        <div className="mt-4 divide-y divide-navy/10">
          {gevoerdeGesprekken.map((g) => {
            const isOpen = uitgeklapt[g.id];
            const upload = getBeoordeling(g.id);
            const metaOnly = beoordelingen[g.id] && !upload;

            return (
              <div key={g.id} className="py-4 first:pt-0">
                <button
                  type="button"
                  onClick={() => setUitgeklapt((u) => ({ ...u, [g.id]: !u[g.id] }))}
                  className="flex w-full items-start justify-between gap-2 text-left"
                >
                  <div>
                    <p className="font-medium text-navy">{g.type}</p>
                    <p className="text-xs text-navy/50">{formatDatum(g.datum)}</p>
                    {!isOpen && (
                      <p className="mt-1 line-clamp-2 text-sm text-navy/70">{g.samenvatting}</p>
                    )}
                  </div>
                  <span className="text-navy/40">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm leading-relaxed text-navy/70">{g.samenvatting}</p>
                    {g.doelen?.length > 0 && (
                      <ul className="list-inside list-disc text-sm text-navy/70">
                        {g.doelen.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    )}
                    {g.beoordeling && (
                      <p className="text-sm">
                        <span className="text-navy/50">Beoordeling: </span>
                        <span className="font-medium text-navy">{g.beoordeling}</span>
                      </p>
                    )}

                    <div className="border-t border-navy/10 pt-3">
                      <p className="text-xs font-medium text-navy/50">Beoordelingsdocument</p>
                      {upload ? (
                        <a
                          href={upload.objectURL}
                          download={upload.bestandsnaam}
                          className="mt-2 inline-flex min-h-11 items-center rounded bg-navy px-4 py-2 text-xs font-medium text-white"
                        >
                          Bekijk beoordelingsverslag
                        </a>
                      ) : metaOnly ? (
                        <p className="mt-2 text-sm text-navy/50">
                          {beoordelingen[g.id].bestandsnaam} — opnieuw uploaden voor download
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-navy/40">Geen document beschikbaar</p>
                      )}

                      {isHR && (
                        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded border-2 border-navy px-4 py-2 text-xs font-medium text-navy">
                          Upload beoordelingsverslag
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              handleBeoordelingUpload(g.id, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
