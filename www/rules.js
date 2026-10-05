console.log("init");

const MAX_STAT = Infinity
const MIN_STAT = -3
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
  charm: { // 🎼🎵🎶🦄🧜‍♀️🧜♥️
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

const ELEMENTS = {
  kinetic: true,
  energy: true,
  bio: true,
  cyber: true,
  psy: true,
  true: true,
}


// const CP_PER_LEVEL = 4;

function STARTING_CP() { return 14 }
function CP_GAINED_FIXED() { return 1 }
function CP_GAINED_VARIABLE(n) { return 0.5 } 
function CP_GAINED_AT_LEVEL(n) { return Math.trunc( CP_GAINED_FIXED() + CP_GAINED_VARIABLE(n)*n ) }
function TOTAL_CP_AT_LEVEL(n) {
  sum = STARTING_CP()
  while(n>0) {
    sum += CP_GAINED_AT_LEVEL(n)
    n--
  }
  return sum
}

function CP_COST_OF_STAT_POINT(n) {
  if(n>0) return n
    else  return 1
}
function TOTAL_CP_COST_OF_STAT(n) {
  sum = 0
  while(n>0) {
    sum += CP_COST_OF_STAT_POINT(n)
    n--
  }
  return sum
}
function HIGHEST_STAT_FROM_CPS(cps) {
  let stat = 0
  let cost = CP_COST_OF_STAT_POINT(0)
  while( cost<=cps ) {
    stat++
    cost += CP_COST_OF_STAT_POINT(stat)
  }
  return (stat-1)
}

function DIFFICULTY(d = {}) {
  d.level ??= 1
  d.trait ??= true // true, false, "half"
  d.difficulty ??= 0
  d.type ??= 'MEDIUM'

  const TYPE = {
    'SUPER_EASY': 0,
    'VERY_EASY':  1/8,
    'EASY':       1/4,
    'MEDIUM':     0.5, 
    'HARD':       0.75,
    'SUPER_HARD': 1,
  }
  let cps = TOTAL_CP_AT_LEVEL(d.level)
  cps = Math.trunc( TYPE[d.type]*cps )

  let stat = HIGHEST_STAT_FROM_CPS(cps)

  if( d.trait === true )
    stat += d.level
  else if( d.trait == "half" )
    stat += Math.trunc(d.level/2)

  stat += d.difficulty
  return stat
}

const BONUS = 3;
const PENALTY = -BONUS;

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
