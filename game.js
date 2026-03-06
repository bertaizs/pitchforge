
class Game {

  constructor() {
    this.templates = {}
    this.entities = []
    this.paths = []
    this.triggers = []
    
    this.verbs = VERBS

    
    this.player_id = 1
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
    for( let p of ['who', 'verb', 'op1'] ) {
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
  
  character_icons: ['male0.png', 'female_trenchcoat4.png', 'unknown_trenchcoat.png', 'unknown_raincoat2.png', ],
  
  character_backgrounds: {
    private_eye: {
      label: `private eye`,
      inventory: ['magnifying glass'],
      traits: ['perception', 'melee'],
      // sharp: 1,
      // charm: 2,
    },
    doctor: {
      label: `doctor`,
      traits: ['medicine'],
      inventory: ["doctor's bag"],
    },
    office_worker: {
      label: `office worker`,
      inventory: ['red stapler']
    },
    sandwichman: {
      label: `sandwichman`,
      cp: 3,
    },
  },
  
  
  start: function() {
    let them = game.get_player()
    them.name = document.getElementById('chr_name').value
    them.gain( game.chargen.character_backgrounds[document.getElementById('chr_background').value] )
    them.move_to(this.onward)
    ui.refresh()
  },
  onward: game.universe,
})
