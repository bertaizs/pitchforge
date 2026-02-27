/*
A verb is an abstract action, which may have some parameters,
thus providing a template for Cmd (Command).
Verbs do not change throughout the game.
*/


const VERBS = {}

class Verb {

    constructor(value = {}, params = {}) {
        for( let i in value )
            this[i] = value[i]

        this.name ??= 'noAction'
        this.text ??= this.name
        this.type ??= 'misc'  // combat | movement | inventory | misc
        this.icon ??= ''

        this.op1 ??= false  // character | string
        this.op2 ??= false
        this.param ??= false
        
        this.prep ??= ''  // preposition, e.g. look AT
        this.sep ??= ''   // separates the operands e.g. use paper WITH pencil
        
        this.test ??= false // class: Test
        this.test_vs ??= false // class: Test, of this.op1
        this.on_success ??= ()=>{ console.log(`empty on_success for ${this.name}`) }
        this.on_fail ??= ()=>{ console.log(`empty on_success for ${this.name}`) }

        this.sortkey ??= 10
        
        // this.min_ops ??= 1
        // this.max_ops ??= 2
        // this.op_separator ??= ''
        // this.tab ??= 'inventory'

        // game.verbs[this.name] = this
        VERBS[this.name] = this
    }

    get_name() { return this.name }
    get_prep() { return this.prep }
    get_label() { return (options.debug&&this.debug?"*":"")+this.get_name() }
    get_text() { return this.text }
}

new Verb({
  name: 'smile',
  type: 'debug',
  test: false,
  text: `Smile at someone or something. Does not do anything, testing only.`,
  debug: true,
  on_success: function(cmd) {
    ui.add_event(`${cmd.who} smiles :)`)
  },
})

new Verb({
  name: 'jump',
  type: 'misc',
  test: 'tough',
  difficulty: 1,
  on_success: function(cmd) {
    ui.add_event(`${cmd.who} jumps into the air :)`)
  },
  on_fail: function(cmd) {
    ui.add_event( `${cmd.who} is too weak to jump :(` )
  },
})

new Verb({
  name: 'look',         prep: 'at',
  type: 'misc',
  test: false,
  // test: 'sharp',
  // difficulty: 1,
  op1: true,
  on_success: function(cmd) {
    console.log(cmd)
    let perception = (cmd.who.id==cmd.op1.id ? Infinity : cmd.who.performance('perception') )
    ui.add_event( ui.print_sheet(cmd.op1, {perception: perception}) )
    // return(`displaying charsheet of ${cmd.op1}`)
  },
})

new Verb({
  name: 'charsheet',    prep: 'of',
  type: 'debug',
  test: false,
  op1: true,
  debug: true,
  on_success: function(cmd) {
    ui.add_event( ui.print_sheet(cmd.op1) )
    // return(`displaying charsheet of ${cmd.op1}`)
  },
})

new Verb({
  name: 'select',    prep: '',
  type: 'debug',
  test: false,
  op1: true,
  debug: true,
  on_success: function(cmd) {
    game.select_player(cmd.op1)
    ui.add_event(`${cmd.op1} has been selected as the active character`)
  },
})

new Verb({
  name: 'move',    prep: 'to',
  type: 'debug',
  test: false,
  op1: true,
  debug: true,
  on_success: function(cmd) {
    cmd.who.move_to(cmd.op1)
    ui.add_event(`${cmd.who} moves to ${cmd.op1}`)
  },
})


new Verb({
  name: 'melee',
  type: 'combat',
  test: 'melee',
  test_vs: 'defense',
  op1: true,
  on_success: function(cmd) {
    let damage = cmd.op1.take_damage({value: 2})
    cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
    ui.add_event(`${cmd.who} strikes ${cmd.op1} and hits for ${damage} points of damage`)
  },
  on_fail: function(cmd) {
    cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
    ui.add_event(`${cmd.who} swings at ${cmd.op1} but misses`)
  },
})

//
// *** inventory ***
//
new Verb({
  name: 'pick up',
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    cmd.op1.move_to(cmd.who)
    ui.add_event(`${cmd.who} picks up ${cmd.op1}`)
  },
  sortkey: 1,
})

new Verb({
  name: 'drop',
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    cmd.op1.move_to(cmd.who.get_location())
    ui.add_event(`${cmd.who} drops ${cmd.op1}`)
  },
  sortkey: 2,
})

new Verb({
  name: 'equip',  // as weapon
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.who.has( cmd.op1) )
      return ui.add_event(`${cmd.who} does not have ${cmd.op1}`)
    
    let where = 'weapon'
    cmd.who.list_entities_here()
        .map( x=>{
              if(x.position==where) {
                ui.add_event(`${cmd.who} unequips ${x}`)
                x.position=false
              }
        } ) // unequip all
    cmd.op1.move_to(cmd.who, where) // pick up and equip
    ui.add_event(`${cmd.who} now wields ${cmd.op1}`)
  },
  sortkey: 3,
})

new Verb({
  name: 'unequip',  // as weapon
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.who.has( cmd.op1) )
      return ui.add_event(`${cmd.who} does not have ${cmd.op1}`)
    if( cmd.op1.get('position') == false )
      return ui.add_event(`${cmd.who} does not have ${cmd.op1} equipped`)
    
    cmd.op1.position = false
    ui.add_event(`${cmd.who} unequips ${cmd.op1}`)
  },
  sortkey: 4,
})



// new Verb({
//   name: 'aim',
//   type: 'combat',
//   test: 'aim',
//   // test_vs: 'defense',
//   difficult: 3, // calc??
//   op1: true,
//   on_success: function(who, cmd) {
//     cmd.op1.take_damage({value: 2})
//     cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
//     return("STRIKE!!!")
//   },
//   on_fail: function(who, cmd) {
//     cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
//     return("missed :(")
//   },
// })
