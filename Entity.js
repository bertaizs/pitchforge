var entities = [];

class Entity {
  static cost_of_stat_point(n) {
    if( n>0 ) return n
    else return 1
  }
  static stat_points_at_level_up(n) { return 3 }
  static stat_penalty(n) { return Math.trunc(n/2) }
  static stat_specialization_bonus(n) { return n }

  static max_id = 0;

  static epithets = [
    "angry",
    "vicious",
    "bloodthirsty",
    "scarred",
    "dastardly",
    "violent",
    "raging",
    "ruthless",
    "muscular",
  ];

  constructor(value = {}, param = {}) {
    for (let i in value) this[i] = value[i];

    this.name ??= "nameless";
    this.tags ??= {};
    this.description ??= "no description";

    this.level ??= 0;
    this.cp ??= 0;

    this.traits ??= {};

    for (let i in STATS) this[i] ??= 0;

    // this.position ??= false     // or string describing how/where the Noun is
    // this.img ??= false          // or image file name
    // this.location_id ??= 0      // the default location of all will be the game universe
    // this.exits ??= []
    this.epithet ??= "";
    if (!("template" in param)) {
      this.register();
    } else {
      this.epithets ??= Entity.epithets; // exists in templates only, defaults to the Noun.epithets
      game.templates[param.template] = this;
    }
  }

  // static spawn(template, where, changes = {} ) {
  //     // console.log("Noun.spawn")
  //     if( !(template in game.templates) ) throw `no such template: ${template}`

  //     let noun = Object.create( Object.getPrototypeOf(game.templates[template]) )

  //     noun.set( game.templates[template] )
  //     noun.register()
  //     noun.set_location(where)

  //     if( noun.epithets && !('name' in changes) ) {
  //         noun.epithet = noun.epithets[ noun.id % noun.epithets.length  ]
  //         delete noun.epithets
  //     }

  //     // noun.adjective = game.templates[template].adjectives[ noun.id % game.templates[template].adjectives.length ]

  //     for( let i in changes )
  //         noun[i] = changes[i]

  //     return noun
  // }

  register() {
    this.id = Entity.max_id++;
    game.entities[this.id] = this;
  }

  set(changes) {
    Object.assign(this, JSON.parse(JSON.stringify(changes)));
    return this;
  }

  get(x) {
    if (x in this) return this[x];
    throw `don't know how to get ${x}`;
  }

  level_up(n = 1) {
    for (let i = 0; i < n; i++) {
      this.level++;
      this.cp += Entity.stat_points_at_level_up(this.level);
    }
    return this;
  }

  change_stat(stat, delta) {
    if (!(stat in STATS)) throw `no such stat: ${stat}.`;

    if (delta == 1) {
      this[stat] += 1;
      this.cp -= Entity.cost_of_stat_point(this[stat]);
    } else if (delta == -1) {
      this.cp += Entity.cost_of_stat_point(this[stat]);
      this[stat] -= 1;
    } else throw `invalid stat change`;
  }

  // true if this Entity has the trait t
  has_trait(t) {
    return t in this.traits;
  }
  has_spec(t) { return this.has_trait(t) }

  // this Entity gains new trait t
  gain_trait(t) {
    this.traits[t] = true;
  }

  get_stat(stat, explain = {}) {
    if (!(stat in STATS)) throw `no such stat: ${stat}.`;

    let n = this[stat];
    explain["base " + stat] = this[stat];

    for (let t in TRAITS)
      if (this.has_trait(t)) {
        if (stat in TRAITS[t]) {
          explain[t] = TRAITS[t][stat];
          n += TRAITS[t][stat];
        }
      }

    explain[stat] = n;
    return n;
  }

  test_performance(test, explain = {}, params = {}) {
    if (typeof test == "string" && test in TESTS) test = TESTS[test];
    test = new Test( test, params )

    console.log(test);

    let n = this.get_stat(test.stat, explain);

    let spec = false
    for( let i in test.spec )
      if( this.has_spec(test.spec[i]) )
        spec = test.spec[i]
    if( spec ) {
      explain[`specialized (${spec})`] = Entity.stat_specialization_bonus(n)
      n += n
    }

    // item ?
    // randomize ?

    return n;
  }
} // Entity
