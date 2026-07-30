
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

  // !!! todo: remove
  add_trigger( pattern={}, action = ()=>(console.log(`empty action`)), sortkey = 100 ) {
    console.log('add_trigger')
    
    if( 'verb' in pattern == false ) throw `no verb in pattern: ${pattern}`
    pattern.who ??= /.*/
    pattern.op1 ??= /.*/
    pattern.op2 ??= /.*/
    this.triggers.push( {pattern: pattern, action: action, sortkey: sortkey} )
  }
  
  
  // returns true if the cmd (Cmd) matches the pattern
  // pattern is created by game.add_trigger
  match( pattern, cmd ) {
    options.log_matching_details && console.log(`matching `, pattern, `vs`, cmd)
    if( ! cmd.match( 'verb', pattern['verb'] ) ) {
      // options.log_matching_details && console.log(`no match`)
      return false
    }
    if( ! cmd.match( 'who', pattern['who'] ) ) {
      // options.log_matching_details && console.log(`no match`)
      return false
    }
    // for op1 and op2, check if EITHER order matches
    if( cmd.match('op1',pattern['op1']) && cmd.match('op2',pattern['op2']) ) {
      options.log_matching_details && console.log(`match!`)
      return true
    }
    if( cmd.match('op1', pattern['op2']) && cmd.match('op2', pattern['op1']) ) {
      options.log_matching_details && console.log(`match!`)
      // replace op1 ond op2, so that the trigger needs to be defined only once
      let x = cmd.op1
      cmd.op1 = cmd.op2
      cmd.op2 = x
      return true
    }
    return false
  }

  // old version, with limitation: if there are both op1 and op2, they can match in this order only, not if reversed
  // __match( pattern, cmd ) {
  //   options.log_matching_details && console.log(`matching `, pattern, `vs`, cmd)
  //   for( let p of ['who', 'verb', 'op1', 'op2'] ) {
  //     if( ! cmd.match( p, pattern[p] ) ) {
  //       options.log_matching_details && console.log(`no match`)
  //       return false
  //     }
  //   }
  //   options.log_matching_details && console.log(`match!`)
  //   return true
  // }

  
  // called when someone executes a command
  // - calls entity.exec
  // - ends turn if needed
  exec(cmd = ui.cmd) {
    if( !(cmd instanceof Cmd) ) throw `game.exec not called with Cmd instance`
    cmd.validate()  // throws an exception if cmd is not 'valid'
    options.log_commands && console.log(`executing: `, cmd)
    
    // if( !action_triggered ) {   // if no action has been triggered, execute the default action
      // options.log_matching && console.log(`executing default command`)

    this.get_current_entity().exec(cmd)      
    // }
    console.log('*******************')
    
    // TODO: rework action economy and MOVES?????
    // check if the given cmd is turn ending for the player
    if( this.get_current_entity().id == game.get_player().id ) {
      let player = game.get_player()
      // if moved and still has moves, then use a move and do not end turn; if not in combat, end tht turn
      if( cmd.verb=='move' && player.get('moves')>0 && player.is_in_combat() ) {
        player.moves--
        options.log_player_turn_milestones && console.log(`${player} used a move`)
      }
      else 
      if( !('quick' in cmd ) ) {  // 'quick' commands don't end the turn
        player.moves = 1
        game.end_player_turn()  // proceeds with main_loop
      } else {
        options.log_player_turn_milestones && console.log(`${player}'s turn continues`)        
      }
    }
  }
  
  get_current_entity() {
    return this.initiative_order[this.current_entity_n]
  }
  
  // proceed to next entity in the initiative order
  // if end of initiative order then restart it
  next_entity() {
    if( this.initiative_order.length == 0 ) throw `game.next entity called without game.main_loop`
    
    this.current_entity_n++
    if( this.current_entity_n >= this.initiative_order.length ) { // if end of initiative order
      this.initiative_order = this.build_initiative_order()
      this.current_entity_n = 0   // rebuild and restart initiative order
    }
    return this.get_current_entity()
  }
  
  // (re)builds the initiative order
  build_initiative_order() {
    options.log_turn_start && console.log(`*** TURN starts ***`)
    return game.entities
              .filter(x=>(!x.is('abstract') && !x.is('universe')))
              .sort( (x,y)=>(y.performance('initiative')-x.performance('initiative') || x.id-y.id) )
  }
  
  // this loop runs 
  main_loop() {
    if( this.initiative_order.length == 0 ) {
      this.initiative_order = this.build_initiative_order()
      this.current_entity_n = 0
    }

    let current_entity = this.get_current_entity()
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
    
    current_entity.tick() // player controlled entity's turn starts with tick
    options.log_character_turns && console.log(`It is ${current_entity}'s (#${current_entity.id}) turn; handing control to user.`)
    // options.log_character_turns && console.log(`Handing control to user.`)
  } // main_loop
  
  run() { this.main_loop() }
  
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
  tags: ['abstract', 'location'],
  icon: 'chargen2.png',
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
    them.move_to(this.onward)
    ui.refresh()
  },
  onward: game.universe,
})



game.base_char = {cp: 0}

game.character_icons = ['male0.png', 'male1.png', 'male2.png', 'female_trenchcoat4.png', 'female2.png', 'female3.png', 'female_trenchcoat2.png', 'unknown_trenchcoat.png', 'unknown_raincoat2.png', 'chargen2.png',],

game.character_backgrounds = {
  private_eye: {
    label: `private eye`,
    tough:  2,
    cool:   2,
    sharp:  2,
    charm:  1,
    inventory: ['magnifying glass'],
    traits: ['perception'],
  },
  doctor: {
    label: `doctor`,
    tough:  0,
    cool:   2,
    sharp:  3,
    charm:  0,
    cp:     1,
    traits: ['medicine'],
    inventory: ["doctor's bag"],
  },
  bruiser: {
    label: `bruiser`,
    tough:  4,
    cool:   0,
    sharp:  0,
    charm:  0,
    // traits: ['bruiser'],
    inventory: ['crowbar', 'knife']  
  },
  secretAgent: {
    label: `secret agent`,
    tough:  1,
    cool:   2,
    sharp:  2,
    charm:  2,
    traits: ['sneaking', 'social'],
    inventory: ['knife'], // revolver?
  },
  thief: {
    label: `thief`,
    tough:  1,
    cool:   3,
    sharp:  2,
    charm:  0,
    traits: ['sneaking', 'lockpicking', 'pickpocket'],
    inventory: ['lockpicks', 'crowbar']
  },
  handyman: {
    label: `handyman`,
    tough:  2,
    cool:   3,
    sharp:  1,
    charm:  0,
    traits: ['crafting', 'repair'],
    inventory: ['toolkit', 'crowbar']
  },
  office_worker: {
    label: `office worker`,
    tough:  0,
    cool:   0,
    sharp:  0,
    charm:  0,
    cp: 10,
    inventory: ['red stapler']
  },
  kungfu: {
    label: `kung-fu master`,
    tough:  2,
    cool:   3,
    sharp:  1,
    charm:  0,
    traits: ['martial arts'],
  },
  chess: {
    label: `chess player`,
    tough: -1,
    cool:   1,
    sharp:  5,
    charm:  0,
    traits: ['chess', 'absent minded'],
  },
  salesman: {
    label: `salesman`,
    tough:  1,
    cool:  -2,
    sharp:  1,
    charm:  4,
    traits: ['social'],
  },
  occultist: {
    label: `occultist`,
    tough: -1,
    cool:   0,
    sharp:  1,
    charm:  4,
    traits: ['occultism', 'sixth sense', 'creepy'],
    knowledge: [
      { tag: 'slaying_vampires',
        text: `As an occultist, you know how to slay creatures of the night. For example, ghouls are simple creatures, you just need to beat them and they go down. However, to slay a vampire you need to drive a stake through their heart. You can also destroy them if you incinerate them completely, either by fire or by exposure to direct sunlight.` }
    ]
  },
  sandwichman: {
    label: `sandwichman`,
    tough:  2,
    cool:   1,
    sharp:  2,
    charm:  2,
    cp: 3,
  },
}


//
// GENERIC TRIGGERS
// these should work similarly in all games
// 
// !!! todo: remove all of these, replace with choices

// doors: opening and closing
// game.add_trigger(
//   {verb: /use/, op1: /.*/, op2: /^$/},
//   function(cmd) {
//     if( cmd.op1.is('open') || cmd.op1.is('closed') ) {
//       let door = cmd.op1
      
//       if( door.is('locked') ) {
//         ui.text(door, ` is locked.`)
//         return true
//       }
      
//       if( door.is('open') ) {
//         door.remove_tag('open')
//         door.set_tag('closed')
//         ui.text(cmd.who, ` closes `, door)
//         return true
//       } else 
//       if( door.is('closed') && !door.is('locked') ) {
//         door.remove_tag('closed')
//         door.set_tag('open')
//         ui.text(cmd.who, ` opens `, door)
//         return true
//       }
//     }
//     return false
//   }, 999 )

// lockpicking
game.add_trigger(
  {verb: /use/, op1: /lockpick/, op2: /.*/},
  function(cmd) {
    if( cmd.op2.is('locked') ) {
      
      let lock = cmd.op2
      if( cmd.who.test('lockpicking', 
          cmd.op2.performance('cool')   ) ) {
        cmd.op2.remove_tag('locked')
        ui.text(cmd.who, ` has picked the lock on `, cmd.op2)
        return true
      } else {
        ui.text(cmd.who, ` failed to pick the lock on `, cmd.op2)
        return true
      }

    }
    ui.text( cmd.op2, ` is not locked.`)
    return true
  }, 999 )

// forcing a door with a crowbar
game.add_trigger(
  {verb: /use/, op1: /crowbar/, op2: /.*/},
  function(cmd) {
    if( cmd.op2.is('locked') ) {
      
      let lock = cmd.op2
      if( cmd.who.test('tough', 
          cmd.op2.performance('tough')   ) ) {
        cmd.op2.remove_tag('locked')
        cmd.op2.remove_tag('closed')
        cmd.op2.set_tag('open')
        ui.text(cmd.who, ` has ripped `, cmd.op2, ` open!`)
        return true
      } else {
        ui.text(cmd.who, ` failed to force `, cmd.op2, ` open.`)
        return true
      }

    }
    ui.text( cmd.op2, ` is not locked.`)
    return true
  }, 999 )

// unlocking or locking a door with a key
game.add_trigger(
  {verb: /use/, op1: /.*/, op2: /.*/},
  function(cmd) {
    if( cmd.op1==false || cmd.op2==false ) return false
    let key = false, door = false
    if( cmd.op1.is('locked') || cmd.op1.is('door') ) {
      door = cmd.op1
    }
    if( cmd.op2.is('locked') || cmd.op2.is('door') ) {
      door = cmd.op2
    }
    if( cmd.op1.is('key') ) {
      key = cmd.op1
    }
    if( cmd.op2.is('key') ) {
      key = cmd.op2
    }

    if( key && door ) {
      if( door.key != key.id ) {
        ui.text(key, ` is not the right key for `, door, `.`)
        return true        
      }
      if( door.is(`locked`) ) {
          ui.text(cmd.who, ` unlocks `, door, ` with `, key, `.`)
          door.remove_tag('locked')
          return true
      } else {
        ui.text(cmd.who, ` locks `, door, ` with `, key, `.`)
        door.remove_tag('open')
        door.set_tag('closed')
        door.set_tag('locked')
        return true
      }
    }
    // ui.text( cmd.op2, ` is not locked.`)
    return false
  }, 999)
