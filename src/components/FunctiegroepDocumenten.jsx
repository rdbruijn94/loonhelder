import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfielenVoorFunctiegroep } from "../utils/functieprofielStorage";
import { generateFunctieprofielPDF } from "../utils/generateFunctieprofielPDF";

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
  const { id } = useParams();
  const [functieprofiel, setFunctieprofiel] = useState(null);
  const [handboek, setHandboek] = useState(null);
  const [aiProfielen, setAiProfielen] = useState([]);

  useEffect(() => {
    const refresh = () => setAiProfielen(getProfielenVoorFunctiegroep(id));
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [id]);

  function upload(setter, file) {
    if (!file) return;
    setter({
      bestandsnaam: file.name,
      uploadDatum: new Date().toISOString(),
      objectURL: URL.createObjectURL(file),
    });
  }

  async function downloadAiProfiel(entry) {
    await generateFunctieprofielPDF({
      profiel: entry.profiel,
      organisatienaam: entry.organisatienaam,
      logoDataURL: entry.logoDataURL || "",
      primairKleur: entry.primairKleur || "#1B2E4B",
    });
  }

  return (
    <section className="kaart mt-6 p-4 md:p-6">
      <h2 className="text-base font-semibold text-navy md:text-lg">Functiegroep documenten</h2>

      {aiProfielen.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-navy">Gegenereerd via AI</p>
          {aiProfielen.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-achtergrond p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-navy">
                    Functieprofiel — {entry.functietitel}
                  </p>
                  <span className="rounded-full bg-amber/20 px-2 py-0.5 text-xs font-medium text-amber">
                    Gegenereerd via AI
                  </span>
                </div>
                <p className="text-xs text-navy/50">
                  Vastgesteld op {formatDatum(entry.aangemaaktOp)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => downloadAiProfiel(entry)}
                className="min-h-11 rounded bg-navy px-4 py-2 text-xs font-medium text-white"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}

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
