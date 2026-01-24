
class Game {

    constructor() {
        this.entities = []
        this.templates = {}
    }

    entity(e) {
        if( isNaN(e))
            return e
        else
            if( e in this.entities )
                return this.entities[e]
        throw `no Entity with id: ${e}.`
    }
    
}

var game = new Game()

