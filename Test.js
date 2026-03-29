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

    if (!("stat" in this)) throw "no test without a stat!";

    this.stat = arrayify(this.stat);

    // this.randomize = true  // to randomize the test

    this.spec ??= [];
    this.spec = arrayify(this.spec);

    // if ("name" in this)
    //   TESTS[this.name] = this;
  }
  
  get_name() {
    if( 'name' in this ) 
      return this.name
    else
      return this.stat[0]
  }
  
} // class Test

const TESTS = {
  tough: new Test({ stat: "tough" }),
  cool: new Test({ stat: "cool" }), //
  sharp: new Test({ stat: "sharp" }),
  charm: new Test({ stat: "charm" }),
  weird: new Test({ stat: "weird" }),

  // strike: new Test({stat: "tough", /* randomize: true */ }),
  attack: new Test({stat: "tough"}),
  // melee: new Test({stat: "tough"}),
  defense: new Test({stat: "tough", status: {'threat': -1} }),
  // aim: new Test({stat: ["tough", "cool"]}),
  // target: new Test({stat: "cool", status: {"threat": -1} }),

  'perception': new Test({stat: 'sharp', spec: 'perception'}),
  'initiative': new Test({stat: 'sharp', spec: 'initiative'}),
  
  'lockpicking': new Test({stat: "cool", spec: 'thievery', status: {'progress': -1} }),
  'pickpocket': new Test({stat: "cool", spec: 'thievery'}),

  'climbing': new Test({stat: 'cool', spec: 'climbing'}),

  'sixth sense': new Test({stat: "charm", spec: 'sixth sense'}),

};
