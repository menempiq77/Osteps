export type LostLibraryClueKind = "call" | "ark" | "flood" | "mountain";
export type HallSignKind =
  | "call"
  | "ark"
  | "mountain"
  | "crown"
  | "flame"
  | "sword";

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

export type HallSign = {
  id: string;
  kind: HallSignKind;
  title: string;
  discovery: string;
  isStorySign: boolean;
  position: {
    x: number;
    y: number;
  };
};

export type HallMeaning = {
  id: string;
  title: string;
  detail: string;
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
  hall: {
    id: string;
    title: string;
    eyebrow: string;
    objective: string;
    badge: string;
    signs: HallSign[];
    meanings: HallMeaning[];
    correctMatches: {
      signId: string;
      meaningId: string;
    }[];
    startingLock: string[];
    correctLock: string[];
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
  hall: {
    id: "nuh-hall-of-signs",
    title: "The Hall of Signs",
    eyebrow: "Room two",
    objective:
      "Find the three signs connected to the story, match each sign to its lesson, then open the symbol lock.",
    badge: "Keeper of the Second Seal",
    signs: [
      {
        id: "call",
        kind: "call",
        title: "The Call",
        discovery:
          "The call reminds us that Prophet Nuh (peace be upon him) continued inviting his people to worship Allah alone with patience.",
        isStorySign: true,
        position: { x: 10, y: 53 },
      },
      {
        id: "ark",
        kind: "ark",
        title: "The Ark",
        discovery:
          "The Ark reminds us that Prophet Nuh (peace be upon him) followed Allah's command and trusted His guidance.",
        isStorySign: true,
        position: { x: 24, y: 60 },
      },
      {
        id: "mountain",
        kind: "mountain",
        title: "The New Beginning",
        discovery:
          "The mountain sign marks the moment the waters receded and the believers received a new beginning.",
        isStorySign: true,
        position: { x: 36, y: 45 },
      },
      {
        id: "crown",
        kind: "crown",
        title: "The Crown",
        discovery:
          "This sign belongs to another lost story. It is not one of the three signs needed for this door.",
        isStorySign: false,
        position: { x: 64, y: 45 },
      },
      {
        id: "flame",
        kind: "flame",
        title: "The Flame",
        discovery:
          "This sign belongs to another lost story. It is not one of the three signs needed for this door.",
        isStorySign: false,
        position: { x: 77, y: 60 },
      },
      {
        id: "sword",
        kind: "sword",
        title: "The Sword",
        discovery:
          "This sign belongs to another lost story. It is not one of the three signs needed for this door.",
        isStorySign: false,
        position: { x: 91, y: 53 },
      },
    ],
    meanings: [
      {
        id: "patience",
        title: "Patience",
        detail: "Continue sharing truth with wisdom and patience.",
      },
      {
        id: "guidance",
        title: "Follow guidance",
        detail: "Obey Allah's command and trust His guidance.",
      },
      {
        id: "hope",
        title: "Hope after hardship",
        detail: "Remember that hardship can be followed by a new beginning.",
      },
    ],
    correctMatches: [
      { signId: "call", meaningId: "patience" },
      { signId: "ark", meaningId: "guidance" },
      { signId: "mountain", meaningId: "hope" },
    ],
    startingLock: ["mountain", "call", "ark"],
    correctLock: ["call", "ark", "mountain"],
  },
};
