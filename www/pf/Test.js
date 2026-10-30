class Test {

  
  constructor(value = {}, param = {}) {
    for( let i in value ) this[i] = value[i];
    for( let i in param ) this[i] = param[i]

    if (!("stat" in this)) {
      console.log(this)
      throw "no test without a stat!";
    }

    this.stat = arrayify(this.stat);

    this.randomize ??= options.randomize_tests_by_default

    this.trait ??= []
    this.trait = arrayify(this.trait)
    
    this.half_trait ??= []
    this.half_trait = arrayify(this.half_trait)

    this.name ??= (this.trait.length>0 ? this.trait[0] : this.stat[0])
  }

  static register(test_data = {}, param = {}) {
    let test = new Test( test_data, param )

    if( test.name in TESTS ) throw `${test.name} already defined`

    for( let t of test.trait ) {
      CORE_TRAITS.add(t)  // !!!
    }
    
    TESTS[test.name] = test
    return test
  }
  
  get_name() {
    if( 'name' in this ) 
      return this.name
    else
      return this.stat[0]
  }

  get_text() {
    if( 'text' in this )
      return this.text
    else
      return this.get_name()
  }
  
} // class Test


const TESTS = {}

const CORE_TRAITS = new Set()


// CORE STAT, no traits

Test.register({stat: 'tough'})
Test.register({stat: 'cool'})
Test.register({stat: 'sharp'})
Test.register({stat: 'charm'})

// COMBAT

// Test.register({name: "attack",    stat: 'tough',  randomize: options.randomize_attacks})
Test.register({name: "block",         trait: 'combat',      stat: 'tough',  status: {'threat': -1}})
Test.register({name: "feint",         trait: 'combat',      stat: 'cool', randomize: true})
Test.register({name: "aim",           trait: "combat", stat: 'cool'})   // ranged
// cover?

Test.register({                       trait: "swordfighting", stat: 'cool'})
Test.register({                       trait: "martial arts", stat: 'cool'})

Test.register({                       trait: 'evasion',     stat: 'cool',   status: {'threat': -1}})

Test.register({                       trait: "assassination", stat: 'cool'})

Test.register({trait:   'initiative', stat: 'sharp'})


// SURVIVAL

Test.register({                           trait: 'survival', stat: 'tough'})
Test.register({name: "survival skills",   trait: 'survival', stat: 'cool'})
Test.register({name: "survival knowledge",trait: 'survival', stat: 'sharp'})

Test.register({                           trait: 'perception', stat: 'sharp'})
Test.register({name: "spot",              trait: 'perception', stat: 'sharp', randomize: true, text: ` attempty to spot `})

Test.register({name: "resistance",   stat: 'charm', status: {'threat': -1}})

Test.register({trait: 'sixth sense', stat: 'charm'})

// Test.register({name: "nature survival",    trait: 'nature',      stat: 'tough' })
Test.register({name: "nature skills",     trait: 'nature',      stat: 'cool' })
Test.register({name: "nature knowledge",  trait: 'nature',      stat: 'sharp' })
Test.register({name: "nature empathy",    trait: 'nature',      stat: 'charm' })

// SKILLS
Test.register({                           trait: 'athletics',   stat: 'tough'})
// Test.register({name: "athletics strength",trait: 'athletics',  stat: 'tough'})
// Test.register({name: "athletics dexterity",trait: 'athletics', stat: 'cool'})

Test.register({                           trait: 'piloting',    stat: 'cool'})
Test.register({                           trait: 'riding',      stat: ['cool', 'charm'], half_trait: 'nature'})
Test.register({                           trait: 'stealth',     stat: 'cool'})
Test.register({                           trait: 'climbing',    stat: 'cool' })

Test.register({name: "lockpicking",       trait: 'thievery',    stat: 'cool' })
Test.register({name: "pickpocket",        trait: 'thievery',    stat: 'cool' })

Test.register({                           trait: 'crafting',    stat: 'cool' })
Test.register({name: "crafting strength", trait: 'crafting',    stat: 'tough' })
Test.register({name: "crafting ingenuity",trait: 'crafting',    stat: 'sharp' })
Test.register({name: "crafting soul",     trait: 'crafting',    stat: 'charm' })
// Test.register({name: "repair",            trait: 'crafting',    stat: 'cool' })

Test.register({                           trait: 'tech use',    stat: 'sharp' })
Test.register({name: "tech use reflexes", trait: 'tech use',    stat: 'cool' })

Test.register({                           trait: 'first aid',   stat: 'cool' })

// KNOWLEDGE
Test.register({                           trait: 'science',     stat: 'sharp' })
Test.register({                           trait: 'lore',        stat: 'sharp' })

// COMMUNICATION
// social????
Test.register({                           trait: 'leadership',  stat: 'charm' })
Test.register({name: "leadership power",  trait: 'leadership',  stat: 'tough' })
Test.register({name: "leadership ingenuity",trait: 'leadership',stat: 'sharp' })

// ???
Test.register({                           trait: 'social', stat: 'charm' })
Test.register({name: "influencing",       trait: 'social', stat: 'charm' })
Test.register({name: "lying",             trait: 'social', stat: ['charm', 'cool'] })
Test.register({name: "intimidation",      trait: 'social', stat: ['charm', 'tough'] })
Test.register({name: "bargaining",        trait: 'social', stat: ['charm', 'sharp'] })

Test.register({                           trait: 'sexuality',   stat: 'charm' })
Test.register({name: "sexuality endurance",trait: 'sexuality',   stat: 'tough' })
Test.register({name: "sexuality skill",   trait: 'sexuality',   stat: 'cool' })

Test.register({                           trait: 'art',   stat: 'charm' })
Test.register({name: "art skill",         trait: 'art',   stat: 'cool' })
Test.register({name: "art knowledge",     trait: 'art',   stat: 'sharp' })
