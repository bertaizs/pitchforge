
var entities = []

class Entity {

    static max_id = 0

    static epithets = ["angry", "vicious", "bloodthirsty", "scarred", "dastardly", "violent", "raging", "ruthless", "muscular"]

    constructor( value = {}, param = {}) {
        for( let i in value )
            this[i] = value[i]

        this.name ??= "nameless"
        this.tags ??= {}
        this.description ??= "no description"

        // this.position ??= false     // or string describing how/where the Noun is
        // this.img ??= false          // or image file name
        // this.location_id ??= 0      // the default location of all will be the game universe
        // this.exits ??= []
        this.epithet ??= ''
        if( !('template' in param) ) {
            this.register()
            // game.nouns[this.id] = this
        } else {
            this.epithets ??= Noun.epithets         // exists in templates only, defaults to the Noun.epithets
            game.templates[param.template] = this
        }

    }

    static spawn(template, where, changes = {} ) {
        // console.log("Noun.spawn")
        if( !(template in game.templates) ) throw `no such template: ${template}`

        let noun = Object.create( Object.getPrototypeOf(game.templates[template]) )

        noun.set( game.templates[template] )
        noun.register()
        noun.set_location(where)

        if( noun.epithets && !('name' in changes) ) {
            noun.epithet = noun.epithets[ noun.id % noun.epithets.length  ]
            delete noun.epithets
        }

        // noun.adjective = game.templates[template].adjectives[ noun.id % game.templates[template].adjectives.length ]

        for( let i in changes )
            noun[i] = changes[i]

        return noun
    }

    register() {
        this.id = Noun.max_id++
        game.nouns[this.id] = this
    }

    set( changes ) {
        Object.assign( this, JSON.parse(JSON.stringify(changes)) )
        return this
    }

}   // Entity

