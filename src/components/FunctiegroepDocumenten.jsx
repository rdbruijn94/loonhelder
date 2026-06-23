import { useState } from "react";

function formatDatum(iso) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function UploadVeld({ label, doc, onUpload }) {
  return (
    <div className="rounded-lg bg-achtergrond p-4">
      <p className="text-sm font-medium text-navy">{label}</p>
      {doc ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm text-navy">{doc.bestandsnaam}</p>
            <p className="text-xs text-navy/50">Geüpload op {formatDatum(doc.uploadDatum)}</p>
          </div>
          {doc.objectURL && (
            <a
              href={doc.objectURL}
              download={doc.bestandsnaam}
              className="min-h-11 rounded bg-navy px-4 py-2 text-xs font-medium text-white"
            >
              Download
            </a>
          )}
        </div>
      ) : (
        <p className="mt-2 text-sm text-navy/40">Nog geen document geüpload</p>
      )}
      <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded border-2 border-navy px-4 py-2 text-xs font-medium text-navy hover:bg-white">
        {doc ? "Vervang bestand" : `Upload ${label.toLowerCase()}`}
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            onUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export default function FunctiegroepDocumenten() {
  const [functieprofiel, setFunctieprofiel] = useState(null);
  const [handboek, setHandboek] = useState(null);

  function upload(setter, file) {
    if (!file) return;
    setter({
      bestandsnaam: file.name,
      uploadDatum: new Date().toISOString(),
      objectURL: URL.createObjectURL(file),
    });
  }

  return (
    <section className="kaart mt-6 p-4 md:p-6">
      <h2 className="text-base font-semibold text-navy md:text-lg">Functiegroep documenten</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <UploadVeld
          label="Functieprofiel"
          doc={functieprofiel}
          onUpload={(f) => upload(setFunctieprofiel, f)}
        />
        <UploadVeld
          label="Competentiehandboek"
          doc={handboek}
          onUpload={(f) => upload(setHandboek, f)}
        />
      </div>
    </section>
  );
}
