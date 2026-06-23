import { useEffect, useState } from "react";
import { loadJSON, saveJSON, storageKeys } from "../utils/localStorage";

const DOC_TYPES = [
  "Beoordelingsverslag",
  "Arbeidsovereenkomst",
  "Waarschuwing",
  "Overig",
];

function formatDatum(iso) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MedewerkerDocumenten({ medewerkerId }) {
  const [documenten, setDocumenten] = useState([]);
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [files, setFiles] = useState({});

  useEffect(() => {
    const opgeslagen = loadJSON(storageKeys.medewerkerDocumenten(medewerkerId), []);
    setDocumenten(opgeslagen);
  }, [medewerkerId]);

  function handleUpload(file) {
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    const entry = {
      id: Date.now(),
      bestandsnaam: file.name,
      type: docType,
      uploadDatum: new Date().toISOString(),
    };
    setFiles((prev) => ({ ...prev, [entry.id]: objectURL }));
    const updated = [entry, ...documenten];
    setDocumenten(updated);
    saveJSON(storageKeys.medewerkerDocumenten(medewerkerId), updated);
  }

  return (
    <div className="kaart p-4">
      <h3 className="font-semibold text-navy">Documenten</h3>

      <div className="mt-3 space-y-2">
        {documenten.length === 0 && (
          <p className="text-sm text-navy/40">Nog geen documenten geüpload</p>
        )}
        {documenten.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded bg-achtergrond px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-navy">{doc.bestandsnaam}</p>
              <p className="text-xs text-navy/50">
                {doc.type} · {formatDatum(doc.uploadDatum)}
              </p>
            </div>
            {files[doc.id] ? (
              <a
                href={files[doc.id]}
                download={doc.bestandsnaam}
                className="min-h-11 rounded bg-navy px-3 py-1.5 text-xs font-medium text-white"
              >
                Download
              </a>
            ) : (
              <span className="text-xs text-navy/40">Opnieuw uploaden</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full rounded border border-navy/20 px-3 py-2 text-sm"
        >
          {DOC_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="flex min-h-11 cursor-pointer items-center justify-center rounded border-2 border-dashed border-navy/30 px-4 py-2 text-sm font-medium text-navy hover:bg-achtergrond">
          Upload document
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              handleUpload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
