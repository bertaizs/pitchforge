
const VERBS = {}

class Verb {

    constructor(value = {}, params = {}) {
        for( let i in value )
            this[i] = value[i]

        this.name ??= 'noAction'
        this.text ??= this.name
        this.icon ??= ''

        this.op1 ??= false  // character | string
        this.op2 ??= false
        this.param ??= false
        
        this.test ??= false // class: Test
        this.test_vs ??= false // class: Test, of this.op1
        this.on_success ??= ()=>{ console.log(`empty on_success for ${this.name}`) }
        this.on_fail ??= ()=>{ console.log(`empty on_success for ${this.name}`) }
    
        // this.min_ops ??= 1
        // this.max_ops ??= 2
        // this.op_separator ??= ''
        // this.tab ??= 'inventory'

        // game.verbs[this.name] = this
        VERBS[this.name] = this
    }

    get_name() { return this.name}
    get_text() { return this.text }
}

new Verb({
  name: 'smile',
  test: false,
  on_success: function(who, cmd) {
    return(`${who} smiles :)`)
  },
  on_fail: function(who, cmd) {
    throw `smiles cannot fail!`
  },
})

new Verb({
  name: 'jump',
  test: 'tough',
  difficulty: 1,
  on_success: function(who, cmd) {
    return(`${who} jumps into the air :)`)
  },
  on_fail: function(who, cmd) {
    return `${who} is too weak to jump :(`
  },
})

new Verb({
  name: 'wrestle',
  test: 'tough',
  on_success: function(who, cmd) {
    return("STRIKE!!!")
  },
  on_fail: function(who, cmd) {
    return("missed :(")
  },
})

new Verb({
  name: 'melee',
  test: 'melee',
  test_vs: 'defense',
  op1: true,
  on_success: function(who, cmd) {
    return("STRIKE!!!")
  },
  on_fail: function(who, cmd) {
    return("missed :(")
  },
})
