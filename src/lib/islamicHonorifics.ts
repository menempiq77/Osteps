const PROPHET_NAMES = [
  "Dhul-Kifl",
  "Al-Yasa'",
  "Shu'ayb",
  "Zakariyya",
  "Muhammad",
  "Ibrahim",
  "Sulayman",
  "Ismail",
  "Ishaq",
  "Yaqub",
  "Yusuf",
  "Ayyub",
  "Dawud",
  "Zakariya",
  "Yunus",
  "Idris",
  "Harun",
  "Yahya",
  "Salih",
  "Musa",
  "Ilyas",
  "Adam",
  "Nuh",
  "Hud",
  "Lut",
  "Isa",
];

const SCHOLAR_NAMES = [
  "Ibn Kathir",
  "Al-Bukhari",
  "Bukhari",
];

const COMPANION_NAMES = [
  "Ibn Abbas",
  "Abu Hurairah",
  "Ibn Umar",
  "Ibn Mas'ud",
  "Ibn Masud",
  "Ibn Qatadah",
];

type HonorificRule = {
  names: string[];
  honorific: string;
  key: string;
  existingPattern: RegExp;
};

const rules: HonorificRule[] = [
  {
    names: PROPHET_NAMES,
    honorific: "(peace be upon him)",
    key: "prophet",
    existingPattern: /^(?:\s*\((?:peace be upon him|pbuh|peace and blessings be upon him|sallallahu [^)]+)\)|\s*\)\s*\((?:peace be upon him|pbuh|peace and blessings be upon him|sallallahu [^)]+)\))/i,
  },
  {
    names: SCHOLAR_NAMES,
    honorific: "(may Allah have mercy on him)",
    key: "scholar",
    existingPattern: /^\s*\(may Allah have mercy on him\)/i,
  },
  {
    names: COMPANION_NAMES,
    honorific: "(may Allah be pleased with him)",
    key: "companion",
    existingPattern: /^\s*\(may Allah be pleased with him\)/i,
  },
  {
    names: ["Allah"],
    honorific: "(Almighty)",
    key: "allah",
    existingPattern: /^\s*(?:the Almighty|the Exalted|the Most High|Almighty)(?!\w)|^\s*\((?:Almighty|SWT|\uFDFB|may Allah\b)/i,
  },
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildPattern = (names: string[]) =>
  new RegExp(
    `\\b(${names
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join("|")})(['\\u2019]s)?(?![\\p{L}\\p{N}_])`,
    "gu"
  );

const hasHonorificAfter = (
  text: string,
  end: number,
  rule: HonorificRule
) => rule.existingPattern.test(text.slice(end, end + 55));

const hasHonorificBefore = (
  text: string,
  start: number,
  rule: HonorificRule
) => {
  if (rule.key !== "allah") return false;
  return /(?:the\s+)?(?:Almighty|Most High|Exalted)\s+$/i.test(
    text.slice(Math.max(0, start - 35), start)
  );
};

const isInsideHonorific = (text: string, start: number) => {
  const before = text.slice(0, start);
  const open = before.lastIndexOf("(");
  const close = before.lastIndexOf(")");
  return (
    open > close &&
    /may Allah|Allah may/i.test(text.slice(open, start + 20))
  );
};

export function withHonorifics(text: string): string {
  if (!text) return text;

  let result = text;
  for (const rule of rules) {
    const pattern = buildPattern(rule.names);
    const seen = new Set<string>();
    result = result.replace(pattern, (match, name: string, possessive = "", offset: number, source: string) => {
      if (rule.key === "allah" && isInsideHonorific(source, offset)) {
        return match;
      }
      const seenKey = name.toLowerCase();
      if (
        seen.has(seenKey) ||
        hasHonorificBefore(source, offset, rule) ||
        hasHonorificAfter(source, offset + match.length, rule)
      ) {
        seen.add(seenKey);
        return match;
      }
      seen.add(seenKey);
      return `${name}${possessive} ${rule.honorific}`;
    });
  }

  return result;
}
