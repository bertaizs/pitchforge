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

  static epithets = [ "angry", "vicious", "bloodthirsty", "scarred", "dastardly",
    "violent", "raging", "ruthless", "muscular", ];

  constructor(value = {}, param = {}) {
    for (let i in value) this[i] = value[i];

    this.name ??= "nameless";
    this.tags ??= [];
    
    this.description ??= false;    // can be seen when looking at the entity (or on charsheet)
    this.interior_description ??= this.description;       // can be seen when inside the entity
    
    this.icon ??= false,
    this.interior_icon ??= this.icon,

    this.level ??= 0;
    this.cp ??= 0;
    
    this.tier ??= 0

    this.traits ??= {};
    this.status ??= {}

    for (let i in STATS) this[i] ??= 0;

    this.body ??= this.get('max_body')
    this.spirit ??= this.get('max_spirit')

    // this.position ??= false     // or string describing how/where the Noun is
    // this.img ??= false          // or image file name
    this.location_id ??= 0      // the default location of all will be the game universe
    this.position ??= false     // position within the location; string; depends on the location
    
    if( this.location ) {
      this.move_to(this.location, this.position)
      delete this.location
    }
    
    // this.exits ??= []
    this.epithet ??= "";
    if (!("template" in param)) {
      this.register();
    } else {
      this.epithets ??= Entity.epithets; // exists in templates only, defaults to the Noun.epithets
      game.templates[param.template] = this;
    }
  }

  static spawn(template, where, changes = {} ) {
      if( !(template in game.templates) ) throw `no such template: ${template}`
      
      // creates the same object as the one in the template, also works if it is a class *based on* Entity
      // this does not call its constructor, so we need to do those actions (set, register, moveto manually)
      let entity = Object.create( Object.getPrototypeOf( game.templates[template]) )
      entity.set( game.templates[template] )
      entity.register()
      entity.move_to(where)

      // if no epithet, then set one from the template
      if( entity.epithets && !('name' in changes) ) {
          entity.epithet = entity.epithets[ entity.id % entity.epithets.length  ]
          delete entity.epithets
      }

      entity.set(changes)
      
      // for( let i in changes )
      //     noun[i] = changes[i]

      return entity
  }
  
  
  // add this Entity into game.entities
  register() {
    this.id = Entity.max_id++;
    game.entities[this.id] = this;
  }
  
  get_location() {
    return game.entity(this.location_id)
  }
  
  list_entities_here() {
    return game.entities.filter(x=>(x.get_location().id==this.id))
  }
  
  move_to(location, pos = false) {
    location = game.entity(location)
    this.location_id = location.id
    this.position = pos
    return this
  }
  
  add( entity, pos = false ) {
    entity.move_to(this, pos)
    return this
  }
  
  get_inventory() {
    return game.list_entities_at(this)
  }
  
  get_equipped_items() {
    return this.list_entities_here().filter(x=>x.get('position')).sort()    
  }

  get_nonequipped_items() {
    return this.list_entities_here().filter(x=>x.get('position')==false).sort()  
  }
  
  // true if this entity has the other entity/item
  has( item ) {
    item = game.entity(item)
    return item.get_location().id == this.id
  }
  
  // true if this entity has at least one entity/item whose name matches the given pattern
  has_a( pattern ) {
    for( let item of this.get_inventory() )
      if( item.get_name().match(pattern) )
        return true
    return false
  }
  
  pick_up( entity ) {
    entity = game.entity(entity)
    entity.move_to( this )
  }

  drop( entity ) {
    entity = game.entity(entity)
    entity.move_to( this.get_location() )
  }
  
  equip( entity ) {
    
  }
  
  set(changes) {
    Object.assign(this, JSON.parse(JSON.stringify(changes)));
    return this;
  }
  
  set_tag(tag) { this.tags.push(tag) }
  remove_tag(tag) { this.tags = this.tags.filter(x=>x!=tag)}
  
  is(what) {
    return this.tags.includes(what)
  }
  
  is_creature() {
    return !this.is_item()
    // return ( this.is('character') || this.is('beast') || 
    //          this.is('returned') || this.is('construct') ) 
    //         && (!this.is('remains'))
  }
  is_character() { return this.is_creature() }
  
  is_location() {}
  
  is_item() {
    return this.is('item') || this.is('remains')
  }

  get(x) {
    // these must have hardcoded values
    // TODO: need to consider modifiers on traits, statuses, etc
    if( x in STATS ) return this.get_stat(x)
    if (x in this) return this[x];    
    
    // if not overridden, the default for the below is based on another attr
    switch(x) {
      case 'max_body': return this.get('tough')+3
      case 'max_spirit': return this.get('charm')+3
      case 'size': return this.get('tier')
    }
    
    throw `don't know how to get ${x}`;
  }
  
  get_name(with_epithet = true) { 
    let epithet = this.get('epithet')
    if( !with_epithet || !epithet )
      return this.get('name')
    
    if( epithet.match(/~/) )
      return epithet.replace('~', this.get('name'))
    else
      return epithet+" "+this.get('name')
  }
  toString() { return this.get_name() }

  rest() {
    this.body = this.get('max_body')
    this.spirit = this.get('max_spirit')
  }

  // recover() {
  //   this.body = this.get('max_body')
  //   this.spirit = this.get('max_spirit')
  // }
  
  add_status( status = {}, params = {} ) {
    if( !('name' in status) ) throw `status has no name`
    status.magnitude ??= 1
    status.timer ??= 1
    
    if( status.name in this.status ) {
      if( params.stack_timer )
        this.status[status.name].timer += status.timer
      // this.status[status.name].magnitude = Math.max(this.status[status.name].magnitude, status.magnitude )
      if( params.stack_magnitude )
        this.status[status.name].magnitude += status.magnitude
    } else this.status[status.name] = status
    return this.status[status.name]
  }
  
  remove_status( name ) {
    delete this.status[name]
  }
  
  get_status( name ) {
    if( name in this.status )
      return this.status[name]
    else 
      return false
  }
  
  add_wound( n ) {
    ui.add_event(`${this} is wounded (${n}).`)
    if( n>=LETHAL_WOUND )
      this.go_down()
    return this.add_status({name: 'wound', magnitude: n, timer: false})
  }
  
  go_down() {
    ui.add_event(`${this} goes down.`)
    if( this.is_character() ) {
      this.remove_tag('character')
      this.set_tag('remains')
      this.name += "'s remains"      
    }
  }
  
  take_damage(param = {}) {
    if( typeof param == 'number' )  param = {value: param}
    param.value ??= 2
    param.type ??= 'body'
    param.tier ??= this.get('tier')
    
    // damage reduced by difference between damage tier vs target's tier
    let tier_diff = param.tier - this.get('tier')
    let damage = Math.max(param.value + tier_diff, 0)
    ui.add_event(`${this} takes ${damage} points of damage.`)
    this[param.type] -= damage
    options.log_damage && console.log(`${this} takes ${damage} points of ${param.type} damage`)    
    
    // checking if damage causes a wound
    // the wound may make the entity go_down
    let wound = Math.max(damage - 1, 0)
    if( wound>0 )
      this.add_wound(wound)
    
    // if any of the points are reduced to zero, the entity shall go_down
    if( this[param.type] <= 0 )
      this.go_down()
    
    // TODO: check if this Entity goes down
    return damage
  }
  
  // clock ; this is called every turn
  tick() {
    for( let i in this.status ) {
      if(this.status[i].timer) this.status[i].timer--
      
      if(this.status[i].timer===0) {
        this.remove_status(i)        
      } else {
        if( i == 'poison' )
          this.take_damage({value: this.status[i].magnitude, type: 'body'})
      }
      
    }
    
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
    } else throw `invalid stat change; not +1 or -1`;
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

  // returns the value of stat (string), with an explanation
  get_stat(stat, explain = []) {
    if (!(stat in STATS)) throw `no such stat: ${stat}.`;

    let n = this[stat];
    explain.push({value: this[stat], label: "base "+stat})
    
    for (let t in TRAITS)
      if (this.has_trait(t)) {
        if (stat in TRAITS[t]) {
          explain.push({value: TRAITS[t][stat], label: t})
          n += TRAITS[t][stat];
        }
      }
      
    let wound = this.get_status('wound')
    if( wound ) {
      n -= wound.magnitude
      explain.push({value: -wound.magnitude, label: "wound"})      
    }

    return n;
  }
  // same as get_stat, but receives an array as stats and returns the highest with its explanation
  get_best_stat(stats, explain) {
    let n = null
    for( let i in stats ) {
      let e = []
      let r = this.get_stat( stats[i], e )
      if( n==null || r>n ) {
        n = r
        explain.length = 0
        for( let j=0; j<e.length; j++ )
          explain[j] = e[j]
      }
    }
    if( n==null ) throw "empty stats array in get_best_stat"
    return n
  }
  
  get_verbs() {
    return Object.keys( VERBS ).filter(x=>VERBS[x].enabled)
  }

  // returns performance of this Entity for a Test
  // - can add additional parameters
  // - explain is used for returning how it is calculated
  performance(test, params = {}, explain = []) {
    if (typeof test == "string" && test in TESTS) test = TESTS[test];
    test = new Test( test, params )
    
    let n = this.get_best_stat(test.stat, explain);
    // console.log(explain)

    // considering specializations
    let spec = false
    for( let i in test.spec )
      if( this.has_spec(test.spec[i]) )
        spec = test.spec[i]
    if( spec ) {
      explain.push({value: Entity.stat_specialization_bonus(n), label: `specialized (${spec})`})
      n += n
    }
    
    // considering if certain statuses affect the test negatively
    for( let i in test.status ) {
      let status = this.get_status(i)
      // console.log("*", test.status, test.status[i])
      if( status ) {
        let diff = status.magnitude * test.status[i]
        n += diff
        explain.push({value: diff, label: `${status.name}: ${diff}`})
      }
    }

    // todo: consider items ?

    // considering randomization: rolls two dice, substracts one from the other (todo: advantage / disadvantage)
    if( 'randomize' in test ) {
      let die_plus = die_roll()
      let die_minus = die_roll()
      explain.push({value: die_plus-die_minus, label: `random (${die_plus}-${die_minus})`})
      n += die_plus-die_minus
    }

    // consider bonus/malus
    if( 'bonus' in test ) {
      explain.push({value: test.bonus, label: `bonus/malus`})
      n += test.bonus
    }

    options.log_tests && console.log(`testing ${this} for ${test.get_name()}, result: ${n}`)
    return n;
  }

  test( test, vs_value, params = {}, explain = [] ) {
    let result = this.performance( test, params, explain )
    explain.push({value: -vs_value, label: `vs`})
    result -= vs_value
    return result
  }
  
  // executes a command of type Cmd, returns what happens as string
  exec( cmd ) {
    let result
    let event = ""
    let verb = game.verbs[cmd.verb]
    
    if( verb.test ) {
      let e = [], e2 = []
      result = this.performance(verb.test, {}, e)
      options.log_test_results && console.log(`${this}'s performance: ${result}`)
      
      let vs_result
      if( verb.difficulty ) {   // fixed difficulty
        vs_result = verb.difficulty
      } else
      if( verb.op1 ) {          // versus test
        vs_result = cmd.op1.performance( (verb.test_vs ? verb.test_vs : verb.test), {}, e2 )
      }
      options.log_test_results && console.log(`vs performance: ${vs_result}`)        
      result -= vs_result
    } else {
      options.log_test_results && console.log(`no test -> auto success`) 
      result = 1
    }

    if( result>=0 ) {
      options.log_test_results && console.log( `success!`)
      event = verb.on_success(cmd)
    } else {
      options.log_test_results && console.log( `fail.`)
      event = verb.on_fail(cmd)
    }
    return event
  }

} // Entity
