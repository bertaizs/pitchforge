console.log("init");

const STATS = {
  tough: {
    icon: "💪", // ⚔️ 🐉🦖🪨
  },
  cool: { // 🤹🎩🐈‍⬛
    icon: "❄️", // 😎
  },
  sharp: { // ♟️🦑
    icon: "🧠",
  },
  charm: { // 🎵🎶🦄🧜‍♀️🧜
    icon: "🎼",
  },
  // 🗡️👁️
  // weird: {
  //   icon: "🦑",
  // },
};

SKILLS = {
  melee: {},
  lockpicking: {},
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

  // "absent-minded": {
  //   sharp: +1,
  //   initiative: PENALTY,
  //   perception: PENALTY,
  // },

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
