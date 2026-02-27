import { AQEEDAH_TOPICS } from "../../topics";

export type CheckpointConfig = {
  part4: {
    events: Array<{ id: string; label: string }>;
  };
  part8: {
    pairs: Array<{ id: string; left: string; right: string }>;
  };
  part12: {
    options: Array<{ id: string; label: string; isCorrect: boolean }>;
  };
};

const CHECKPOINT_DATA: Record<string, CheckpointConfig> = {
  "aqeedah-1": {
    part4: {
      events: [
        { id: "p4-1", label: "Start with iman in Allah (names, attributes, worship)" },
        { id: "p4-2", label: "Then iman in angels and how they obey/record" },
        { id: "p4-3", label: "Then iman in revealed Books (Qur'an final, preserved)" },
        { id: "p4-4", label: "Then iman in Messengers and their call to tawhid" },
      ],
    },
    part8: {
      pairs: [
        {
          id: "p8-1",
          left: "Resurrection and Judgment",
          right: "Accountability for deeds; Paradise and Hell are real",
        },
        {
          id: "p8-2",
          left: "Divine Decree (Qadar)",
          right: "Allah knows, wrote, wills, and creates all things",
        },
        {
          id: "p8-3",
          left: "Belief in the Angels",
          right: "Created from light, never disobey, carry commands",
        },
        {
          id: "p8-4",
          left: "Belief in the Books",
          right: "Revelations from Allah; Qur'an is final and preserved",
        },
      ],
    },
    part12: {
      options: [
        {
          id: "A",
          label: "The six pillars of iman anchor every action; without them deeds lose value",
          isCorrect: true,
        },
        { id: "B", label: "Iman is optional; actions are enough", isCorrect: false },
        { id: "C", label: "Only belief in Allah matters; the rest are minor", isCorrect: false },
        { id: "D", label: "Belief changes by opinion, not by revelation", isCorrect: false },
      ],
    },
  },
};

function normalizeText(text: unknown): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  if (typeof text === "object" && text !== null && "en" in text) {
    const value = (text as { en?: unknown }).en;
    if (typeof value === "string") return value;
  }
  try {
    return String(text);
  } catch {
    return "";
  }
}

function ensureItems(items: string[], count: number, fallbackPrefix: string) {
  const result = items.filter(Boolean).slice(0, count);
  while (result.length < count) {
    result.push(`${fallbackPrefix} ${result.length + 1}`);
  }
  return result;
}

function buildFallback(slug: string): CheckpointConfig | null {
  const topic = AQEEDAH_TOPICS.find((t) => t.slug === slug);
  if (!topic) return null;

  const titles = topic.sections.map((section) => normalizeText(section.title)).filter(Boolean);
  const topicLabel = normalizeText(topic.name) || "Aqeedah topic";

  const events = ensureItems(titles.slice(0, 4), 4, `${topicLabel}: key point`);
  const pairs = ensureItems(titles.slice(4, 8), 4, `${topicLabel}: cause/effect`);
  const mcqSource = normalizeText(titles[8] ?? titles[titles.length - 1] ?? topicLabel) || topicLabel;

  return {
    part4: {
      events: events.map((label, idx) => ({ id: `p4-${idx}`, label })),
    },
    part8: {
      pairs: pairs.map((label, idx) => ({ id: `p8-${idx}`, left: label, right: `Reflect on: ${label}` })),
    },
    part12: {
      options: [
        { id: "A", label: `Best summary: ${mcqSource}`, isCorrect: true },
        { id: "B", label: `Re-read the evidence section for ${topicLabel}`, isCorrect: false },
        { id: "C", label: `Check earlier parts of ${topicLabel} before continuing`, isCorrect: false },
        { id: "D", label: `Pause and review your notes for ${topicLabel}`, isCorrect: false },
      ],
    },
  };
}

export function getCheckpointData(slug: string): CheckpointConfig | null {
  return CHECKPOINT_DATA[slug] ?? buildFallback(slug);
}
