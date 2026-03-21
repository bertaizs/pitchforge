
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
    
  add_trigger( pattern={}, action = ()=>(console.log(`empty action`)), sortkey = 100 ) {
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
    for( let p of ['who', 'verb', 'op1', 'op2'] ) {
      if( ! cmd.match( p, pattern[p] ) ) {
        options.log_matching_details && console.log(`no match`)
        return false
      }
    }
    options.log_matching_details && console.log(`match!`)
    return true
  }
  
  exec(cmd = ui.cmd) {
    if( !(cmd instanceof Cmd) ) throw `game.exec not called with Cmd instance`
    cmd.validate()  // throws an exception if cmd is not 'valid'
    
    options.log_commands && console.log(`executing: `, cmd)
    
    // if any of the triggers match, execute the triggered actions
    for( let trigger of game.triggers.sort((x,y)=>(x.sortkey-y.sortkey)) ) {
      if( this.match(trigger.pattern, cmd) ) {
        options.log_matching && console.log(`match found: `, trigger.pattern, cmd)
        let quit = trigger.action(cmd)
        if( quit ) return false
      }
    }
    
    options.log_matching && console.log(`executing default command`)
    this.get_player().exec(cmd)
  }
  
  // main clock beat of the game
  tick() {
    options.log_ticks && console.log(`tick!`)
    for( let i in game.entities ) {
      let e = game.entities[i]
      options.log_entity_ticks && console.log(`tick: ${e}`)
      e.tick()
      
    }
  }
    
}

var game = new Game()

game.universe = new Entity({
  name: "universe", 
  tags: ['location'],
  description: `The universe is an abstract entity you are not supposed to interact with directly; you should never be seeing this ingame.`}
)

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
    // traits: ['sneaking', 'lockpicking'],
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
    inventory: ['lockpick', 'crowbar']
  },
  handyman: {
    label: `handyman`,
    tough:  2,
    cool:   3,
    sharp:  1,
    charm:  0,
    traits: ['crafting', 'lockpicking'],
    inventory: ['lockpick', 'crowbar']
  },
  office_worker: {
    label: `office worker`,
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
