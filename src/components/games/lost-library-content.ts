export type LostLibraryClueKind = "call" | "ark" | "flood" | "mountain";

export type LostLibraryClue = {
  id: string;
  kind: LostLibraryClueKind;
  title: string;
  discovery: string;
  sequenceLabel: string;
  position: {
    x: number;
    y: number;
  };
};

export type LostLibrarySubjectPack = {
  id: string;
  subject: string;
  title: string;
  subtitle: string;
  entryCost: number;
  room: {
    id: string;
    title: string;
    eyebrow: string;
    objective: string;
    badge: string;
    clues: LostLibraryClue[];
    startingOrder: string[];
    correctOrder: string[];
  };
};

export const STORIES_OF_THE_PROPHETS_PACK: LostLibrarySubjectPack = {
  id: "stories-of-the-prophets",
  subject: "Islamic Studies",
  title: "The Lost Scrolls",
  subtitle: "Stories of the Prophets",
  entryCost: 10,
  room: {
    id: "nuh-timeline-gallery",
    title: "The Gallery of the Ark",
    eyebrow: "Room one",
    objective:
      "Find the four glowing clues, then restore the scroll of Prophet Nuh (peace be upon him) in the correct order.",
    badge: "Keeper of the First Scroll",
    clues: [
      {
        id: "call",
        kind: "call",
        title: "The Call",
        discovery:
          "Prophet Nuh (peace be upon him) called his people to worship Allah alone with extraordinary patience.",
        sequenceLabel:
          "Prophet Nuh calls his people to worship Allah alone.",
        position: { x: 13, y: 66 },
      },
      {
        id: "ark",
        kind: "ark",
        title: "The Ark",
        discovery:
          "Allah commanded Prophet Nuh (peace be upon him) to build the Ark under divine guidance.",
        sequenceLabel:
          "The Ark is built by Allah's command and guidance.",
        position: { x: 37, y: 54 },
      },
      {
        id: "flood",
        kind: "flood",
        title: "The Flood",
        discovery:
          "When the sign came, the believers boarded the Ark and the flood began.",
        sequenceLabel:
          "The sign comes, the believers board, and the flood begins.",
        position: { x: 70, y: 45 },
      },
      {
        id: "mountain",
        kind: "mountain",
        title: "The New Beginning",
        discovery:
          "The waters receded, the Ark came to rest, and Allah granted the believers a new beginning.",
        sequenceLabel:
          "The water recedes and the believers receive a new beginning.",
        position: { x: 88, y: 53 },
      },
    ],
    startingOrder: ["ark", "mountain", "call", "flood"],
    correctOrder: ["call", "ark", "flood", "mountain"],
  },
};
