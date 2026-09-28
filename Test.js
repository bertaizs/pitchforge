class Test {
  static AUTOPASS = -Infinity
  static CHILDSPLAY=-2
  static TRIVIAL = -1
  static MUNDANE =  0
  static BASIC =    1
  static EASY =     2
  static MEDIUM =   3
  static ADVANCED = 4
  static HARD =     5
  static VERYHARD = 6   // cap here?
  static PRO =      7
  static SPECIALIST=8
  static MASTER =   9
  static GRANDMASTER=10
  static PARAGON = 11
  static IMPOSSIBLE = Infinity
  
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

    TESTS[test.name] = test
    return test
  }
  
  get_name() {
    if( 'name' in this ) 
      return this.name
    else
      return this.stat[0]
  }
  
} // class Test


const TESTS = {
  'lockpicking': new Test({stat: "cool", trait: 'thievery', status: {'progress': -1} }),
  'pickpocket': new Test({stat: "cool", trait: 'thievery'}),

  'climbing': new Test({stat: 'cool', trait: 'climbing'}),
  'crafting': new Test({stat: 'cool', trait: 'crafting'}),

  'social': new Test({stat: "charm", trait: 'social'}),
};


Test.register({stat: 'tough'})
Test.register({stat: 'cool'})
Test.register({stat: 'sharp'})
Test.register({stat: 'charm'})

Test.register({name: "attack",    stat: 'tough',  randomize: options.randomize_attacks})
Test.register({name: "defense",   stat: 'tough', status: {'threat': -1}})

Test.register({name: "resistance",   stat: 'charm', status: {'threat': -1}})

Test.register({trait: 'perception', stat: 'sharp'})
Test.register({trait: 'initiative', stat: 'sharp'})

Test.register({trait: 'sixth sense', stat: 'charm'})
