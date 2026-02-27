const PBUH = "(peace be upon him)";

const PROPHET_NAMES = [
  "Adam",
  "Idris",
  "Nuh",
  "Hud",
  "Salih",
  "Ibrahim",
  "Lut",
  "Ismail",
  "Ishaq",
  "Ya'qub",
  "Ya‘qub",
  "Yusuf",
  "Ayyub",
  "Shu'ayb",
  "Shu‘ayb",
  "Musa",
  "Harun",
  "Dhul-Kifl",
  "Dawud",
  "Sulayman",
  "Ilyas",
  "Al-Yasa'",
  "Al-Yasa’",
  "Al-Yasa",
  "Yunus",
  "Zakariyya",
  "Yahya",
  "Isa",
  "Muhammad",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatProphetNamesWithPbuh(text?: unknown) {
  if (typeof text !== "string") {
    if (text == null) return "";
    text = String(text);
  }

  let result = text as string;

  for (const name of PROPHET_NAMES) {
    // Handle possessives like "Lut's" / "Lut’s" -> "Lut’s (peace be upon him)"
    const possessivePattern = new RegExp(
      `\\b${escapeRegExp(name)}(?:'s|’s)\\b(?!\\s*\\((?:peace|pbuh)[^)]*\\))`,
      "gi",
    );
    result = result.replace(possessivePattern, (match) => `${match} ${PBUH}`);

    const pattern = new RegExp(
      `\\b${escapeRegExp(name)}\\b(?!\\s*(?:'s|’s))(?!\\s*\\((?:peace|pbuh)[^)]*\\))`,
      "gi",
    );
    result = result.replace(pattern, (match) => `${match} ${PBUH}`);
  }

  return result;
}
