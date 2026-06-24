import { jsPDF } from "jspdf";
import { hexToRgb } from "./logoColor";

const MARGIN = 20;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 18;

function vandaag() {
  return new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function datumBestand() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(text) {
  return text.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_");
}

const SECTIONS = [
  { key: "doelVanDeFunctie", label: "Doel van de functie" },
  { key: "taken", label: "Taken en verantwoordelijkheden", list: true },
  { key: "bevoegdheden", label: "Bevoegdheden", list: true },
  { key: "resultaatgebieden", label: "Resultaatgebieden", list: true },
  { key: "samenwerking", label: "Samenwerking" },
  { key: "vereisten", label: "Vereiste opleiding en ervaring" },
  { key: "competenties", label: "Competenties", list: true },
  { key: "bijzondereOmstandigheden", label: "Bijzondere omstandigheden" },
];

function sectionContent(profiel, section) {
  if (section.key === "vereisten") {
    return `${profiel.vereistOpleiding || ""}\n${profiel.vereistWerkervaring || ""}`.trim();
  }
  const val = profiel[section.key];
  if (Array.isArray(val)) return val.map((v) => `• ${v}`).join("\n");
  return val || "";
}

export async function generateFunctieprofielPDF({
  profiel,
  organisatienaam,
  logoDataURL,
  primairKleur,
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const [pr, pg, pb] = hexToRgb(primairKleur || "#1B2E4B");

  function drawHeader() {
    if (logoDataURL) {
      try {
        doc.addImage(logoDataURL, "PNG", MARGIN, 8, 24, 12);
      } catch {
        try {
          doc.addImage(logoDataURL, "JPEG", MARGIN, 8, 24, 12);
        } catch {
          /* skip logo */
        }
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(27, 46, 75);
    doc.text(organisatienaam, PAGE_W - MARGIN, 14, { align: "right" });
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, 22, PAGE_W - MARGIN, 22);
  }

  function drawFooter(pageNum, totalPages, functietitel) {
    const footerY = PAGE_H - FOOTER_H;
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, footerY, PAGE_W - MARGIN, footerY);
    doc.setFontSize(8);
    doc.setTextColor(pr, pg, pb);
    doc.text(`${organisatienaam} — Functieprofiel — ${functietitel}`, MARGIN, footerY + 8);
    doc.text(`Opgesteld via Loontransparant — ${vandaag()}`, PAGE_W - MARGIN, footerY + 8, {
      align: "right",
    });
    doc.text(String(pageNum), PAGE_W / 2, footerY + 8, { align: "center" });
  }

  drawHeader();
  let y = 32;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(pr, pg, pb);
  doc.text("Functieprofiel", MARGIN, y);
  y += 8;
  doc.setFontSize(14);
  doc.setTextColor(27, 46, 75);
  doc.text(profiel.functietitel, MARGIN, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(pr, pg, pb);
  doc.text("Inhoudsopgave", MARGIN, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  SECTIONS.forEach((s, i) => {
    doc.text(`${i + 1}. ${s.label}`, MARGIN + 2, y);
    y += 6;
  });

  doc.addPage();
  drawHeader();
  y = 32;

  SECTIONS.forEach((section) => {
    const content = sectionContent(profiel, section);
    const lines = doc.splitTextToSize(content, CONTENT_W);
    const needed = 16 + lines.length * 5 + 8;

    if (y + needed > PAGE_H - FOOTER_H - 10) {
      doc.addPage();
      drawHeader();
      y = 32;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(pr, pg, pb);
    doc.text(section.label, MARGIN, y);
    y += 7;

    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(lines, MARGIN, y);
    y += lines.length * 5 + 10;
  });

  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages, profiel.functietitel);
  }

  const filename = `${slugify(organisatienaam)}_Functieprofiel_${slugify(profiel.functietitel)}_${datumBestand()}.pdf`;
  doc.save(filename);
}
