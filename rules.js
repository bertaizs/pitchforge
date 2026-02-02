console.log("init");

const STATS = {
  tough: {
    icon: "💪", // ⚔️
  },
  cool: {
    icon: "❄️", // 😎
  },
  sharp: {
    icon: "🧠",
  },
  charm: {
    icon: "🎼",
  },
  weird: {
    icon: "🦑",
  },
};

SKILLS = {
  melee: {},
  lockpicking: {},
};

const TESTS = {
  tough: new Test({ stat: "tough" }),
  cool: new Test({ stat: "cool" }), //
  sharp: new Test({ stat: "sharp" }),
  charm: new Test({ stat: "charm" }),
  weird: new Test({ stat: "weird" }),

  /*
  // TOUGH
  tough: new Test({ stat: "tough" }),
  melee: new Test({ stat: "tough" }),
  athletics: new Test({ stat: "tough" }),
  survival: new Test({ stat: "tough" }), // sometimes cool/sharp

  // COOL|FINESSE  - SKILL
  cool: new Test({ stat: "cool" }), //
  aim: new Test({ stat: "cool" }), // dexterity, accuracy
  agility: new Test({ stat: "cool" }),
  evasion: new Test({ stat: "cool" }), // ????
  // PROF|CRAFT
  craft: new Test({ stat: "cool" }),  // PROF

  // WISE|SCHOLAR
  sharp: new Test({ stat: "sharp" }),
  science: new Test({ stat: "sharp" }),
  tech: new Test({ stat: "sharp" }), // sometimes cool
  // SHARP|WITS
  perception: new Test({ stat: "sharp" }),
  initiative: new Test({ stat: "sharp" }),

  // CHARM
  charm: new Test({ stat: "charm" }),
  inspire: new Test({ stat: "charm" }), // sometimes others
  sexuality: new Test({ stat: "charm" }),
  inspire: new Test({ stat: "charm" }),
  empathy: new Test({ stat: "charm" }),
  art: new Test({ stat: "charm" }),
  harmony: new Test({ stat: "charm" }),

  // WEIRD
  weird: new Test({ stat: "weird" }),
  weird: new Test({ stat: "touch" }),
  weird: new Test({ stat: "chaos" }),
 */
  /*
  strength: new Test({ stat: "tough" }),
  health: new Test({ stat: "tough" }),
  endurance: new Test({ stat: "tough" }),
  athletics: new Test({ stat: "tough" }),
  attack: new Test({ stat: "tough" }), // attack, strike ?
  defend: new Test({ stat: "tough" }),
  intimidate: new Test({ stat: "tough" }),
  // inspire

  dexterity: new Test({ stat: "cool" }),
  accuracy: new Test({ stat: "cool" }), // needed???
  agility: new Test({ stat: "cool" }),
  evasion: new Test({ stat: "cool" }),
  focus: new Test({ stat: "cool" }),
  // impress
  // trick
  craft: new Test({ stat: "cool" }), // ***

  sharp: new Test({ stat: "sharp" }),
  //  ===========================================
  reasoning: new Test({ stat: "sharp" }),
  memory: new Test({ stat: "sharp" }),
  lore: new Test({ stat: "sharp" }), // ***
  perception: new Test({ stat: "sharp" }),
  initiative: new Test({ stat: "sharp" }),
  science: new Test({ stat: "sharp" }), // ***
  research: new Test({ stat: "sharp" }),

  charm: new Test({ stat: "charm" }),
  //  ===========================================
  leadership: new Test({ stat: "charm" }),
  sexuality: new Test({ stat: "charm" }),
  empathy: new Test({ stat: "charm" }),
  resistance: new Test({ stat: "charm" }),
  "self-control": new Test({ stat: "charm" }),
  social: new Test({ stat: "charm" }),
  art: new Test({ stat: "charm" }), // ***
  "sixth sense": new Test({ stat: "charm" }),

  */
};

const BONUS = 3;
const PENALTY = -BONUS;
const CP_PER_LEVEL = 4;

const TRAITS = {
  melee: {
    stat: "tough",
  },

  lockpicking: {
    stat: "cool",
  },

  "absent-minded": {
    sharp: +1,
    initiative: PENALTY,
    perception: PENALTY,
  },

  bruiser: {
    tough: +1,
    cool: -1,
    sharp: -1,
  },

  weirdo: {
    charm: -1,
  },

  strength: {
    strength: 2,
  },

  initiative: {
    stat: "cool",
  },
};
