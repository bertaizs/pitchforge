var entities = [];

class Entity {
  static cost_of_stat_point(n) {
    if( n>0 ) return n
    else return 1
  }
  static stat_points_at_level_up(n) { return 3 }
  static stat_penalty(n) { return Math.round(n/2) } // this returns a penalty value, so we round UP from .5
  // static stat_specialization_bonus(n) { return n }

  static max_id = 0;

  static enemy_epithets = [ "angry", "vicious", "bloodthirsty", "scarred", "dastardly",
    "violent", "raging", "ruthless", "muscular", ];

  constructor(value = {}, param = {}) {
    for (let i in value) 
      this[i] = value[i]

    this.name ??= "nameless";
    this.tags ??= [];
    
    this.description ??= false;    // can be seen when looking at the entity (or on charsheet)
    // this.interior_description --> not initialized here, but Entity.get() defaults to description
                                   //  can be seen when inside the entity

    // this.choices = []
    this.choices ??= new ChoiceList()    // any custom Choices for the entity -- of class Choice
                                   
    this.clues ??= []
    this.location_clues ??= []
    
    this.icon ??= false,
    // this.interior_icon // defaults to this.icon

    this.level ??= 0;
    this.cp ??= 0;
    
    if( this.is_character() ) {
      this.tier ??= 0
    } else if(this.is_item() ) {
      this.tier ??= -1
    } else {  // location
      this.tier ?? 2
    }
        
    if( this.is('locked') ) {
      this.tough ??= Test.ADVANCED
      this.cool ??= Test.BASIC
    }

    if( 'keys' in this ) {  // forces this.keys to be an array of IDs
      this.keys = arrayify(this.keys)
      for( let key in this.keys)
        this.keys[key]= game.entity(this.keys[key]).id
    }
    
    this.traits ??= {};
    this.status ??= {}

    for (let i in STATS) this[i] ??= 0;

    this.body ??= this.get('max_body')
    this.spirit ??= this.get('max_spirit')
    
    // this.position ??= false     // or string describing how/where the Noun is
    // this.img ??= false          // or image file name
    this.location_id ??= 0      // the default location of all will be the game universe
    this.position ??= false     // position within the location; string; depends on the location

    // factions
    if( this.is('player') )
      this.faction ??= 'player'
    this.faction ??= 'neutral'
    this.attitude ??= 0
        
    
    this.knowledge ??= {}
        
    // this.exits ??= []
    this.epithet ??= "";
    if (!("template" in param)) {
      this.register();  // add as an Entity to the game
    } else {
      // this.epithets ??= []; // exists in templates only, defaults to the Noun.epithets
      game.templates[param.template] = this;  // add as a template with the given name
    }

    if( this.location ) {
      this.move_to(this.location, this.position)
      delete this.location
    }
    
    if( this.is('player') )
      game.select_player(this)
    if( this.is_location() && this.is('start') )
      game.set_start_location(this)
  } // constructor

  static spawn(template, where = false, changes = {} ) {
      if( !(template in game.templates) ) throw `no such template: ${template}`
      
      // creates the same object as the one in the template, also works if it is a class *based on* Entity
      // this does not call its constructor, so we need to do those actions (set, register, moveto manually)
      let entity = Object.create( Object.getPrototypeOf( game.templates[template]) )
      entity.set( game.templates[template] )

      // if epithet is an array, pick one!
      if( entity.epithet instanceof Array ) { // this must appear before first move (otherwise, a log_move may get confused because of epithets)
          entity.epithet = entity.epithet[ entity.id % entity.epithet.length  ]
      }

      entity.register()
      if( where )
        entity.move_to(where) // otherwise game.universe


      // if icon is an array, pick one!
      if( entity.icon instanceof Array ) {
        entity.icon = entity.icon[ entity.id % entity.icon.length  ]
      }

      entity.set(changes)
      
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

  is_at(loc) {
    loc = game.entity(loc)
    return this.get_location().id == loc.id
  }
  
  // returns entities contained by this entity
  list_entities_here() {
    return game.entities.filter(x=>(x.get_location().id==this.id))
  }
  
  // returns hostile entities who share the same location this entity
  list_hostiles_here() {
    return this.get_location().list_entities_here().filter( x=>x.is_hostile_to(this) )
  }
  
  // true if there are hostiles around
  is_in_combat() {  return this.list_hostiles_here().length>0 }
  
  // called after then entity is moved
  on_move() {}

  // moves this entity to a location entity (into position (pos))
  move_to(location, pos = false) {
    location = game.entity(location)
    this.location_id = location.id
    this.position = pos
    if( options.log_move ) console.log(`${this} moves to ${location}${pos ? ':'+pos : ''}`);
    // if( options.log_move ) console.log( this.id+" moves to "+location.id )
    this.on_move()
    return this
  }

  // set this entity to head to location
  // a move_to will be called at the end of the turn move phase
  head_towards(location, pos = false) {
    this.heading = game.entity(location).id
    this.heading_pos = pos || undefined
  }
  
  destroy() {
    this.move_to(game.universe)
    delete game.entities[this.id]
    if( ui.cmd.op1 == this ) {
      ui.cmd.op1 = false
      ui.cmd.op2 = false
    }
    if( ui.cmd.op2 == this )
      ui.cmd.op2 = false
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

  // called when this is 'process'ed
  // to be redefined
  process(cmd) { }

  lock_works_with( key ) {
    key = game.entity(key)
    if( !('keys' in this) )
      throw `${this} is not a door`
    let keys = this.keys
    
    for( let i in keys )
      if( game.entity(keys[i]).id == key.id )
        return true
    return false
  }
  
  // receives an associative array, copies those key=>value pairs into this
  set(changes) {
    // this copies attributes into this, including any objects nested
    // this does NOT copy functions
    Object.assign(this, JSON.parse(JSON.stringify(changes)));

    // here ne need to call out which functions to copy explicitly
    let functions_to_copy = ['consumed_by', 'choices', 'process']
    for( let i in functions_to_copy ) {
      if( functions_to_copy[i] in changes )
        this[functions_to_copy[i]] = changes[functions_to_copy[i]]
    }
    return this;
  }
  
  set_tag(tag) { this.tags.push(tag) }
  remove_tag(tag) { this.tags = this.tags.filter(x=>x!=tag)}
  
  is(what) {
    return this.tags.includes(what)
  }
  
  is_creature() { return this.is('character') && !this.is('item') }
  is_character() { return this.is_creature() }
  
  is_location() { // if not specified otherwise, an Entity is a location
    return this.is('location') || (!this.is_character() && !this.is_item())
  }
  
  is_item() {
    return this.is('item') || this.is('remains') || this.is('prop')
  }
  
  // true if this entity can be picked up and carried in inventories
  is_takeable() {
    return this.is('item')
  }
  
  is_open_container() {
    return (this.is('open') && this.is('container')) || this.is('remains')
  }
  
  // true if this entity is active and can make actions
  is_up() { return this.is_character() }
  
  //  true if this entity is controlled by the player
  is_player_controlled() {  // TODO...
    return this.is('player')
  }
  
  // true if this entity belongs to the player's party
  is_party_member() { // TODO...
    return this.is('player')
  }
  
  // true if this entity is controlled by the computer
  is_machine_controlled() {
    return !this.is('player')
  }
  
  // true if this entity and the other entity are hostiles
  is_hostile_to(other_entity) {
    if(this.id == other_entity.id)
      return false    // no one is hostile to themselves :)

    // only characters can be hostile to each other
    if(!this.is_character() || !other_entity.is_character())
      return false
    
    // if either entity is neutral, test each npc's cham vs the others attitude
    if( this.get('faction') == 'neutral' || other_entity.get('faction')=='neutral' ) {
      if( !other_entity.is_player_controlled() && (this.performance('charm')+other_entity.get('attitude')) < 0 )
        return true      
      if( !this.is_player_controlled() && (other_entity.performance('charm')+this.get('attitude') < 0) )
        return true
      return false
    }
    
    // if factions are different and neither is neutral, they are hostile
    return this.get('faction') != other_entity.get('faction')
  }
  
  get( x, alt = undefined ) {
    // these must have hardcoded values
    // TODO: need to consider modifiers on traits, statuses, etc
    
    if( x in STATS ) return this.get_stat(x)
    
    if (x in this) {  // if what you are get-ting is a function, run it and return results
      if( typeof this[x] != 'function' ) {
        return this[x]
      } else {
        return this[x]()        
      }
    }
    
    // if not overridden, the default for the below is based on another attr
    switch(x) {
      case 'max_body': return this.get('tough')+3
      case 'max_spirit': return this.get('charm')+3
      case 'size': return this.get('tier')
    }
    
    if(x=='weapon') {
      let w = this.list_entities_here().filter(x=>x.get('position')=='weapon')
      if( w.length>0 )
        return w[0]
      else
        return false
    }
    if(x=='damage_tier') {
      let weapon = this.get('weapon')
      if( weapon )
        return weapon.get('tier')
      else
        return this.get('tier')
    }
    
    if(x=='armour') {
      let a = this.list_entities_here().filter(x=>x.get('position')=='armour')
      if( a.length>0 )
        return a[0]
      else
        return false
    }
    if(x=='armour_tier') {
      let armour = this.get('armour')
      if( armour )
        return armour.get('tier')
      else
        return this.get('tier')
    }
    if(x=='interior_description') { // && there is no such field (implicit)
      return this.get('description')
    }
    if(x=='interior_icon') { // && there is no such field (implicit)
      return this.get('icon')
    }

    if( alt === undefined )
      throw `don't know how to get ${x}`;
    else
      return alt
  }
  
  get_name(with_epithet = true) { 
    let epithet
    try {
      epithet = this.get('epithet')
    } catch(e) {
      return this.get('name')
    }
    
    if( !with_epithet || !epithet )
      return this.get('name')
    
    if( epithet.match(/~/) )
      return epithet.replace('~', this.get('name'))
    else
      return epithet+" "+this.get('name')
  }
  toString() { return this.get_name() }
  
  get_description() {
    let s = this.get('description') 
    if( this.is('open') )
      s+= `<p>${sentence(this.get_name())} is open.</p>`
    if( this.is('closed') )
      s+= `<p>${sentence(this.get_name())} is closed.</p>`
    return s
  }

  get_interior_description() {
    return this.get('interior_description')
  }
  get_location_description() {
    return this.get_interior_description()
  }
  
  rest() {
    this.body = this.get('max_body')
    this.spirit = this.get('max_spirit')
  }

  recover() {
    this.body = this.get('max_body')
    this.spirit = this.get('max_spirit')
    this.remove_status('threat')
  }
  
  add_status( status = {}, params = {} ) {
    if( !('name' in status) ) throw `status has no name`
    status.magnitude ??= 1
    status.timer ??= 1
    status.label ??= status.name
    
    if( status.name in this.status ) {  // if already has this status
      if( params.stack_timer )      // timer is added to existing
        this.status[status.name].timer += status.timer
      if( params.stack_magnitude )  // magnitude is added to existing
        this.status[status.name].magnitude += status.magnitude
      else                          // higher magnitude is taken
        this.status[status.name].magnitude = Math.max(this.status[status.name].magnitude, status.magnitude)
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
  has_status( name ) { return this.get_status(name) }
  
  add_wound( n ) {
    if( this.get_status('wound').magnitude == n )
      n+= 1   // if already had a wound with this magnitude, the wound gets worse    
    ui.text(this, ` is wounded (${n}).`)
    if( n>=LETHAL_WOUND )
      this.go_down()
    return this.add_status({name: 'wound', magnitude: n, timer: false})
  }

  add_choice(choice_data, tag = false) {
    this.choices.add_quick(choice_data, tag)
    return this
  }
  
  // insta-kill this Entity/character
  // standard actions that happen when a character dies
  kill() {
    this.remove_tag('character')
    this.set_tag('remains')
    this.name += "'s remains"          
  }
  
  // called when this entity would down due to damage;
  // redefine if you want something else to happen
  go_down() {
    ui.text(this, ` goes down.`)
    if( this.is_character() ) {
      this.kill() // call this.kill by default
    }
    if( this.is('player') && options.end_game_on_player_down ) { // TODO: check if ALL players went down
      game.end_game()
    }
  }
  
  // lose resource willingly, does not depend on damage tier
  // cannot result in wounds or in this entity going down
  spend(param={}) {
    if( typeof param == 'number' )  param = {value: param}
    param.value ??= 1
    param.type ??= 'spirit'
    
    if( this.get(param.type)>=param.value ) {
      this[param.type] -= param.value
      ui.text(this,` spends ${param.value} points of ${UI.wicon(param.type)}.`)
      return true
    } else {
      ui.text(this,` cannot afford spending ${param.value} points of ${UI.wicon(param.type)}.`)
      return false
    }
  }
  
  // lose a resource involuntarily, this entity may receive wounds, may go down
  take_damage(param = {}) {
    if( typeof param == 'number' )  param = {value: param}
    param.value ??= 1
    param.type ??= 'body'
    param.tier ??= this.get('tier')
    param.ignore_armour ??= false
    
    // damage reduced by difference between damage tier vs target's tier
    let tier_diff = param.tier - this.get('armour_tier')
    if( param.ignore_armour )
      tier_diff = 0
    let damage = Math.max(param.value + tier_diff, 0)
    ui.text( {location: this.get_location()}, this,` takes ${damage} points of ${UI.wicon(param.type)} damage.` )
    console.log(param)
    this[param.type] -= damage
    options.log_damage && console.log(`${this} takes ${damage} points of ${UI.wicon(param.type)} damage`)    
    
    // checking if damage causes a wound
    // the wound may make the entity go_down
    let wound = Math.max(damage - 1, 0)
    if( wound>0 )
      this.add_wound(wound)
    
    // if any of the points are reduced to zero, the entity shall go_down
    if( this[param.type] <= 0 )
      this.go_down()
    
    return damage
  }
  
  // clock ; this is called at the start of this entity's every turn
  tick() {
    if( options.no_ticks ) return false
    options.log_entity_ticks && console.log(`tick: ${this} (#${this.id})`)
    
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
      ui.text(`<span class="progress">`, this, ` has gained a level!</span>`)
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
  // true if this entity has one of the traits on list traits
  // if yes, return the name of a trait found; if not then false
  has_one_of_traits( traits = [] ) {
    for( let i in traits )
      if( this.has_trait(traits[i]) )
        return traits[i]
    return false
  }

  // this Entity gains new trait t
  gain_trait(t) {
    this.traits[t] = true
    return this
  }
  
  gain( background = {} ) {
    background.traits ??= []
    background.inventory ??= []
    
    for( let i of background.traits )
      this.gain_trait( i )
    for( let i of background.inventory )
      this.add( Entity.spawn(i) )
    for( let i in STATS )
      if( i in background )
        this[i] += background[i]
    if( 'cp' in background )
      this.cp += background.cp
    
    if( 'knowledge' in background )
      for( let k in background.knowledge ) {
        // console.log(background.knowledge[k])
        this.gain_info( background.knowledge[k] ) 
      }

    return this
  }
  
  // adds the given info block to the knowledge of this entity
  // parameter info can be: string, object, Info -- all will be converted to Info
  gain_info( info ) {
    if( !(info instanceof Info) )
      info = new Info(info)
    
    let tag = info.tag
    if(tag in this.knowledge)
      this.knowledge[tag].extend_with(info.value)  // if there is knowledge on the given subject, the knowledge is extended
    else
      this.knowledge[tag] = info  // if this entity does not know anything about the given subject, the knowledge is established
  }
  
  // checks if this entity has certain knowledge
  // true if this entity's knowledge block 'contains' the info block knowledge
  // where 'contains' mean it contains at least the same info or more
  has_info( info ) {
    if( typeof info == 'string' )
      info = new Info(info)    
    return (info.tag in this.knowledge) && this.knowledge[info.tag].contains(info)
  }
  // has_knowledge(info) { return this.has_info(info) }
  
  get_info_on(tag) {
    if( tag in this.knowledge )
      return this.knowledge[tag]
    return false
  }
  get_info(tag) {return this.get_info_on(tag)}
  
  find_clue(clue) {
    if( !(clue instanceof Clue) ) throw `find_clue called without a Clue`
    for( let i of clue.get_info() )
      this.gain_info(i)      
  }
  
  // returns true if meets one of the requirement set_start_location
  // input is an object, or an array of objects 'OR of ANDs', 
  // i.e. each object describes a set of requirements where all must be met; 
  // and if one object is met, then the result is true
  // returns false if none of the requirements sets are met
  // 
  // examples:  reqs = {tough: 6, cool: 3, perception: 6, traits: {perception: true}}
  //            reqs = [{tough: 6}, {cool: 3}]
  // 
  // can have the following requirements:
  // - stats like tough, cool
  // - tests like perception
  // - traits like traits: {traitname: true}
  // - knowledge
  // - items like items: [/compass/, ham] (these are validate via has_a and match)
  meets_requirements( reqs ) {
    if( !(reqs instanceof Array) )
      reqs = [reqs]   // ensures we have an array
    
    if( reqs.length==0 || (reqs.length==1 && isEmpty(reqs[0])) )  // empty list means no requirements --> fulfilled
      return true
    
    for( let req of reqs ) {
      req.traits ??= {}
      req.knowledge ??= []
      
      req.items ??= []
      if( !Array.isArray(req.items)) 
        req.items = [req.items]
      // if( 'item' in req ) 
      //   req.items.push(req.item)
      
      if( !(req.knowledge instanceof Array) )
        req.knowledge = [req.knowledge]
      
      let fail = false

      for( let i in req ) {
        if( i in STATS && req[i]>this.get(i) ) fail = true
        if( i in TESTS && req[i]>this.performance(i) ) fail = true
      }
      if(!fail) {
        for( let t in req.traits )
          if( !this.has_trait(t) )
            fail = true
      }
      if( !fail ) {
        for( let k of req.knowledge ) {
          if(!(k instanceof Info)) {
            // console.log(k)
            k = new Info(k)
          }
            
          if( !this.has_info(k) )
            fail = true
        }
      }
      if( !fail ) {
        for( let it in req.items ) {
          if( !this.has_a(req.items[it]) )
            fail = true
        }
      }
      // if all is met in this req object, return true
      if( !fail ) return true
    }
    return false
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
  get_best_stat(stats, explain = []) {
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
    return Object.keys( VERBS ).filter(x=>VERBS[x].enabled && this.meets_requirements(VERBS[x].reqs))
  }

  // true if this entity has penalty on the given test
  has_penalty( test_name = false ) {
    return false
  }
  
  // returns performance of this Entity for a Test
  // - can add additional parameters
  // - explain is used for returning how it is calculated
  performance(test, params = {}, explain = []) {
    if (typeof test == "string" && test in TESTS) test = TESTS[test];
    test = new Test( test, params )
    // let penalty = false
    
    let n = this.get_best_stat(test.stat, explain);
    
    // considering traits
    let trait = this.has_one_of_traits(test.trait)
    if( trait ) {
      let bonus = this.get('level')
      n += bonus
      explain.push({label: `${this} has aligned trait ${trait}`, value: bonus})
    } else {
      // considering half-traits
      let half_trait = this.has_one_of_traits(test.half_trait)
      if( half_trait ) {
        let bonus = Math.trunc( this.get('level')/2 )
        n += bonus
        explain.push({label: `${this} does not have an aligned trait but has aligned half-trait ${trait}`, value: bonus})
      } else {
        explain.push({label: `${this} does not have an aligned trait or half-trait`, value: 0})
      }
    }


    
    // let spec = false
    // for( let i in test.spec )
    //   if( this.has_spec(test.spec[i]) )
    //     spec = test.spec[i]
    // if( spec ) {
    //   explain.push({value: Entity.stat_specialization_bonus(n), label: `specialized (${spec})`})
    //   n += n
    // }
    
    // considering if certain statuses affect the test
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

    // considering penalties
    // if( this.has_penalty(test.get_name()) )
    //   penalty = true
    // if( penalty ) {
    //   let penalty_value = Entity.stat_penalty(n)
    //   explain.push({value: penalty_value, label: `penalty: (${penalty_value})`})
    //   n -= penalty_value
    // }
    
    // considering randomization: rolls two dice, substracts one from the other (todo: advantage / disadvantage)
    if( 'randomize' in test && test['randomize'] ) {
      let die_plus = die_roll()
      let die_minus = die_roll()
      explain.push({value: die_plus-die_minus, label: `random (${die_plus}-${die_minus})`})
      n += die_plus-die_minus
      options.log_random && console.log( `random (${die_plus}-${die_minus})` )
    }

    // consider bonus/malus
    if( 'bonus' in test ) {
      explain.push({value: test.bonus, label: `bonus/malus`})
      n += test.bonus
    }

    options.log_tests && console.log(`testing ${this} for ${test.get_name()}, result: ${n}`)
    return n;
  }

  // test this entity's performance vs a fixed value vs_value
  // vs_value is meant to be:
  // - static number, or
  // - result of a performance() of another entity
  test( test, vs_value, params = {}, explain = [] ) {
    let result = this.performance( test, params, explain )
    explain.push({value: -vs_value, label: `vs`})
    result -= vs_value
    // return result
    return (result>=0)
  }
  
  // executes a command of type Cmd, 
  // returns what happens as string (which is not used)
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
        if( typeof verb.difficulty == 'number' )
          vs_result = verb.difficulty
        else
        if( typeof verb.difficulty == 'function' )
          vs_result = verb.difficulty(cmd)
        else
          throw `don't know how to process difficulty: ${verb.difficulty}`
      } else
      if( verb.op1 ) {          // versus test
        // TODO: use Entity.test() ???
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
  } // Entity.exec
  
  
  // this entity picks a hostile target and attack it
  autoattack() {
    let hostiles = this.list_hostiles_here()  // auto-attack hostiles
    if( hostiles.length>0 ) {
      let target = hostiles[random(hostiles.length)]
      game.exec(new Cmd({who: this, verb: 'attack', op1: target})) 
      return true
    }    
    else {    // TODO: ?? move to act() ??
      ui.add_event({text: `${this} has no target, passes.`, location: this.get_location()})
      return false
    }
  }
  
  // called when the entity could act, if they want to
  // this does what they want if they have a turn, are not stunned, etc.
  act() {
    if( !this.is_character() )    // only characters do something by default
      return false
    
    this.autoattack()   // default action is an autoattack
  }

  // get list of choices, considering the below command
  get_choices(cmd) {
    // console.log("get_choices", cmd)

    // this is a generic choicelist returned for all items
    let c = new ChoiceList()

    if( this.is_takeable() && (  
          ( this.is_at(game.get_player_location() )   // where the player is
            || 
          (this.get_location().is_at(game.get_player_location()) && // in an open container where the player is
          this.get_location().is('container') && this.get_location().is('open') )
            ||
          (this.get_location().is_at(game.get_player_location()) && // in an open container where the player is
          this.get_location().is('remains') )
          ) 
                              ) ) {
      c.add_verb('pick up', cmd, this)
    }

    // takeable and held by the player
    if( this.is_takeable() && this.is_at(game.get_player()) ) {
      c.add_verb('drop', cmd, this)
    }

    // takeable and held by someone else not the player
    if( this.is_takeable() && this.get_location().is_at(game.get_player_location()) &&
        this.get_location().is('character') && this.get_location().is_up() &&
        this.get_location().id!=game.get_player().id ) {
          c.add_verb('pickpocket', cmd, this, {label: `pickpocket ${the(this)} from ${the(this.get_location())}`})
    }

    if( this.is('weapon') && game.get_player().has(this) && !this.position ) {
      c.add_verb('equip', cmd, this)
    }
    if( this.is('weapon') && game.get_player().has(this) && this.position ) {
      c.add_verb('unequip', cmd, this)
    }

    if( this.is('open') ) {
      c.add_verb('close', cmd, this)  
    }
    
    if( this.is('closed') ) {
      c.add_verb('open', cmd, this)
      c.add_verb('force', cmd, this )
      c.add_verb('pick lock', cmd, this, {label: `pick the lock on ${the(this)}`} )

      let keys = game.get_player().list_entities_here().filter(x=>x.is('key'))

      if( 'keys' in this ) {
        let action = this.is('locked') ? 'unlock' : 'lock'
        
        for(let k in keys) {
          console.log(cmd)
          let unlock_cmd = {verb: action, op1: this, op2: keys[k]}
          c.add(new Choice({
            label: `${action} ${this} with ${the(keys[k])}`,
            cmd: unlock_cmd,
            sortkey: VERBS[action].sortkey,
          }))
        }        
      }

    }

    if( this.is('consumable') && game.get_player().has(this) ) {
      c.add_verb('consume', cmd, this)
    }
    
    if( this.is_creature() && this.id!=game.get_player().id ) {
      c.add( new Choice({label: `say hello to ${this}`,
          fn: (cmd)=>`${this} also says hello to you`
      }) )
    }

    if( this.is_hostile_to(game.get_player()) ) {
      c.add( new Choice({label: `attack ${the(this)}`,
          cmd: {who: game.get_player(), verb: 'attack', op1: this}
      }), 'attack' )
    }

    if( game.get_player().id == this.id ) {
      c.add_verb('recover', cmd, this, {label: `take a breather to recover a bit`})
    }
    
    c.add_verb('examine', cmd, this)
    
    // merging choicelists...
    let custom_choices = this.get_custom_choices()

    let global_choices = new ChoiceList( game.global_choices.get_list().
                        filter( x=>(this.get_name().match(x.entity_regexp) ) ).
                        map( x=>{x[x.clicked_entity_as] = this; return x;}) 
                        )
    console.log( global_choices )
    
    let cl = new ChoiceList()
    cl.merge(custom_choices)  // custom choices for the given entity
    cl.merge(this.choices)    // static choices for the given entity
    cl.merge(global_choices)  // also merge any global choices
    cl.merge(c)               // generic choices last

    // only offer those choices where the given char meets the requirements
    let list = cl.get_list() 
    list = list.filter( (x)=>cmd.who.meets_requirements(x.reqs) )
      .sort( (a,b)=>(a.sortkey-b.sortkey) )
    return list
  }

  get_custom_choices() {
    return new ChoiceList()
  }
  
} // Entity
