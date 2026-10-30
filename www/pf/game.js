
class Game {    
  
  constructor() {
    this.templates = {}
    this.entities = []
    this.paths = []
    this.triggers = []
    this.verbs = VERBS
    this.player_id = 1  // default value, modified via Game.select_player
    this.clues = {}     // not all clues, only those we need to refer to later (e.g. for hiding, etc)
    
    this.character_icons = [] // one can select from these icons during character generation
    this.base_char = {}       // all characters will get these via Entity.gain
    this.character_backgrounds = {} // contains backgrounds, player can select one
        
    this.initiative_order = []
    this.current_entity_n = 0   // index of the current entity in the initiative order

    this.global_choices = new ChoiceList()

    this.fn = {
      'nop': function( cmd ) {
        console.log("nop", cmd)
      }
      
    }
  }

  entity(e) {
      if( e instanceof Entity )
          return e
      else
          if( (typeof e == 'number' || typeof e == 'string') && e in this.entities )
              return this.entities[e]
      throw `no Entity with id: ${e}.`
  }
  
  list_entities() { return this.entities.slice(1) }
  list_entities_at(loc) { return this.list_entities().filter(x=>(game.entity(loc).id==x.location_id)) }
  
  get_player() { return this.entities[this.player_id]}
  get_player_location() { return this.get_player().get_location() }
  select_player(e) {
    e = this.entity(e)
    this.player_id = e.id
    ui.cmd.who = e
  }

  // DIFFICULTY LEVEL SCALING
  difficulty_level( type = 'MEDIUM', p = {} ) {
    p.type = type
    p.trait ??= false
    p.level ??= 1
    return rules.difficulty(p)
  }
  mundane(p={}) {return 0}
  basic(p={}) {return this.difficulty_level('VERY_EASY', p)}
  very_easy(p={}) {return this.difficulty_level('VERY_EASY', p)}
  easy(p={}) {return this.difficulty_level('EASY', p)}
  medium(p={}) {return this.difficulty_level('MEDIUM', p)}
  advanced(p={}) {return this.difficulty_level('ADVANCED', p)}
  hard(p={}) {return this.difficulty_level('HARD', p)}
  super_hard(p={}) {return this.difficulty_level('SUPER_HARD', p)}
 

  // register function fn in this.fn under the key tag;
  // tag becomes a fresh number omitted
  register_fn( fn, tag = false ) {
    if( !tag )
      tag = Object.keys(this.fn).length + ""    
    this.fn[tag] = fn
    return tag
  }

  // true iff there is a function with the given tag
  fn_exists( tag ) {
    return (tag in this.fn)
  }

  // returns the function with the given tag
  get_fn(tag) { return this.fn[tag] }

  // run registered function fn with parameter Command cmd and return its result
  invoke_fn(tag, cmd = false) {
    if( !(tag in this.fn) ) throw `no such custom function: `+fn

    options.log_game_fns && console.log(`invoked`, tag, cmd)
    let ret = this.fn[tag](cmd)    // returns true if action is done, false if default actions need to follow
    if( ret === undefined ) ret = false
    return ret
  }

  
  // disable all verbs in the game; none will work
  // only debug verbs will remain, as they are for debugging
  disable_all_verbs() {
    for( let i in VERBS )
      if( VERBS[i].type != 'debug' )
        VERBS[i].enabled = false
    
    // Object.keys( VERBS ).map( function(x) { if(VERBS[x].type=='debug') VERBS[x].enabled = false } )
  }
  
  // receives a list of strings, all these verbs will be enabled
  enable_verbs( verbs ) {
    for( let v of verbs ) 
      VERBS[v].enabled = true
  }
  
  // receives a list of strings, only these verbs will be enabled, everything else will be disabled
  enable_verbs_only( verbs ) {
    this.disable_all_verbs()
    this.enable_verbs(verbs)
  }
  
  set_title(title) { 
    ui.set_title(title)
    console.log("starting: "+title)
  }
  
  set_start_location( location ) {
    location = this.entity(location)
    this.chargen.onward = location
  }

  add_global_choice(choice_hash) {
    let choice = new Choice(choice_hash)
    this.global_choices.add(choice)
    return this
  }

  
  // called when someone executes a command
  // - calls entity.exec
  // - ends turn if needed
  exec(cmd = ui.cmd) {
    if( !(cmd instanceof Cmd) ) 
      cmd = new Cmd(cmd)  // ensure cmd is a Cmd instance
    cmd.validate()  // throws an exception if cmd is not 'valid'
    options.log_commands && console.log(`executing: `, cmd)

    this.get_current_entity().exec(cmd)      // this is where we execute the given command

    // options.log_player_turn_milestones && console.log('*******************')
    
    // check if the given cmd is turn ending for the player
    if( this.get_current_entity().id == game.get_player().id ) {
      let player = game.get_player()

      if( !('quick' in cmd ) ) {  // 'quick' commands don't end the turn
        game.end_player_turn()  // proceeds with main_loop
      } else {
        options.log_player_turn_milestones && console.log(`quick command, ${player}'s turn continues`)        
      }
    }
  }
  
  get_current_entity() {
    return this.initiative_order[this.current_entity_n]
  }

  end_turn() {    
    this.perform_move_actions();

    options.log_turn_start && console.log(`*** TURN starts ***`);
    this.initiative_order = this.build_initiative_order()
    this.current_entity_n = 0   // rebuild and restart initiative order
  }
  
  // proceed to next entity in the initiative order
  // if end of initiative order then restart it
  next_entity() {
    if( this.initiative_order.length == 0 ) throw `game.next entity called without game.main_loop`
    this.current_entity_n++

    // CHECK if turn ends
    if( this.current_entity_n >= this.initiative_order.length ) { // if end of initiative order
      this.end_turn()
    }
    
    return this.get_current_entity()
  }

  perform_move_actions() {
    if( options.log_move_actions ) console.log(`performing move actions...`)

    // followers head the same way as the one they are following
    for(let entity of this.initiative_order) {
      let following = entity.get_following()
      if( following ) {
        let heading_towards = following.get_heading()
        if( heading_towards && entity.is_where(following) ) {
          entity.head_towards(heading_towards)
          ui.text(entity, ` is following `, following)          
        }
      }
    }

    // move the characters
    for(let i in this.initiative_order) {
      if('heading' in this.initiative_order[i] && this.initiative_order[i].is_up() ) {
        let destination_entity = game.entity(this.initiative_order[i].heading)
        if( options.log_move_actions ) 
          console.log(`${this.initiative_order[i]} moves to ${destination_entity}`)

        ui.text(this.initiative_order[i], ' arrives at ', destination_entity, '.') 
        
        this.initiative_order[i].move_to(destination_entity)
        delete this.initiative_order[i].heading
      }
    }

    // spot checks to reveal sneaky stuff
    for(let entity of this.initiative_order) {
      if(entity.has_status('sneaking')) {
        let hostiles = entity.list_hostiles_here()
        for( let hostile of hostiles ) {
          let result = hostile.Challenge('spot', 
              entity.Performance('stealth') )
            // ` attempts to spot ` )
          if( result>=0 )
            entity.revealed()
        }
      }
    }
  }
  
  // (re)builds the initiative order
  build_initiative_order() {
    return game.entities
              .filter(x=>(!x.is('abstract') && !x.is('universe')))
              .sort( (x,y)=>(y.performance('initiative')-x.performance('initiative') || x.id-y.id) )
  }
  
  // this loop runs
  main_loop() {
    if( this.initiative_order.length == 0 ) { // if this is called the first time; subsequent rebuilds of the initiative order are via next_entity() -> end_turn()
      options.log_turn_start && console.log(`*** TURN starts ***`);

      this.initiative_order = this.build_initiative_order()
      this.current_entity_n = 0
    }

    let current_entity = this.get_current_entity()


    // computer controlled entities take their turn here, this loop goes on until we reach a player
    while( current_entity.is_machine_controlled() || current_entity.has_status('stunned') ) { 
      current_entity.tick() // machine controlled entity's turn starts with tick

      if( !options.npcs_passive ) {
        if( !current_entity.has_status('stunned') ) {
          options.log_character_turns && current_entity.is_character() && console.log(`It is ${current_entity}'s (#${current_entity.id}) turn.`)
          current_entity.act()                  
        }
        else {
          ui.text({location: current_entity.get_location()}, current_entity, ` is stunned.`)
        }
      }
   
      current_entity = this.next_entity()  // proceed to next entity
    }
    
    options.log_character_turns && console.log(`It is ${current_entity}'s (#${current_entity.id}) turn; handing control to user.`)
    current_entity.tick()
    // handling control back to player...

  } // main_loop
  
  run() { 
    ui.clear_entity_choices()
    this.main_loop() 
  }
  
  // called when the current player character ends their turn
  // restarts main loop, proceeding with actions as per game.initiative_order
  end_player_turn() {
    options.log_player_turn_milestones && console.log(`${player}'s turn ends`)
    this.next_entity()  // proceed to next entity
    this.main_loop()    // continue main loop...
  }
  
  reset_player_turn() {
    options.log_player_turn_milestones && console.log(`${player}'s turn resets`)
    player.moves = 1
  }
  
  end_game() {
    this.get_player().move_to(game.ending)
  }
    
}

var game = new Game()


//
// BUILTIN AREAS
// 

// the universe is the default location, its id must be 0
// everything else must have a location, except for the universe
game.universe = new Entity({
  name: "universe", 
  tags: ['location', 'universe'],
  description: `The universe is an abstract entity you are not supposed to interact with directly; you should never be seeing this ingame.`}
)

game.ending = new Entity({
  name: "The End",
  tags: ['abstract', 'location'],
  description: function() {   // redefine to reflect on what has happened and what the player has accomplished
    return `This is the end of the game, thanks for playing!`
  },
})


//
// CHARACTER GENERATION
// 

// abstract location entity, for the character generation screen
game.chargen = new Entity({
  name: "character generation",
  tags: ['abstract', 'location', 'chargen'],
  // icon: 'chargen2.png',
  // description: ,
  
  get_interior_description: function() {
    return ui.chargen_sheet()
  },
  
  // character_icons: game.character_icons,
  // character_backgrounds: game.character_backgrounds,
  
  start: function() {
    let them = game.get_player()
    them.gain(game.base_char)
    them.name = document.getElementById('chr_name').value
    them.gain( game.character_backgrounds[document.getElementById('chr_background').value] )
    them.recover()
    // them.move_to(this.onward)
    ui.cmd = new Cmd({verb: 'move', op1: this.onward, path: false})  // setting to a move command to scroll accordingly after refresh
    game.exec(ui.cmd)  // would be ideal, but would need a path for it too
    ui.refresh()
  },
  onward: game.universe,
})



game.base_char = {cp: 0}

game.character_icons = ['male0.png', 'male1.png', 'male2.png', 'female_trenchcoat4.png', 'female2.png', 'female3.png', 'female_trenchcoat2.png', 'unknown_trenchcoat.png', 'unknown_raincoat2.png', 'chargen2.png',],

game.character_backgrounds = {
  fighter: {
    label: `fighter`,
    tough:  4,
    cool:   0,
    sharp:  0,
    charm:  0,
    // inventory: ['knife', 'crowbar'],
    traits: ['combat', 'perception', 'survival'],
  },

  trickster: {
    label: `trickster`,
    tough:  1,
    cool:   3,
    sharp:  2,
    charm:  0,
    // inventory: ['knife', 'lockpicks'],
    traits: ['perception', 'evasion', 'stealth', 'lockpicking'],
  },

  brainy: {
    label: `brainy`,
    tough:  0,
    cool:   1,
    sharp:  3,
    charm:  2,
    // inventory: [],
    traits: ['science', 'tech use', 'lore'],
  },
  
  talker: {
    label: `talker`,
    tough:  1,
    cool:   0,
    sharp:  2,
    charm:  3,
    // inventory: [],
    traits: ['social', 'persuasion'],
  },
  
}
