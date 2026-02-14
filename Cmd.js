
class Cmd {
    constructor(value = {}, params = {}) {
        for( let i in value )
            this[i] = value[i]
        
            // Cmd shall always have an attr called verb
            // which must point to VERBS
        if( !('verb' in this) )
          throw `missing verb in command: ${this}`        
        if( typeof this.verb!='string' || !(this.verb in VERBS) )
          throw `invalid verb in command: ${this.verb}`
        let verb = VERBS[this.verb]

        this.op1 ??= false
        if( this.op1 ) this.op1 = game.entity(this.op1)
        this.op2 ??= false
        if( this.op2 ) this.op2 = game.entity(this.op2)
        this.param ??= false
        
        if( verb.op1 && !this.op1 )
          throw `mandatory op1 missing! (command: ${this.verb})`
    }
}
