import { jsPDF } from "jspdf";
import { functiegroepen, organisatie, seniorMedewerkers } from "../data/mockdata";

const NAVY = [27, 46, 75];
const AMBER = [232, 160, 32];
const MAN = [59, 125, 216];
const VROUW = [139, 92, 246];
const ROOD = [220, 38, 38];
const GROEN = [22, 101, 52];
const GRIJS = [107, 114, 128];

const MARGIN = 20;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 32;
const FOOTER_H = 18;

const seniorNiveau = functiegroepen[0].niveaus.find((n) => n.niveau === "Senior");
const LOONKLOOF = seniorNiveau?.loonkloof ?? 14.2;

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

function gemCompetentie(medewerker) {
  const totaal = medewerker.competenties.reduce((s, c) => s + c.huidigNiveau, 0);
  return (totaal / medewerker.competenties.length).toFixed(1);
}

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(bedrag);
}

function drawHeader(doc) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("LoonHelder", MARGIN, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Onderbouwingsrapport Loontransparantie", MARGIN, 22);

  doc.text(vandaag(), PAGE_W - MARGIN, 14, { align: "right" });
  doc.text(organisatie.naam, PAGE_W - MARGIN, 22, { align: "right" });

  doc.setFillColor(...AMBER);
  doc.rect(0, HEADER_H, PAGE_W, 3, "F");

  doc.setTextColor(...NAVY);
}

function drawFooter(doc, pageNum, totalPages) {
  const footerY = PAGE_H - FOOTER_H;

  doc.setFillColor(...AMBER);
  doc.rect(0, footerY, PAGE_W, 1.5, "F");

  doc.setFontSize(8);
  doc.setTextColor(...GRIJS);
  doc.text(`LoonHelder — Gegenereerd op ${vandaag()}`, MARGIN, footerY + 8);
  doc.text(`Pagina ${pageNum} van ${totalPages}`, PAGE_W - MARGIN, footerY + 8, {
    align: "right",
  });
}

function ensureSpace(doc, y, needed, contentStart) {
  if (y + needed > PAGE_H - FOOTER_H - 5) {
    doc.addPage();
    drawHeader(doc);
    return contentStart;
  }
  return y;
}

function drawSection1(doc, y, type) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text("Onderbouwing loonverschil", MARGIN, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...GRIJS);
  doc.text("Senior Assurantieadviseur", MARGIN, y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text(`Rapportdatum: ${vandaag()}`, MARGIN, y);
  y += 6;
  doc.text(`Rapporttype: ${type === "intern" ? "Intern" : "Extern"}`, MARGIN, y);

  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  return y + 8;
}

function drawInternSection(doc, startY) {
  const contentStart = HEADER_H + 10;
  let y = startY;

  doc.setFillColor(254, 242, 242);
  doc.rect(MARGIN, y - 4, CONTENT_W, 10, "F");
  doc.setFontSize(9);
  doc.setTextColor(...ROOD);
  doc.setFont("helvetica", "bold");
  doc.text("VERTROUWELIJK — Uitsluitend voor intern gebruik", MARGIN + 2, y + 3);
  y += 14;

  seniorMedewerkers.forEach((persoon) => {
    y = ensureSpace(doc, y, 55, contentStart);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(persoon.naam, MARGIN, y);

    y += 6;
    const kleur = persoon.geslacht === "man" ? MAN : VROUW;
    doc.setTextColor(...kleur);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const geslachtLabel = persoon.geslacht === "man" ? "Man" : "Vrouw";
    doc.text(`${geslachtLabel} · ${euro(persoon.salaris)}`, MARGIN, y);

    y += 6;
    doc.setTextColor(...NAVY);
    doc.setFontSize(9);
    doc.text(`Ervaringsjaren: ${persoon.ervaringsjaren}`, MARGIN, y);
    y += 5;
    doc.text(`Beoordeling: ${persoon.beoordelingResultaat}`, MARGIN, y);

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Competenties:", MARGIN, y);
    y += 5;

    persoon.competenties.forEach((c) => {
      y = ensureSpace(doc, y, 6, contentStart);
      const onder = c.huidigNiveau < c.vereistNiveau;
      doc.setFont("helvetica", "normal");
      if (onder) doc.setTextColor(...ROOD);
      else doc.setTextColor(...NAVY);
      doc.text(`${c.naam}: niveau ${c.huidigNiveau}`, MARGIN, y);
      y += 5;
    });

    y += 2;
    doc.setTextColor(...GROEN);
    doc.setFontSize(8);
    doc.text("Salarispositie objectief onderbouwd", MARGIN, y);
    y += 12;
  });

  return y;
}

function drawExternSection(doc, y) {
  const contentStart = HEADER_H + 10;

  doc.setFillColor(240, 253, 244);
  doc.rect(MARGIN, y - 4, CONTENT_W, 10, "F");
  doc.setFontSize(9);
  doc.setTextColor(...GROEN);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Geschikt voor externe rapportage conform EU Richtlijn 2023/970",
    MARGIN + 2,
    y + 3
  );
  y += 16;

  const thomas = seniorMedewerkers.find((m) => m.geslacht === "man");
  const sandra = seniorMedewerkers.find((m) => m.geslacht === "vrouw");

  const rows = [
    {
      groep: "Man",
      aantal: seniorNiveau?.man.aantal ?? 2,
      salaris: seniorNiveau?.man.gemiddeld ?? 4480,
      ervaring: thomas?.ervaringsjaren ?? 8,
      competentie: "4,0",
    },
    {
      groep: "Vrouw",
      aantal: seniorNiveau?.vrouw.aantal ?? 2,
      salaris: seniorNiveau?.vrouw.gemiddeld ?? 3840,
      ervaring: sandra?.ervaringsjaren ?? 4,
      competentie: "2,8",
    },
  ];

  const cols = ["Groep", "Aantal", "Gem. salaris", "Gem. ervaring", "Gem. score"];
  const colWidths = [25, 22, 38, 38, 32];
  let x = MARGIN;

  doc.setFillColor(240, 242, 245);
  doc.rect(MARGIN, y - 4, CONTENT_W, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);

  cols.forEach((col, i) => {
    doc.text(col, x + 2, y);
    x += colWidths[i];
  });
  y += 10;

  rows.forEach((row) => {
    x = MARGIN;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const kleur = row.groep === "Man" ? MAN : VROUW;
    doc.setTextColor(...kleur);
    doc.text(row.groep, x + 2, y);
    x += colWidths[0];
    doc.setTextColor(...NAVY);
    doc.text(String(row.aantal), x + 2, y);
    x += colWidths[1];
    doc.text(euro(row.salaris), x + 2, y);
    x += colWidths[2];
    doc.text(`${row.ervaring} jaar`, x + 2, y);
    x += colWidths[3];
    doc.text(String(row.competentie), x + 2, y);
    y += 8;
  });

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...NAVY);
  doc.text(`${LOONKLOOF.toLocaleString("nl-NL")}%`, MARGIN, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRIJS);
  const externTekst = doc.splitTextToSize(
    "Loonverschil verklaard door gemiddeld ervaringsverschil (8 vs 4 jaar) en gemiddelde competentiescore (4,0 vs 2,8). Dit verschil is objectief en niet gebaseerd op geslacht.",
    CONTENT_W
  );
  doc.text(externTekst, MARGIN, y);

  return y + externTekst.length * 5 + 8;
}

function drawConclusie(doc, y, type) {
  const contentStart = HEADER_H + 10;
  y = ensureSpace(doc, y, 40, contentStart);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  doc.text("Conclusie", MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);

  const internTekst =
    "Het loonverschil van 14,2% is verklaarbaar op basis van ervaringsverschil (8 vs 4 jaar) en competentiescores. Thomas Bakker scoort op alle competenties niveau 4, Sandra Visser scoort op Productkennis en Probleemoplossend vermogen nog niveau 2. Dit verschil is objectief en niet gebaseerd op geslacht.";

  const externTekst =
    "Senior Assurantieadviseur — man (n=2): gemiddeld €4.480 / vrouw (n=2): gemiddeld €3.840. Loonverschil 14,2% verklaard door gemiddeld ervaringsverschil (8 vs 4 jaar) en gemiddelde competentiescore (4,0 vs 2,8). Dit verschil is objectief en niet gebaseerd op geslacht.";

  const lines = doc.splitTextToSize(type === "intern" ? internTekst : externTekst, CONTENT_W);
  doc.text(lines, MARGIN, y);
  y += lines.length * 5 + 8;

  doc.setFillColor(240, 253, 244);
  doc.rect(MARGIN, y - 4, CONTENT_W, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GROEN);
  doc.text("Loonverschil objectief verklaard", MARGIN + 2, y + 3);

  return y + 14;
}

export function generateOnderbouwingPDF(type) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  drawHeader(doc);

  let y = HEADER_H + 12;
  y = drawSection1(doc, y, type);

  if (type === "intern") {
    y = drawInternSection(doc, y);
  } else {
    y = drawExternSection(doc, y);
  }

  drawConclusie(doc, y, type);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  const datum = datumBestand();
  const filename =
    type === "intern"
      ? `LoonHelder_Intern_Onderbouwing_Senior_${datum}.pdf`
      : `LoonHelder_Extern_Rapport_Senior_${datum}.pdf`;

  doc.save(filename);
}

export function generateMedewerkerPDF(medewerker) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  drawHeader(doc);

  let y = HEADER_H + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text("Onderbouwingsdocument medewerker", MARGIN, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(medewerker.naam, MARGIN, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(`${medewerker.functie} · ${euro(medewerker.salaris)}`, MARGIN, y);
  y += 6;
  doc.text(`Ervaringsjaren: ${medewerker.ervaringsjaren}`, MARGIN, y);
  y += 6;
  doc.text(`Beoordeling: ${medewerker.beoordelingResultaat}`, MARGIN, y);
  y += 6;
  doc.text(`Competentiescore: ${gemCompetentie(medewerker)}`, MARGIN, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Competenties:", MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  medewerker.competenties.forEach((c) => {
    doc.text(`${c.naam}: niveau ${c.huidigNiveau}`, MARGIN, y);
    y += 5;
  });

  y += 6;
  doc.setFillColor(240, 253, 244);
  doc.rect(MARGIN, y - 4, CONTENT_W, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GROEN);
  doc.text("Salarispositie objectief onderbouwd", MARGIN + 2, y + 3);

  drawFooter(doc, 1, 1);

  const datum = datumBestand();
  const slug = medewerker.naam.replace(/\s+/g, "_");
  doc.save(`LoonHelder_Onderbouwing_${slug}_${datum}.pdf`);
}

export function generateFunctieprofielPDF(profiel) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  drawHeader(doc);

  let y = HEADER_H + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text("Functieprofiel", MARGIN, y);

  y += 10;
  doc.setFontSize(12);
  doc.text(profiel.functietitel, MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const velden = [
    ["Afdeling", profiel.afdeling],
    ["Rapporteert aan", profiel.rapporteertAan],
    ["Vereiste opleiding", profiel.opleiding],
    ["Vereiste ervaring", profiel.ervaring],
  ];

  velden.forEach(([label, waarde]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.text(waarde, MARGIN + 40, y);
    y += 6;
  });

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("Doel van de functie:", MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  const doelLines = doc.splitTextToSize(profiel.doel, CONTENT_W);
  doc.text(doelLines, MARGIN, y);
  y += doelLines.length * 5 + 6;

  doc.setFont("helvetica", "bold");
  doc.text("Taken en verantwoordelijkheden:", MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  profiel.taken.forEach((taak) => {
    doc.text(`• ${taak}`, MARGIN + 2, y);
    y += 5;
  });

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("Competenties:", MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(profiel.competenties.join(", "), MARGIN, y);

  drawFooter(doc, 1, 1);

  const datum = datumBestand();
  doc.save(`LoonHelder_Functieprofiel_${datum}.pdf`);
}
