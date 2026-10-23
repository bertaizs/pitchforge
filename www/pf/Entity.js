var entities = [];

class Entity {

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
      this.tier ??= 2
    }

    if( 'damage' in this ) {
      this.damage = arrayify(this.damage)
      for( let i in this.damage )
        this.damage[i] = Dmg(this.damage[i])
    }
    
    if( this.is('weapon') || this.is('armor') || this.is('offhand') || this.is('shield')|| this.is('clothing') )
      this.set_tag('equipment')
        
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
  
  // true if this entity has at least one entity/item whose name matches the given pattern or meets tag
  has_a( pattern ) {
    for( let item of this.get_inventory() )
      if( item.get_name().match(pattern) || item.is(pattern) )
        return true
    return false
  }

  // true if this entity has at least one entity/item whose name matches the given pattern or meets tag
  has_a_equipped( pattern ) {
    for( let item of this.get_equipped_items() )
      if( item.get_name().match(pattern) || item.is(pattern) )
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

  // armor slot is item 1
  // offhand slot is item 2
  get_inventory_slots() { return ['weapon', 'item 1', 'item 2', 'item 3']}
  get_weapon_slot() {return 'weapon'}
  get_armor_slot() {return 'item 1'}
  get_offhand_slot() {return 'item 2'}

  // returns equipment equipped as weapon
  get_weapon() {
    let weapons = this.get_equipped_items().filter(x=>x.position==this.get_weapon_slot())
    if( weapons.length>0 && weapons[0].is('weapon') )
      return weapons[0]
    return false
  }
  get_weapon_or_self() {
    let weapon = this.get_weapon()
    return weapon || this
  }
  // returns if the weapon is cool, i.e. if cool can be used for attacking
  is_weapon_cool() {
    let weapon = this.get_weapon()
    if( weapon && weapon.is('cool') )
      return true
    if( this.has_trait('martial arts') )
      return true
    return false
  }
  is_weapon_melee() {
    let weapon = this.get_weapon()
    if( ! weapon ) return true  // unarmed is melee
    return weapon.is('melee')
  }
  get_damage_tier(type = 'body') {
    let weapon = this.get_weapon()
    if( weapon ) {  // fighting with weapon
      return weapon.get(type+'_tier')
    } else { // fighting unarmed
      let tier = this.get(type+'_tier')
      if( this.has_trait('martial arts') && type=='body' )
        tier += 1
      return tier
    }
  }
  // return amount of damage dealt by entity
  // get_damage_number() {
  //   return 2
  // }
  // returns damage done by the given entity
  get_damage() {
    let weapon = this.get_weapon()
    if( weapon )
      return weapon.get_damage()
  
    if( 'damage' in this )
      return this.damage
    else
      return Dmg({value: 2, type: 'body', element: 'kinetic', tier: this.get('tier')})
  }

  // returns equipment equipped as armor; false if no armor is equipped
  get_armor() {
    let armor = this.get_equipped_items().filter(x=>x.position==this.get_armor_slot())
    if( armor.length>0 && armor[0].is('armor') )
      return armor[0]
    return false
  }
  // returns armor; if no armor is equipped, return this entity (who will act as their own armor)
  get_armor_or_self() {
    let armor = this.get_armor()
    return armor|| this
  }
  // returns the tier either from this entity or from the equipped armor (whichever is better)
  get_armor_tier(type = 'body') {
    let armor_tier = this.get('tier')     // natural armor tier
    let armor = this.get_armor()
    if( armor && armor.get('tier') > armor_tier )
      armor_tier = armor.get('tier')
    return armor_tier
  }
  // return armor value for a given damage element (kinetic, energy, etc)
  // either from this entity or from the equipped armor (whichever is better)
  get_armor_value(element = 'kinetic') {
    let armor_attr = element + '_armor'
    let armor_value = this.get(armor_attr, 0)   // natural armor
    let armor = this.get_armor()
    if( armor && armor.get(armor_attr, 0)>armor_value )
      armor_value = armor.get(armor_attr, 0)    // if equipped armor is better, return that one
    return armor_value
  }

  
  equip( entity, as = 'weapon' ) {
    entity = game.entity(entity)
    
    if( !entity.is_at(this) )
      throw `${this} does not have ${entity}`

    let equipped = this.get_equipped_items()
    for( let i in equipped )
      if( equipped[i].position == as ) {
        equipped[i].position = false
        ui.text( this, ` unequips `, equipped[i], `.` )
      }

    if( as=='weapon' && entity.is('weapon') )
      ui.text( this, ` is now wielding `, entity, `.` )
    else
    if( as=='item 1' && entity.is('armor') )
      ui.text( this, ` is now wearing `, entity, `.` )
    else
      ui.text( this, ` now has `, entity, ` equipped.` )
      
    entity.position = as
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
      case 'body_tier': return this.get('tier')
      case 'spirit_tier': return 0
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
      s+= `<p>${capitalize(this.get_name())} is open.</p>`
    if( this.is('closed') )
      s+= `<p>${capitalize(this.get_name())} is closed.</p>`
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

  remove_all_threat() {
    if( this.has_status('threat') ) {
      // options.log_threat && console.log(`${this} is no longer under threat`)
      ui.text(this, ` is no longer under threat.`)
      this.remove_status('threat')
    }
  }
  
  recover() {
    this.body = this.get('max_body')
    this.spirit = this.get('max_spirit')
    this.remove_all_threat()
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

  build_threat(n = 1, param = {}) {
    ui.text(this, ` receives ${n} points of ${UI.wicon('threat')}.`)
    this.add_status({name: 'threat', timer: false, magnitude: n}, {stack_magnitude: true})
    options.log_threat && console.log(`threat (${n}) is built on ${this}`)
  }
  
  // lose a resource involuntarily, this entity may receive wounds, may go down
  // damages is ultimately converted into a list of one and more Damage objects 
  // (it can be a list or an individual value or an object which is not Damage, it is converted regardless)
  take_damage(damages = {}, param = {}) {
    damages = arrayify(damages)   // ensuring param is array
    let total_damage = {body: 0, spirit: 0}

    options.log_damage && console.log( 'damage', damages, param )
    
    let first = true    // used for applying modifiers to first instance only
    for( let d of damages ) {
      let damage = Dmg(d)         // ensuring it is a Damage object

      let damage_value = damage.value
      if(param.extra_damage_all) {
        damage_value += param.extra_damage_all        
      }
      if(first && param.extra_damage_first ) {
        damage_value += param.extra_damage_first
      }

      let e = Exp({who: this.id, label: `${damage.element} damage`})
      e.add({label: `incoming ${damage_value} points of tier ${damage.tier} ${damage.type} damage`, value: damage_value, fixed: true}) 

      
      let tier_diff = damage.tier - this.get_armor_tier(damage.type)
      if( tier_diff>=0 ) {      // higher or equal damage tier: full damage

        if( param.half ) {
          e.add({label: `damage is halved ${typeof param.half=='string' ? " ("+param.half+")" : "" }`, value: -damage_value+Math.trunc(damage_value/2)})
          damage_value = Math.trunc(damage_value/2)            
        }

        if( tier_diff == 0  ) { // same tier damage, armor applies

          if( !d.ignore_armour ) {
            let armor = this.get_armor_or_self().get_armor_value(damage.element)
            let reduction = Math.min(armor, damage_value)
  
            let txt = `${damage.element} armor (${armor}) reduces damage by ${reduction} points`
            options.log_damage && console.log(txt)
            if( armor )
              e.add({label: txt, value: -reduction})
  
            damage_value -= reduction
            // damage_value = Math.max(damage_value-armor,0)   // damage is reduced by armor but cannot go below 0
          } else {
            e.add({label: `armor ignored`, value: 0})                      
          }
          
        } else {
          e.add({label: `higher tier damage, armor does not apply`, value: 0})          
        }
        
        e.result = damage_value
        this[damage.type] -= damage_value
        total_damage[damage.type] += damage_value

        ui.text( this, ` takes `,` ${damage_value} points of ${UI.wicon(damage.type)} damage.`+ui.print_explanation_tag(e) ) 
        // ui.text(`${this} takes `, (tier_diff==0? "half damage only;" : ""),
        //   `${damage_value} points of ${UI.wicon(damage.type)} damage.`+ui.print_explanation_tag(e)
        // )

        first = false
        
        // if any of the points are reduced to zero, the entity shall go_down
        if( this[damage.type] <= 0 )
          this.go_down()        
      }
      if( tier_diff<0 ) {       // lower damage tier: no damage
        e.add({label: `ignores low-tier damage`, value: -damage_value})
        damage_value = 0
        // options.log_damage && console.log(`${this} takes no ${UI.wicon(damage.type)}${damage.type} damage`)

        console.log('e', e)
        ui.text(this, `takes no ${UI.wicon(damage.type)} damage. `+ui.print_explanation_tag(e))
      }
      
      // checking if damage causes a wound
      // the wound may make the entity go_down
      // let wound = Math.max(damage - 1, 0)
      // if( wound>0 )
      //   this.add_wound(wound)
      
    }   // foreach damage
    return total_damage
  }

  can_be_hurt_by( damages ) {
    damages = arrayify(damages)
    let armor_tier = this.get_armor_tier()
    
    for( let damage of damages ) {
      if( damage.tier >= armor_tier )
        return true
    }
    return false
  }
  
  // called when this entity hits Entity whom with command cmd
  hit(whom,  params = {}, cmd = {}) {

    let who = this
    whom = game.entity(whom)

    params.attack_text ??= `attacks`
    params.hit_text ??= `hits`
    params.graze_text ??= `grazes the target`
    params.no_damage ??= false
    params.threat_damage ??= false
    params.build_threat ??= 1
    params.allow_graze ??= true
    params.half_damage_on_graze ??= true
    params.damages ??= false
    params.extra_damage_first ??= 0
    params.extra_damage_all ??= 0

    let graze = ((cmd.result == 0) && params.allow_graze)
    console.log( 'graze', graze )
    let damages = params.damages || who.get_damage()

    ui.text( who, ` ${params.attack_text} `, whom, ` and ${graze?params.graze_text:params.hit_text}.`, ui.print_explanation_tag([cmd.e, cmd.e2]) )
    
    let p = {}
    if( graze && params.half_damage_on_graze )
      p.half = "graze"
    p.extra_damage_all = params.extra_damage_all
    p.extra_damage_first = params.extra_damage_first
    
    if( !params.no_damage ) {
      whom.take_damage(damages, p)
    }

    if( whom.is_up() && params.build_threat && whom.can_be_hurt_by(damages) ) {
      if( params.threat_damage ) {
        console.log("TODO!!!")        // todo: threat damage (feint)
      } else {
        whom.build_threat(params.build_threat)
      }
    }
  }

  // called when this entity misses Entity whom with command cmd
  miss(whom, params = {}, cmd) {
    let who = this
    whom = game.entity(whom)

    params.build_threat ??= 1
    params.attack_text ??= `attacks`
    params.miss_text ??= `but misses`

    ui.text( who, ` ${params.attack_text} `, whom, ` and ${params.miss_text}.`, ui.print_explanation_tag([cmd.e, cmd.e2]) )
    
    if( params.build_threat ) {
      whom.build_threat(params.build_threat)      
    }
    
  }
  
  // clock ; this is called at the start of this entity's every turn
  tick() {
    if( options.no_ticks ) return false
    options.log_entity_ticks && console.log(`tick: ${this} (#${this.id})`)

    if( !this.is_in_combat() ) 
      this.remove_all_threat()
  
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
      this.cp += CP_GAINED_AT_LEVEL(this.level)
      ui.text(`<span class="progress">`, this, ` has gained a level!</span>`)
    }
    return this;
  }

  change_stat(stat, delta) {
    if (!(stat in STATS)) throw `no such stat: ${stat}.`;

    if (delta == 1) {
      this[stat] += 1;
      this.cp -= CP_COST_OF_STAT_POINT(this[stat]);
    } else if (delta == -1) {
      this.cp += CP_COST_OF_STAT_POINT(this[stat]);
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
    reqs = arrayify(reqs)
    for( let req in reqs )
      if( !(reqs[req] instanceof Requirements) )
        reqs[req] = Reqs(reqs[req])
    
    if( reqs.length==0 || (reqs.length==1 && isEmpty(reqs[0])) )  // empty list means no requirements --> fulfilled
      return true
    
    for( let req of reqs ) {      
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
      if( !fail ) {
        for( let it in req.equipment ) {
          if( !this.has_a_equipped(req.equipment[it]) )
            fail = true
        }
      }
      // if all is met in this req object, return true
      if( !fail ) return true
    }
    return false
  }

  // returns requirements for the given entity (e.g. tough requirement for wearing an armor)
  get_requirements() {
    if( 'reqs' in this )
      return this.reqs
    return {}
  }

  // returns if this entity meets the requirements for the other entity (e.g. if player can wear armor)
  meets_requirements_for( entity ) {
    entity = game.entity(entity)
    return this.meets_requirements( entity.get_requirements() )
  }

  get_bonus( what ) {
    if( what == undefined ) throw "no param supplied for get_bonus" 
    let bonus = this.bonus || {}
    return bonus[what] || 0
  }

  get_equipment_bonuses(what) {
    // let items = this.get_equipped_items().filter(x=>this.meets_requirements_for(x))
    let items = this.get_equipped_items()
    let bonus = { highest: 0, lowest: 0 }
    for( let i in items ) {
      let item_bonus = items[i].get_bonus(what)
      bonus.highest = Math.max(bonus.highest, item_bonus)
      bonus.lowest = Math.min(bonus.lowest, item_bonus)
    }
    return bonus
  }

  // returns the value of stat (string), with an explanation
  get_stat(stat, e = {}) {
    e.explain = []
    e.label = stat
    e.who = this.id
    
    if (!(stat in STATS)) throw `no such stat: ${stat}.`;

    let n = this[stat];
    e.explain.push({value: this[stat], label: "base "+stat})

    let equipment_bonus = this.get_equipment_bonuses(stat)
    if( equipment_bonus.highest ) {
      n+= equipment_bonus.highest
      e.explain.push({value: equipment_bonus.highest, label: "from equipment"})
    }
    if( equipment_bonus.lowest ) {
      n+= equipment_bonus.lowest
      e.explain.push({value: equipment_bonus.lowest, label: "from equipment"})
    }
    
    for (let t in TRAITS)
      if (this.has_trait(t)) {
        if (stat in TRAITS[t]) {
          e.explain.push({value: TRAITS[t][stat], label: t})
          n += TRAITS[t][stat];
        }
      }
      
    let wound = this.get_status('wound')
    if( wound ) {
      n -= wound.magnitude
      e.explain.push({value: -wound.magnitude, label: "wound"})      
    }
    e.result = n
    return n;
  }
  
  // same as get_stat, but receives an array as stats and returns the highest with its explanation
  get_best_stat(stats, explain = {}) {
    if( stats.length==0 ) throw "empty stats array in get_best_stat"
    let best_stat, best_e, e
    
    for( let i in stats ) {
      e = {}
      let stat = this.get_stat( stats[i], e )
      if( i==0 || stat > best_stat ) {
        best_e = e
        best_stat = stat
      }
    }

    for( let i in best_e )
      explain[i] = best_e[i]
    return best_stat
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
  performance(test, params = {}, e = {} ) {
    if (typeof test == "string" && test in TESTS) test = TESTS[test];
    test = new Test( test, params )
    // let penalty = false
    
    let n = this.get_best_stat(test.stat, e);
    e.label = test.get_name()
    
    // considering traits
    let trait = this.has_one_of_traits(test.trait)
    if( trait ) {
      let bonus = this.get('level')
      n += bonus
      e.explain.push({label: `${this} has aligned trait ${trait}`, value: bonus})
    } else {
      // considering half-traits
      let half_trait = this.has_one_of_traits(test.half_trait)
      if( half_trait ) {
        let bonus = Math.trunc( this.get('level')/2 )
        n += bonus
        e.explain.push({label: `${this} has an aligned half-trait ${trait}`, value: bonus})
      } else {
        e.explain.push({label: `${this} does not have aligned trait`, value: 0})
      }
    }
    
    // considering if certain statuses affect the test
    for( let i in test.status ) {
      let status = this.get_status(i)
      // console.log("*", test.status, test.status[i])
      if( status ) {
        let diff = status.magnitude * test.status[i]
        n += diff
        e.explain.push({value: diff, label: `${status.name}: ${diff}`})
      }
    }
    
    let equipment_bonus = this.get_equipment_bonuses(test.get_name())
    if( equipment_bonus.highest ) {
      n+= equipment_bonus.highest
      e.explain.push({value: equipment_bonus.highest, label: "from equipment"})
    }
    if( equipment_bonus.lowest ) {
      n+= equipment_bonus.lowest
      e.explain.push({value: equipment_bonus.lowest, label: "from equipment"})
    }

    // considering penalties
    // if( this.has_penalty(test.get_name()) )
    //   penalty = true
    // if( penalty ) {
    //   let penalty_value = Entity.stat_penalty(n)
    //   explain.push({value: penalty_value, label: `penalty: (${penalty_value})`})
    //   n -= penalty_value
    // }
    
    // considering randomization: rolls two dice, substracts one from the other (todo: advantage / disadvantage)
    let randomize = 'randomize' in test && test['randomize']
    if( 'randomize' in params )
      randomize = params.randomize
    if( randomize ) {
      let die_plus = die_roll()
      let die_minus = die_roll()
      e.explain.push({value: die_plus-die_minus, label: `random (${die_plus}-${die_minus})`})
      n += die_plus-die_minus
      options.log_random && console.log( `random (${die_plus}-${die_minus})` )
      console.log(e)
    }

    // consider bonus/malus
    if( 'bonus' in test ) {
      e.explain.push({value: test.bonus, label: `bonus/minus`})
      n += test.bonus
    }

    options.log_tests && console.log(`testing ${this} for ${test.get_name()}, result: ${n}`)

    e.result = n
    return n;
  }   // performance

  performance_attack(params = {}, e = {}) {
    let stats = ['tough']
    if( this.get_stat('cool') > this.get_stat('tough') && this.is_weapon_cool() )
      stats.push(['cool'])
    let test = new Test({stat: stats, trait: 'combat', randomize: options.randomize_attacks})
    let result
    result = this.performance(test, params, e)   // TEST for the one taking action
    e.label = 'attack'

    return result
  }

  performance_defense(params = {}, e = {}) {
    let result = this.performance('block', params, e)

    let e_evasion = {}
    let evade_result = this.performance('evasion', params, e_evasion)

    if( evade_result > result ) {
      result = evade_result
      for( let i in e_evasion )
        e[i] = e_evasion[i]
    }
    return result
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
    let event = ""
    let verb = game.verbs[cmd.verb]
    let result = verb.run_test(cmd)
    
    // process result of the test based on <, > and = only
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
  autoattack(params = {}) {
    params.nop_text ??= ` has no target, passes.`
    
    let hostiles = this.list_hostiles_here()  // auto-attack hostiles
    if( hostiles.length>0 ) {
      let target = hostiles[random(hostiles.length)]
      game.exec(new Cmd({who: this, verb: 'attack', op1: target})) 
      return true
    }    
    else {
      ui.text(this, params.nop_text)
      // ui.add_event({text: `${this} has no target, passes.`, location: this.get_location()})
      return false
    }
  }
  
  // called when the entity could act, if they want to
  // this does what they want if they have a turn, are not stunned, etc.
  act() {
    if( !this.is_character() )    // only characters do something by default
      return false

    if( 'act_fn' in this )
      game.invoke_fn(this.act_fn)
    
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

    // EQUIPMENT
    if( this.is('weapon') && game.get_player().has(this) && !this.position ) {
      c.add_verb('equip', cmd, this, {label: `wield ${the(this)} as weapon`})
    }
    if( this.is('armor') && game.get_player().has(this) && !this.position ) {
      c.add_quick({label: `wear ${the(this)} as armor`, sortkey: 61,
          cmd: new Cmd({who: game.get_player(), verb: 'equip', op1: this, where: this.get_armor_slot()})})
    }
    if( game.get_player().has(this) && this.is('equipment') && !this.is('armor') && !this.position ) {
      let slots = game.get_player().get_inventory_slots()
      for( let i in slots ) {
        if( slots[i]!='weapon') {
          c.add_quick({label:  `equip ${the(this)} as `+slots[i], sortkey: 60+i,
            cmd: new Cmd({who: game.get_player(), verb: 'equip', op1: this, where: slots[i]})})          
        }
      }
    }
    if( game.get_player().has(this) && this.position ) {
      c.add_verb('unequip', cmd, this)
    }
    if( this.is('weapon') && game.get_player().has(this) && this.get('position') && this.get('position')!='weapon'  ) {
      c.add_quick({label:  `swap ${the(this)} with weapon`+UI.icon('quick'), sortkey: 70,
        cmd: new Cmd({who: game.get_player(), verb: 'swap', op1: this})})                  
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

    // hostile creatures
    if( this.is_hostile_to(game.get_player()) ) {

      c.add( {label: `attack ${the(this)}`,
          cmd: {who: game.get_player(), verb: 'attack', op1: this}
      }, 'attack' )

      if( cmd.who.has_trait('combat') && cmd.who.is_weapon_melee() ) {
        c.add( {label: `heavy attack ${the(this)}`,
            cmd: {who: game.get_player(), verb: 'heavy attack', op1: this},
            reqs: {tough: 2},
        } )        
        c.add( {label: `feint ${the(this)}`,
            cmd: {who: game.get_player(), verb: 'feint', op1: this},
            reqs: {tough: 2},
        } )        
      }

      
    }

    if( this.is('robot') && this.id!=game.get_player().id 
        && game.get_player().has_a_equipped('cyberdeck')
    ) {
      c.add_quick({label:  `hack ${this} and take control`,
        cmd: new Cmd({who: game.get_player(), verb: 'control', op1: this})})                  
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
