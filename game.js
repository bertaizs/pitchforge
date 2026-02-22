
class Game {

    constructor() {
        this.entities = []
        this.templates = {}
        this.verbs = VERBS
        
        this.player_id = 1
        
    }

    entity(e) {
        if( isNaN(e))
            return e
        else
            if( e in this.entities )
                return this.entities[e]
        throw `no Entity with id: ${e}.`
    }
    
    get_player() { return this.entities[this.player_id]}
    get_player_location() { return this.entities[0]}
    select_player(e) {
      e = this.entity(e)
      this.player_id = e.id
    }
    
    exec(cmd = ui.cmd) {
      if( !(cmd instanceof Cmd) ) 
        throw `game.exec not called with Cmd instance`
      cmd.validate()  // throws an exception if cmd is not 'valid'
      
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

game.universe = new Entity({name: "universe", description: `The universe is an abstract entity you are not supposed to interact with directly; you should be seeing this ingame.`})
