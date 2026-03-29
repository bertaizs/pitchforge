console.log("init");

const STATS = {
  tough: {
    icon: "⚔️", // 🦾💪⚔️ 🐉🦖🪨🔨⚓
    text: `A measure of physical strength, health, fortitude and endurance, including how one can use these effectively. Determines how much damage one can take or how much one can inflict in combat. Also includes a 'never give up, never surrender' attitude. Toughness may also inspire or intimidate others.`,
  },
  cool: { // 🤹🎩🐈‍⬛
    icon: "❄️", // 😎🌟❄️
    text: `A measure of dexterity, agility, precision; allows one consistently execute the skills they learned and remain calm and professional even when under pressure.`,
  },
  sharp: { // ♟️🦑🗡️👁️🧠✏️
    icon: "👁️",
    text: `Ability to think logically, rationally and notice tiny details and coming to quick conclusions. Determines overall intelligence and how well one can read the situation and use their mind.`,
  },
  charm: { // 🎼🎵🎶🦄🧜‍♀️🧜
    icon: "🎶",
    text: `Charisma and harmony; the strength of one's personality, allowing one to influence or seduce others and also resisting influence and being who they are. Expresses one's spirituality and the ability to lead or empathize with others and read their feelings.`,
  },
  // 🗡️👁️
  // weird: {     // --> shall be a trait, a spec for CHARM in certain cases
  //   icon: "🦑",
  // },
};

const POINTS = {
  body: {
    text: "Physical wellbeing and readiness. Lose body points when you taking damage, getting hurt, getting tired or off-ballance. One can recover body points quickly, but one will go down when losing all body points.",
    icon: "❤️",  //💖
  },
  spirit: {
    text: "Spiritual freshness and power. Use spirit points for special abilities, lose them when going through trauma or getting hit by non-physical means. One can recover spirit points quickly, but will go down when losing all spirit points.",
    icon: "⚡",
  },
  cp: {
    icon: "❇️", // ✳️❇️✴️
  }
}


const BONUS = 3;
const PENALTY = -BONUS;
const CP_PER_LEVEL = 4;

const LETHAL_WOUND = 6

const TRAITS = {

  lockpicking: {
    text: `Open locks, via lockpicks`,
    stat: "cool",
  },
  
  perception: {
    text: `Notice clues, secrets, read and understand the your environment.`,
    stat: "sharp",
  },

  'martial arts': {
    text: `Fight with bare hands and feet, deliver powerful kicks.`,
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
}

const OTHER_KEYWORDS = {
  'character points': {
    text: `One can purchase stats or traits from character points. One can distribute a certain amount of cps at each level-up.`
  },
  'level': {
    text: `Measures your overall experience. Does not directly influence any stat values or tests, but rather an abstract measure of how experienced one is; more experienced characters have higher stat values and more traits and thus more likely to succeed on tests.`
  },
  'equipment': {
    text: `Weapons you wield, armour you wear and all other items you have readied for immediate use.`
  },
  'inventory': {
    text: `Items you are carrying.`
  },
}
