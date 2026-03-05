console.log("init");

const STATS = {
  tough: {
    icon: "⚔️", // 💪⚔️ 🐉🦖🪨
    text: `A measure of physical strength, health, fortitude and endurance, including how one can use these effectively. Determines how much damage one can take or how much one can inflict in combat. Also includes a 'never give up, never surrender' attitude. Toughness may also inspire or intimidate others.`,
  },
  cool: { // 🤹🎩🐈‍⬛
    icon: "🌟", // 😎🌟❄️
    text: `A measure of dexterity, agility, precision; allows one consistently execute the skills they learned and remain calm and professional even when under pressure.`,
  },
  sharp: { // ♟️🦑🗡️
    icon: "🧠",
    text: `Ability to think logically, rationally and notice tiny details and coming to quick conclusions. Determines overall intelligence and how well one can read the situation and use their mind.`,
  },
  charm: { // 🎵🎶🦄🧜‍♀️🧜
    icon: "🎼",
    text: `Charisma and harmony; the strength of one's personality, allowing one to influence or seduce others and also resisting influence and being who they are. Expresses one's spirituality and the ability to lead or empathize with others and read their feelings.`,
  },
  // 🗡️👁️
  // weird: {     // --> shall be a trait, a spec for CHARM in certain cases
  //   icon: "🦑",
  // },
};

const POINTS = {
  body: {
    icon: "💖",
  },
  spirit: {
    icon: "⚡",
  },
}

// SKILLS = {
//   melee: {},
//   lockpicking: {},
// };

const BONUS = 3;
const PENALTY = -BONUS;
const CP_PER_LEVEL = 4;

const LETHAL_WOUND = 6

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
