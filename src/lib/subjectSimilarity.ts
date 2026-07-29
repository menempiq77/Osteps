/**
 * Keyword matching between subject names.
 *
 * Schools name the same subject in many ways across years and languages
 * ("Islamic", "Islamiyat", "Religious Studies", "التربية الإسلامية" …), and each
 * of those is a separate subject row. Content (trackers, assessments, quizzes,
 * year groups, classes) may therefore only be importable from a differently
 * named — often archived — twin of the current subject.
 *
 * A subject name resolves to a canonical key by matching the longest alias of a
 * known subject family; unmatched names fall back to their normalized text so
 * identically named subjects still pair up.
 */

export type SubjectFamily = {
  key: string;
  label: string;
  aliases: string[];
};

// Longest alias wins, so "computer science" resolves to computing rather than
// science, and "physical education" never collides with physics.
export const SUBJECT_FAMILIES: SubjectFamily[] = [
  {
    key: "islamic",
    label: "Islamic",
    aliases: [
      "islamic", "islam", "islami", "islamia", "islamiat", "islamiyat", "islamics",
      "islamic education", "islamic studies", "islamic study", "islamic knowledge",
      "religious studies", "religious education", "religion", "re", "rs",
      "tarbiyah islamiyah", "tarbiya islamia", "deen", "din", "quran", "quraan",
      "qur an", "koran", "tajweed", "tajwid", "hadith", "fiqh", "seerah", "sirah",
      "اسلامية", "اسلاميه", "اسلامي", "اسلاميك", "التربية الاسلامية",
      "تربية اسلامية", "دراسات اسلامية", "دين", "الدين", "قران", "القران",
      "تجويد", "حديث", "فقه", "سيرة",
    ],
  },
  {
    key: "arabic",
    label: "Arabic",
    aliases: [
      "arabic", "arabic language", "arabic studies", "arabic literature",
      "arabic a", "arabic b", "arabic native", "arabic non native", "lughat arabiya",
      "lugha arabiya", "عربي", "عربية", "اللغة العربية", "لغة عربية", "لغتي",
    ],
  },
  {
    key: "english",
    label: "English",
    aliases: [
      "english", "english language", "english literature", "language arts",
      "english language arts", "ela", "literacy", "eal", "esl", "reading writing",
      "انجليزي", "انجليزية", "اللغة الانجليزية", "لغة انجليزية",
    ],
  },
  {
    key: "math",
    label: "Math",
    aliases: [
      "math", "maths", "mathematic", "mathematics", "mathematical",
      "further maths", "further mathematics", "pure maths", "applied maths",
      "numeracy", "algebra", "geometry", "calculus", "statistics", "arithmetic",
      "رياضيات", "الرياضيات", "رياضة بحتة", "حساب",
    ],
  },
  {
    key: "computing",
    label: "Computing",
    aliases: [
      "computing", "computer", "computers", "computer science", "computer studies",
      "computer literacy", "ict", "i c t", "it", "information technology",
      "information communication technology", "informatics", "coding",
      "programming", "digital technology", "digital literacy", "digital design",
      "robotics", "حاسوب", "الحاسوب", "حاسب الي", "الحاسب الالي", "تقنية المعلومات",
      "تكنولوجيا المعلومات", "برمجة",
    ],
  },
  {
    key: "design_technology",
    label: "Design & Technology",
    aliases: [
      "dt", "d t", "design technology", "design and technology", "design tech",
      "product design", "resistant materials", "graphic design", "graphics",
      "engineering", "woodwork", "textiles", "food technology",
      "تصميم وتكنولوجيا", "تصميم", "تكنولوجيا التصميم",
    ],
  },
  {
    key: "physical_education",
    label: "Physical Education",
    aliases: [
      "pe", "p e", "phe", "physical education", "physical training",
      "physical fitness", "sport", "sports", "athletics", "gym", "gymnastics",
      "swimming", "تربية بدنية", "التربية البدنية", "التربية الرياضية", "رياضة",
    ],
  },
  {
    key: "social_studies",
    label: "Social Studies",
    aliases: [
      "social studies", "social study", "socials", "social science",
      "social sciences", "national studies", "national education",
      "citizenship studies", "dirasat ijtimaiya", "دراسات اجتماعية",
      "الدراسات الاجتماعية", "اجتماعيات", "الاجتماعيات", "تربية وطنية",
    ],
  },
  {
    key: "moral_education",
    label: "Moral Education",
    aliases: [
      "moral education", "moral", "morals", "moral science", "moral studies",
      "ethics", "values education", "character education",
      "التربية الاخلاقية", "تربية اخلاقية", "اخلاقية", "الاخلاق",
    ],
  },
  {
    key: "science",
    label: "Science",
    aliases: [
      "science", "sciences", "general science", "combined science",
      "integrated science", "natural science", "علوم", "العلوم", "علوم عامة",
    ],
  },
  { key: "physics", label: "Physics", aliases: ["physics", "physic", "فيزياء", "الفيزياء"] },
  { key: "chemistry", label: "Chemistry", aliases: ["chemistry", "chem", "كيمياء", "الكيمياء"] },
  {
    key: "biology",
    label: "Biology",
    aliases: ["biology", "bio", "life science", "احياء", "الاحياء", "علم الاحياء"],
  },
  {
    key: "environmental_science",
    label: "Environmental Science",
    aliases: [
      "environmental science", "environmental studies", "environment",
      "sustainability", "بيئة", "علوم البيئة",
    ],
  },
  { key: "history", label: "History", aliases: ["history", "hist", "تاريخ", "التاريخ"] },
  { key: "geography", label: "Geography", aliases: ["geography", "geog", "جغرافيا", "الجغرافيا"] },
  {
    key: "humanities",
    label: "Humanities",
    aliases: ["humanities", "humanity", "انسانيات", "العلوم الانسانية"],
  },
  {
    key: "mfl",
    label: "Modern Foreign Languages",
    aliases: [
      "mfl", "m f l", "modern foreign languages", "modern foreign language",
      "modern languages", "foreign languages", "foreign language",
      "additional language", "languages", "لغات", "اللغات",
    ],
  },
  { key: "spanish", label: "Spanish", aliases: ["spanish", "espanol", "اسبانية", "الاسبانية"] },
  { key: "french", label: "French", aliases: ["french", "francais", "فرنسية", "الفرنسية"] },
  { key: "german", label: "German", aliases: ["german", "deutsch", "المانية", "الالمانية"] },
  { key: "urdu", label: "Urdu", aliases: ["urdu", "اردو", "الاردية"] },
  { key: "hindi", label: "Hindi", aliases: ["hindi", "هندي", "الهندية"] },
  { key: "chinese", label: "Chinese", aliases: ["chinese", "mandarin", "صينية", "الصينية"] },
  {
    key: "art",
    label: "Art",
    aliases: [
      "art", "arts", "fine art", "fine arts", "visual art", "visual arts",
      "creative arts", "drawing", "painting", "فنون", "الفنون", "تربية فنية",
      "الفنون البصرية", "رسم",
    ],
  },
  {
    key: "music",
    label: "Music",
    aliases: ["music", "musical", "choir", "band", "موسيقى", "تربية موسيقية"],
  },
  {
    key: "drama",
    label: "Drama",
    aliases: ["drama", "theatre", "theater", "performing arts", "مسرح", "التمثيل"],
  },
  {
    key: "business",
    label: "Business",
    aliases: [
      "business", "business studies", "business management", "commerce",
      "enterprise", "entrepreneurship", "accounting", "accounts", "finance",
      "اعمال", "ادارة الاعمال", "محاسبة", "تجارة",
    ],
  },
  { key: "economics", label: "Economics", aliases: ["economics", "econ", "اقتصاد", "الاقتصاد"] },
  { key: "psychology", label: "Psychology", aliases: ["psychology", "علم النفس"] },
  { key: "sociology", label: "Sociology", aliases: ["sociology", "علم الاجتماع"] },
  {
    key: "pshe",
    label: "PSHE & Wellbeing",
    aliases: [
      "pshe", "shape", "wellbeing", "well being", "health education", "health",
      "life skills", "personal development", "citizenship", "مهارات حياتية",
      "الصحة", "تربية صحية",
    ],
  },
  {
    key: "library",
    label: "Library",
    aliases: ["library", "reading", "research skills", "مكتبة", "المكتبة"],
  },
];

// Dropped before matching: they describe the cohort, not the subject.
const NOISE_TOKENS = new Set([
  "subject", "subjects", "class", "classes", "group", "groups", "department",
  "dept", "section", "stream", "course", "curriculum", "programme", "program",
  "primary", "secondary", "elementary", "middle", "high", "senior", "junior",
  "school", "boys", "girls", "male", "female", "grade", "grades", "year",
  "years", "yr", "term", "semester", "level", "stage", "cycle", "phase",
  "old", "new", "archive", "archived", "copy", "and", "of", "the", "for",
  "a", "an", "b", "c",
]);

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g;

const normalizeArabic = (value: string): string =>
  value
    .replace(ARABIC_DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه");

/** Lowercased, punctuation/diacritic-free text used for all comparisons. */
export const normalizeSubjectText = (value: unknown): string =>
  normalizeArabic(String(value ?? "").toLowerCase())
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, " ")
    .trim();

const tokenize = (value: string): string[] =>
  normalizeSubjectText(value).split(" ").filter(Boolean);

const meaningfulTokens = (value: string): string[] => {
  const tokens = tokenize(value).filter(
    (token) => !NOISE_TOKENS.has(token) && !/^\d+$/.test(token)
  );
  return tokens.length > 0 ? tokens : tokenize(value);
};

const containsSequence = (tokens: string[], sequence: string[]): boolean => {
  if (sequence.length === 0 || sequence.length > tokens.length) return false;
  return tokens.some((_, index) =>
    sequence.every((token, offset) => tokens[index + offset] === token)
  );
};

type AliasEntry = { key: string; tokens: string[] };

// Sorted so the most specific alias is tested first.
const ALIAS_ENTRIES: AliasEntry[] = SUBJECT_FAMILIES.flatMap((family) =>
  family.aliases.map((alias) => ({ key: family.key, tokens: tokenize(alias) }))
)
  .filter((entry) => entry.tokens.length > 0)
  .sort((a, b) => b.tokens.join(" ").length - a.tokens.join(" ").length);

const FAMILY_BY_KEY = new Map(SUBJECT_FAMILIES.map((family) => [family.key, family]));

/**
 * Canonical key for a subject name: a known family key when one of its aliases
 * appears in the name, otherwise the normalized name itself.
 */
export const getSubjectFamilyKey = (name: unknown): string => {
  const tokens = meaningfulTokens(String(name ?? ""));
  if (tokens.length === 0) return "";
  const matched = ALIAS_ENTRIES.find((entry) => containsSequence(tokens, entry.tokens));
  return matched ? matched.key : tokens.join(" ");
};

/** Human-readable name of the matched family, for UI copy. */
export const getSubjectFamilyLabel = (name: unknown): string => {
  const key = getSubjectFamilyKey(name);
  return FAMILY_BY_KEY.get(key)?.label ?? String(name ?? "").trim();
};

export const areSubjectsSimilar = (a: unknown, b: unknown): boolean => {
  const keyA = getSubjectFamilyKey(a);
  const keyB = getSubjectFamilyKey(b);
  return keyA.length > 0 && keyA === keyB;
};

export type SubjectLike = { id: number | string; name?: string | null };

/** Subjects from the same family as `subject`, excluding the subject itself. */
export const findSimilarSubjects = <T extends SubjectLike>(
  subject: SubjectLike | null | undefined,
  subjects: T[]
): T[] => {
  const key = getSubjectFamilyKey(subject?.name);
  if (!key) return [];
  return subjects.filter(
    (candidate) =>
      Number(candidate.id) !== Number(subject?.id) &&
      getSubjectFamilyKey(candidate.name) === key
  );
};
