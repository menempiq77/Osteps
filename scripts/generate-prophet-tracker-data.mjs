import fs from "fs";
import path from "path";

const ROOT = "C:\\windows-\\Osteps-main\\Osteps";
const PDF_TEXT = path.join(ROOT, "tmp", "stories_pdftotext.txt");
const PROPHETS_DIR = path.join(ROOT, "src", "lib", "builtinTrackers", "prophets");

const HEADING_TO_SLUG = {
  "Prophet Adam": "adam",
  "Prophet Idris (Enoch)": "idris",
  "Prophet Nuh (Noah)": "nuh",
  "Prophet Hud": "hud",
  "Prophet Salih": "salih",
  "Prophet Ibrahim (Abraham)": "ibrahim",
  "Prophet Isma'il (Ishmael)": "ismail",
  "Prophet Ishaq": "ishaq",
  "Prophet Yaqub (Jacob)": "yaqub",
  "Prophet Lot (Lut)": "lut",
  "Prophet Shu’aib": "shuayb",
  "Prophet Yusuf (Joseph)": "yusuf",
  "Prophet Job (Ayoub)": "ayyub",
  "Prophet Dhul - Kifl": "dhul-kifl",
  "Prophet Yunus (Jonah)": "yunus",
  "Prophet Musa (Moses) and Harun (Aaron)": "musa",
  "Prophet Hizqeel (Ezekiel)": "hizqeel",
  "Prophet Elisha (Elyas)": "al-yasa",
  "Prophet Shammil (Samuel)": "shammil",
  "Prophet Dawud (David)": "dawud",
  "Prophet Sulaiman (Solomon)": "sulayman",
  "Prophet Shia (Isaiah)": "shia",
  "Prophet Aramaya (Jeremiah)": "aramaya",
  "Prophet Daniel": "daniel",
  "Prophet Uzair (Ezra)": "uzair",
  "Prophet Zakariyah (Zechariah)": "zakariyya",
  "Prophet Yahya (John)": "yahya",
  "Prophet Isa": "isa",
  "Prophet Muhammad": "muhammad",
};

const KNOWN_HEADINGS = Object.keys(HEADING_TO_SLUG);

function escapeTemplate(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function cleanParagraph(raw) {
  return raw
    .replace(/\f/g, " ")
    .replace(/www\.islambasics\.com/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoChunks(text, maxLen = 400) {
  const sentences = text.split(/(?<=[.])\s+/).filter(Boolean);
  const chunks = [];
  let current = "";

  for (const s of sentences) {
    if (current.length + s.length + 1 <= maxLen) {
      current = current ? `${current} ${s}` : s;
    } else {
      if (current) chunks.push(current);
      current = s;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

function extractProphetSections() {
  const text = fs.readFileSync(PDF_TEXT, "utf8");
  const lines = text.split("\n");

  const sections = new Map();
  let currentHeading = null;
  let currentBuffer = [];

  function flush() {
    if (currentHeading && sections.has(currentHeading)) {
      // Already captured the first instance.
    } else if (currentHeading && KNOWN_HEADINGS.includes(currentHeading)) {
      const paragraphs = [];
      const blocks = currentBuffer
        .join("\n")
        .split(/\n\s*\n/)
        .map((b) => cleanParagraph(b))
        .filter((b) => b.length > 10);

      // Merge very short blocks (subheadings) with the next block.
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.length < 80 && i < blocks.length - 1) {
          blocks[i + 1] = b + " — " + blocks[i + 1];
        } else {
          paragraphs.push(b);
        }
      }

      // Split long blocks into small, eye-friendly chunks.
      const smallChunks = paragraphs.flatMap((p) =>
        p.length > 300 ? splitIntoChunks(p, 300) : [p]
      );

      sections.set(currentHeading, smallChunks.slice(0, 24));
    }
  }

  for (const line of lines) {
    const t = line.trim();
    if (KNOWN_HEADINGS.includes(t)) {
      if (currentHeading) flush();
      currentHeading = t;
      currentBuffer = [];
      continue;
    }
    if (currentHeading) {
      currentBuffer.push(line);
    }
  }
  flush();

  return sections;
}

function patchFile(filePath, sections) {
  let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  const ids = Array.from(content.matchAll(/^    id: "([^"]+)",/gm)).map((m) => m[1]);

  for (const id of ids) {
    const heading = Object.entries(HEADING_TO_SLUG).find(([, v]) => v === id)?.[0];
    if (!heading || !sections.has(heading)) continue;

    const newParagraphs = sections.get(heading);
    const newString = newParagraphs
      .map((p) => `      \`${escapeTemplate(p)}\`,`)
      .join("\n");

    const re = new RegExp(
      `(id:\\s*"${id}",[\\s\\S]{0,500}?)story:\\s*\\[([\\s\\S]*?)\\],\\n\\s*lessons:`,
      "g"
    );

    content = content.replace(re, (match, prefix, existingInside) => {
      if (id === "adam") {
        console.log("adam existing last 80:", JSON.stringify(existingInside.slice(-80)));
      }
      const existing = existingInside.replace(/^\n+/, "").trimEnd();
      const combined = [existing, newString].filter(Boolean).join("\n");
      return `${prefix}story: [\n${combined}\n    ],\n    lessons:`;
    });
  }

  fs.writeFileSync(filePath, content.replace(/\n/g, "\r\n"), "utf8");
}

function main() {
  const sections = extractProphetSections();
  console.log("Extracted sections:", Array.from(sections.keys()).length);

  const parts = ["part1.ts", "part2.ts", "part3.ts", "part4.ts", "part5.ts"];
  for (const part of parts) {
    const filePath = path.join(PROPHETS_DIR, part);
    patchFile(filePath, sections);
    console.log("Patched", part);
  }

  console.log("Done.");
}

main();
