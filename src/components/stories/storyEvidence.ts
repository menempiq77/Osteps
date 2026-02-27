export type StoryEvidence = {
  quranRefs?: string[];
  /** Student-friendly note (your own words) next to the evidence. */
  note?: string;
  hadith?: Array<{
    source: string;
    meaning: string;
  }>;
};

// Evidence inserted in the reader UI without changing section titles/order.
// Index here is the section index (0-based) in each story.
export const STORY_EVIDENCE_BY_SLUG: Record<string, Record<number, StoryEvidence>> = {
  adam: { 0: { quranRefs: ["2:30"], note: "Allah announces placing a vicegerent on earth." } },
  idris: { 0: { quranRefs: ["19:56"], note: "Idris is mentioned as truthful and a prophet." } },
  nuh: { 0: { quranRefs: ["71:1"], note: "The mission of Nuh is summarized at the start of Surah Nuh." } },
  hud: { 0: { quranRefs: ["11:50"], note: "Hud calls his people to worship Allah alone." } },
  salih: { 0: { quranRefs: ["11:61"], note: "Salih calls to worship Allah and seek forgiveness." } },
  ibrahim: { 0: { quranRefs: ["21:69"], note: "Allah saves Ibrahim from the fire." } },
  lut: { 0: { quranRefs: ["11:77"], note: "The angels come to Lut (as mentioned in Surah Hud)." } },
  ismail: { 0: { quranRefs: ["19:54"], note: "Ismail is praised for keeping promises." } },
  ishaq: { 0: { quranRefs: ["11:71"], note: "Glad tidings of Ishaq are mentioned." } },
  yaqub: { 0: { quranRefs: ["12:86"], note: "Yaqub shows patience and turns to Allah." } },
  yusuf: { 0: { quranRefs: ["12:92"], note: "Yusuf forgives and comforts his brothers." } },
  ayyub: { 0: { quranRefs: ["21:83"], note: "Ayyub makes du'a in hardship." } },
  shuayb: { 0: { quranRefs: ["11:84"], note: "Shu'ayb calls to worship Allah and be honest in trade." } },
  musa: { 0: { quranRefs: ["20:9"], note: "Allah introduces the story of Musa." } },
  harun: { 0: { quranRefs: ["20:30"], note: "Harun is mentioned as Musa's helper." } },
  "dhul-kifl": { 0: { quranRefs: ["21:85"], note: "Dhul-Kifl is mentioned among the patient." } },
  dawud: { 0: { quranRefs: ["38:17"], note: "Dawud is mentioned for strength and worship." } },
  sulayman: { 0: { quranRefs: ["27:16"], note: "Sulayman shows gratitude for Allah's gifts." } },
  ilyas: { 0: { quranRefs: ["37:123"], note: "Ilyas is mentioned as one of the messengers." } },
  "al-yasa": { 0: { quranRefs: ["6:86"], note: "Al-Yasa is listed among the righteous." } },
  yunus: { 0: { quranRefs: ["21:87"], note: "Yunus calls upon Allah in distress." } },
  zakariyya: { 0: { quranRefs: ["19:4"], note: "Zakariyya makes a humble du'a." } },
  yahya: { 0: { quranRefs: ["19:12"], note: "Yahya is given wisdom as a child." } },
  isa: { 0: { quranRefs: ["19:30"], note: "Isa speaks by Allah's permission (verse can be shown in Arabic)." } },
  muhammad: {
    0: {
      quranRefs: ["33:21"],
      note: "The Messenger is the best example to follow.",
      hadith: [
        {
          source: "Sahih Muslim (meaning)",
          meaning: "The Prophet said he was sent to perfect good character.",
        },
      ],
    },
  },
};

/* Disabled corrupted content (leftover from a failed edit)
  ishaq: {
    0: {
      quranRefs: ["11:71"],
      note: "Glad tidings of Ishaq are mentioned.",
    },
  },
  yaqub: {
    0: {
      quranRefs: ["12:86"],
      note: "Yaqub shows patience and turns to Allah.",
    },
  },
  yusuf: {
    0: {
      quranRefs: ["12:92"],
      note: "Yusuf forgives and comforts his brothers.",
    },
  },
  ayyub: {
    0: {
      quranRefs: ["21:83"],
      note: "Ayyub makes du'a in hardship.",
    },
  },
  shuayb: {
    0: {
      quranRefs: ["11:84"],
      note: "Shu'ayb calls to worship Allah and be honest in trade.",
    },
  },
  musa: {
    0: {
      quranRefs: ["20:9"],
      note: "Allah introduces the story of Musa.",
    },
  },
  harun: {
    0: {
      quranRefs: ["20:30"],
      note: "Harun is mentioned as Musa's helper.",
    },
  },
  "dhul-kifl": {
    0: {
      quranRefs: ["21:85"],
      note: "Dhul-Kifl is mentioned among the patient.",
    },
  },
  dawud: {
    0: {
      quranRefs: ["38:17"],
      note: "Dawud is mentioned for strength and worship.",
    },
  },
  sulayman: {
    0: {
      quranRefs: ["27:16"],
      note: "Sulayman shows gratitude for Allah's gifts.",
    },
  },
  ilyas: {
    0: {
      quranRefs: ["37:123"],
      note: "Ilyas is mentioned as one of the messengers.",
    },
  },
  "al-yasa": {
    0: {
      quranRefs: ["6:86"],
      note: "Al-Yasa is listed among the righteous.",
    },
  },
  yunus: {
    0: {
      quranRefs: ["21:87"],
      note: "Yunus calls upon Allah in distress.",
    },
  },
  zakariyya: {
    0: {
      quranRefs: ["19:4"],
      note: "Zakariyya makes a humble du'a.",
    },
  },
  yahya: {
    0: {
      quranRefs: ["19:12"],
      note: "Yahya is given wisdom as a child.",
    },
  },
  isa: {
    0: {
      quranRefs: ["19:30"],
      note: "Isa speaks by Allah's permission (verse can be shown in Arabic).",
    },
  },
  muhammad: {
    0: {
      quranRefs: ["33:21"],
      note: "The Messenger is the best example to follow.",
      hadith: [
        {
          source: "Sahih Muslim (meaning)",
          meaning: "The Prophet said he was sent to perfect good character.",
        },
      ],
  "dhul-kifl": {
    0: {
};
      quranRefs: ["21:85"],
      note: "This verse mentions Dhul-Kifl among the patient.",
    },
  },
  dawud: {
    0: {
      quranRefs: ["38:17"],
      note: "This verse mentions Dawud and his strength in worship.",
    },
  },
  sulayman: {
    0: {
      quranRefs: ["27:16"],
      note: "This verse mentions Sulayman’s blessings and gratitude.",
    },
  },
  ilyas: {
    0: {
      quranRefs: ["37:123"],
      note: "This verse mentions Ilyas as one of the messengers.",
    },
  },
  "al-yasa": {
    0: {
      quranRefs: ["6:86"],
      note: "This verse includes Al‑Yasa‘ among the righteous.",
    },
  },
  yunus: {
    0: {
      quranRefs: ["21:87"],
      note: "This verse mentions Yunus’s du‘a in distress.",
    },
  },
  zakariyya: {
    0: {
      quranRefs: ["19:4"],
      note: "This verse shows Zakariyya’s humble du‘a.",
    },
  },
  yahya: {
    0: {
      quranRefs: ["19:12"],
      note: "This verse mentions Yahya being given wisdom as a child.",
    },
  },
  isa: {
    0: {
      quranRefs: ["19:30"],
      note: "This verse quotes Isa speaking as a baby: ‘I am the servant of Allah…’ (Arabic shown).",

*/