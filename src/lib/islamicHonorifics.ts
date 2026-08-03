type HonorificRule = {
  names: string[];
  honorific: string;
  key: string;
  existingPattern: RegExp;
};

const PROPHET_RULE: HonorificRule = {
  names: [
    "Dhul-Kifl",
    "John the Baptist",
    "Shu'ayb",
    "Shu'aib",
    "Zakariyya",
    "Zakariya",
    "Muhammad",
    "Ibrahim",
    "Abraham",
    "Sulayman",
    "Solomon",
    "Ismail",
    "Ishmael",
    "Ishaq",
    "Isaac",
    "Yaqub",
    "Jacob",
    "Yusuf",
    "Joseph",
    "Ayyub",
    "Job",
    "Dawud",
    "David",
    "Yunus",
    "Jonah",
    "Ilyas",
    "Elijah",
    "Al-Yasa'",
    "Elisha",
    "Musa",
    "Moses",
    "Harun",
    "Aaron",
    "Yahya",
    "John",
    "Salih",
    "Adam",
    "Idris",
    "Enoch",
    "Nuh",
    "Noah",
    "Hud",
    "Lut",
    "Lot",
    "Isa",
    "Jesus",
  ],
  honorific: "(peace be upon him)",
  key: "prophet",
  existingPattern:
    /^(?:\s*\((?:peace be upon him|pbuh|peace and blessings be upon him|sallallahu [^)]+)\)|\s*\)\s*\((?:peace be upon him|pbuh|peace and blessings be upon him|sallallahu [^)]+)\)|\s*\([^)]*\)\s*\((?:peace be upon him|pbuh|peace and blessings be upon him|sallallahu [^)]+)\))/i,
};

const SCHOLAR_RULE: HonorificRule = {
  names: ["Ibn Kathir", "Al-Bukhari", "Bukhari"],
  honorific: "(may Allah have mercy on him)",
  key: "scholar",
  existingPattern: /^\s*\(may Allah have mercy on him\)/i,
};

const COMPANION_RULE: HonorificRule = {
  names: [
    "Ibn Abbas",
    "Abu Hurairah",
    "Ibn Umar",
    "Ibn Mas'ud",
    "Ibn Masud",
    "Ibn Qatadah",
  ],
  honorific: "(may Allah be pleased with him)",
  key: "companion",
  existingPattern: /^\s*\(may Allah be pleased with him\)/i,
};

const ALLAH_RULE: HonorificRule = {
  names: ["Allah"],
  honorific: "(Almighty)",
  key: "allah",
  existingPattern:
    /^\s*(?:the Almighty|the Exalted|the Most High|Almighty)(?!\w)|^\s*\((?:Almighty|SWT|\uFDFB|may Allah\b)/i,
};

const rules = [PROPHET_RULE, SCHOLAR_RULE, COMPANION_RULE, ALLAH_RULE];

const prophetCanonicalKeys: Record<string, string> = {
  Adam: "adam",
  Idris: "idris",
  Enoch: "idris",
  Nuh: "nuh",
  Noah: "nuh",
  Hud: "hud",
  Salih: "salih",
  Ibrahim: "ibrahim",
  Abraham: "ibrahim",
  Lut: "lut",
  Lot: "lut",
  Ismail: "ismail",
  Ishmael: "ismail",
  Ishaq: "ishaq",
  Isaac: "ishaq",
  Yaqub: "yaqub",
  Jacob: "yaqub",
  Yusuf: "yusuf",
  Joseph: "yusuf",
  Ayyub: "ayyub",
  Job: "ayyub",
  "Shu'ayb": "shuayb",
  "Shu'aib": "shuayb",
  Musa: "musa",
  Moses: "musa",
  Harun: "harun",
  Aaron: "harun",
  "Dhul-Kifl": "dhul-kifl",
  Dawud: "dawud",
  David: "dawud",
  Sulayman: "sulayman",
  Solomon: "sulayman",
  Ilyas: "ilyas",
  Elijah: "ilyas",
  "Al-Yasa'": "al-yasa",
  Elisha: "al-yasa",
  Yunus: "yunus",
  Jonah: "yunus",
  Zakariyya: "zakariyya",
  Zakariya: "zakariyya",
  Yahya: "yahya",
  John: "yahya",
  "John the Baptist": "yahya",
  Isa: "isa",
  Jesus: "isa",
  Muhammad: "muhammad",
};

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

const citationPrefix =
  /(?:Sahih(?:\s+al)?|Sunan|Musnad|Jami['’]?|Tafsir|Mishkat|Muwatta|Riyadh|Al-Adab|narrated in|Narrated in|Book of|collection of)\s*$/i;

const isInsideCitation = (text: string, start: number, end: number) => {
  const before = text.slice(0, start);
  const open = before.lastIndexOf("(");
  const close = before.lastIndexOf(")");
  if (open <= close) return false;

  const insideBefore = text.slice(open + 1, start);
  if (citationPrefix.test(insideBefore)) return true;

  const closeIndex = text.indexOf(")", end);
  const insideAfter = text.slice(end, closeIndex < 0 ? text.length : closeIndex);
  return /^\s*(?:Ibn Kathir|Al-Bukhari|Bukhari)\s*$/i.test(
    insideBefore + text.slice(start, end) + insideAfter
  );
};

const hasHonorificAfter = (
  text: string,
  end: number,
  rule: HonorificRule
) => rule.existingPattern.test(text.slice(end, end + 55));

const hasHonorificBefore = (
  text: string,
  start: number,
  rule: HonorificRule
) =>
  rule.key === "allah" &&
  /(?:the\s+)?(?:Almighty|Most High|Exalted)\s+$/i.test(
    text.slice(Math.max(0, start - 35), start)
  );

const isInsideExistingHonorific = (text: string, start: number) => {
  const before = text.slice(0, start);
  const open = before.lastIndexOf("(");
  const close = before.lastIndexOf(")");
  return (
    open > close &&
    /may Allah|Allah may/i.test(text.slice(open, start + 20))
  );
};

const canonicalKey = (name: string) =>
  prophetCanonicalKeys[name] ?? name.toLowerCase();

export function withHonorifics(text: string): string {
  if (!text) return text;

  let result = text;
  for (const rule of rules) {
    const pattern = buildPattern(rule.names);
    const seen = new Set<string>();
    result = result.replace(
      pattern,
      (
        match,
        name: string,
        possessive = "",
        offset: number,
        source: string
      ) => {
        if (rule.key === "allah" && possessive) return match;
        if (
          rule.key === "allah" &&
          isInsideExistingHonorific(source, offset)
        ) {
          return match;
        }
        if (
          rule.key === "scholar" &&
          isInsideCitation(source, offset, offset + match.length)
        ) {
          return match;
        }

        const seenKey =
          rule.key === "prophet" ? canonicalKey(name) : name.toLowerCase();
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
      }
    );
  }

  return result;
}
