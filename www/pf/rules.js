
class RuleBook {

  MAX_STAT() { return Infinity } 
  MIN_STAT() { return -3 }

  AVG_STAT = ()=> 99

  STATS = ()=> STATS

  POINTS = ()=> POINTS
  
  // STATS() { return STATS }

  starting_cp() { return 14 }     // # of cps a character starts with
  cp_gained_fixed() { return 1 }  // # of cps a character always gains at each level
  cp_gained_variable(n) { return 0.5 } // # of cps a character gains at each level depending on level
  cp_gained_at_level(n) { return Math.trunc( this.cp_gained_fixed() + this.cp_gained_variable(n)*n ) } // # of cps a character gains when levelling up to level n

  total_cp_at_level(n) {          // # of cps a character can spend once reached level n
    let sum = this.starting_cp()
    while(n>0) {
      sum += this.cp_gained_at_level(n)
      n--
    }
    return sum
  }

  cp_cost_of_stat_point(n) {       // cp cost when increasing a stat from n-1 to n 
    if(n>0) return n
      else  return 1
  }
  
  total_cp_cost_of_stat(n) {      // total cp cost of increasing a stat from 0 to n
    sum = 0
    while(n>0) {
      sum += this.cp_cost_of_stat_point(n)
      n--
    }
    return sum
  }

  highest_stat_from_cps(cps) {    // how high one can increase a stat from 0 from cps character points
    let stat = 0
    let cost = this.cp_cost_of_stat_point(0)
    while( cost<=cps ) {
      stat++
      cost += this.cp_cost_of_stat_point(stat)
    }
    return (stat-1)
  }

  level_bonus(n) { return n + 1 }   // full level bonus to performance if there is an aligned trait
  level_bonus_half(n) { return Math.trunc( this.level_bonus(n)/2 ) }  // half level bonus to performance if there is an aligned half-trait

  static GLOBAL_DIFFICULTY = 0
  
  // calculates a difficulty rating based on the below
  difficulty(d = {}) {
    if(typeof d == 'string') d = {type: d, trait: false, level: 1}
    d.type ??= 'MEDIUM' // calculate this level of difficulty
    d.level ??= 1       // for a character of this level - calculating stats and any level bonus
    d.trait ??= true    // who has an aligned trait (true, false, "half") - if level bonus should be applied
    d.difficulty ??= 0  // extra +/-
    // also influenced by GLOBAL_DIFFICULTY
  
    const TYPE = {
      'SUPER_EASY': 0,
      'VERY_EASY':  1/8,
      'EASY':       1/4,
      'MEDIUM':     0.4, 
      'ADVANCED':  0.5, 
      'HARD':       0.75,
      'SUPER_HARD': 1,
    }
    let cps = this.total_cp_at_level(d.level)
    cps = Math.trunc( TYPE[d.type]*cps )
  
    let stat = this.highest_stat_from_cps(cps)
  
    if( d.trait === true )
      stat += rules.level_bonus(d.level)
    else if( d.trait == "half" )
      stat += rules.level_bonus_half(d.level)
  
    stat += d.difficulty
    stat += RuleBook.GLOBAL_DIFFICULTY
    return stat
  }
    
}

var rules = new RuleBook()
globalThis.rules = rules


var RULEBOOK = {}
globalThis.RULEBOOK = RULEBOOK
var RB = RULEBOOK
globalThis.RB = RULEBOOK




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

POINTS = {
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

ELEMENTS = {
  kinetic: true,  // blue
  energy: true,   // orange
  bio: true,      // green
  tech: true,     // purple
  psy: true,      // cyan
  true: true,     // white
}







const HEAVY_ATTACK_DIFFICULTY = -2
const HEAVY_ATTACK_BONUS_DAMAGE = 2


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
