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
        
        this.enabled ??= true        
        this.reqs ??= []
        
        VERBS[this.name] = this
    }

    get_name() { return this.name }
    get_prep() { return this.prep }
    get_sep() { return this.separator }
    get_label() { return (options.debug&&this.debug?"*":"")+this.get_name() }
    get_text() { return this.text }
}

// called via dedicated path links, not via calling this command
new Verb({
  name: 'move',
  type: 'debug',
  test: false,
  op1: true,
  text: `Go somewhere.`,
  debug: true,
  on_success: function(cmd) {
    cmd.who.move_to(cmd.op1)
  },
})

//
// verbs to be used for DEBUG purposes only, not in a real game
// 
new Verb({
  name: 'smile',
  type: 'debug',
  test: false,
  text: `Smile. Does not do anything, testing only.`,
  debug: true,
  on_success: function(cmd) {
    ui.add_event(`${cmd.who} smiles. :)`)
  },
})

new Verb({
  name: 'charsheet',    prep: 'of',
  type: 'debug',
  test: false,
  op1: true,
  debug: true,
  on_success: function(cmd) {
    // document.getElementById('work').innerHTML = ui.print_sheet(cmd.op1, cmd.p)
    ui.add_event( ui.print_sheet(cmd.op1, cmd.p) )
  },
})

new Verb({
  name: 'quests',    // prep: 'of',
  type: 'debug',
  test: false,
  op1: false,
  debug: true,
  on_success: function(cmd) {
    // document.getElementById('work').innerHTML = ui.print_sheet(cmd.op1, cmd.p)
    ui.add_event( ui.print_quests() )
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
    ui.add_event(`${cmd.op1} has been selected as the active character.`)
  },
})


//
// ACTIONS
// 
new Verb({
  name: 'examine',         prep: '',
  icon: '🔎',
  text: `Examine someone or something thoroughly, potentially learn about its strengths and weaknesses.`,
  type: 'action',
  test: false,
  // test: 'sharp',
  // difficulty: 1,
  op1: true,
  on_success: function(cmd) {
    // console.log(cmd)
    let perception = (cmd.who.id==cmd.op1.id ? Infinity : cmd.who.performance('perception') )
    ui.add_event( ui.print_sheet(cmd.op1, {perception: perception}) )
  },
  sortkey: 1,
})

new Verb({
  name: 'talk',        prep: 'to',
  icon: '💬',
  text: `Talk to another character.`,
  type: 'action',
  test: false,
  op1: true,
  on_success: function(cmd) {
    ui.add_event(`There is no response.`)
  },
  sortkey: 3,
})

//
// COMBAT
// 

new Verb({
  name: 'attack',
  icon: '⚔️',
  text: `Attack someone with the currently equipped weapon. You strike them with a melee weapon, you shoot them if you are wielding a ranged weapon.`,
  type: 'combat',
  test: 'attack',
  test_vs: 'defense',
  op1: true,
  on_success: function(cmd) {
    if( !cmd.op1.is_character() ) {
      return ui.add_event(`There is no point in attacking ${cmd.op1}.`)
    }
    
    // ui.add_event(`${cmd.who} strikes ${cmd.op1} and hits for ${damage} points of damage`)
    ui.add_event(`${cmd.who} strikes ${cmd.op1}.`)
    let damage = cmd.op1.take_damage({value: 1, tier: cmd.who.get('damage_tier')})
    cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
  },
  on_fail: function(cmd) {
    cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
    ui.add_event(`${cmd.who} swings at ${cmd.op1} but misses.`)
  },
})

new Verb({
  name: 'kick',
  icon: '🥋',
  text: `Deliver a powerful circle kick`,
  type: 'combat',
  test: 'attack',
  test_vs: 'defense',
  op1: true,
  reqs: {traits: {'martial arts': true}},
  
  on_success: function(cmd) {
    if( !cmd.op1.is_character() ) {
      return ui.add_event(`There is no point in attacking ${cmd.op1}.`)
    }
    
    // ui.add_event(`${cmd.who} strikes ${cmd.op1} and hits for ${damage} points of damage`)
    ui.add_event(`${cmd.who} strikes ${cmd.op1}.`)
    let damage = cmd.op1.take_damage({value: 2})
    cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
  },
  on_fail: function(cmd) {
    cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
    ui.add_event(`${cmd.who} swings at ${cmd.op1} but misses.`)
  },
})

new Verb({
  name: 'recover',         // prep: 'at',
  icon: '💤',
  text: `Recover lost body and spirit points and remove all threat from yourself. Does not heal your wounds.`,
  type: 'combat',
  test: false,
  sortkey: 99,
  on_success: function(cmd) {
    // todo: should not be immediate
    ui.add_event( `${cmd.who} takes a breather...` )
    cmd.who.recover()
  },
})



//
// *** inventory ***
//
new Verb({
  name: 'pick up',
  icon: '🤌',
  text: `Pick up an item and add it to your inventory.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if(cmd.op1.is_takeable()) { // can only pick up what is 'takeable'
      // and either in the same location as the player or in an open container (anywhere?)
      if( (cmd.op1.get_location().id == cmd.who.get_location().id) || 
          cmd.op1.get_location().is_open_container() ) {
        cmd.op1.move_to(cmd.who)
        ui.add_event(`${cmd.who} picks up ${cmd.op1}.`)
      }
      else
        ui.add_event(`${cmd.who} cannot pick up ${cmd.op1} as it is not on the ground.`)
    } 
    else
      ui.add_event(`${cmd.who} cannot pick up ${cmd.op1}.`)
  },
  sortkey: 1,
})

new Verb({
  name: 'drop',
  icon: '🫳',
  text: `Remove an item from your inventory and put it on the ground.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    cmd.op1.move_to(cmd.who.get_location())
    ui.add_event(`${cmd.who} drops ${cmd.op1}.`)
  },
  sortkey: 2,
})

new Verb({
  name: 'equip',  // as weapon
  icon: '🧤', // 🧤🧢
  text: `Wield the given item as a weapon or equip it as armour.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.who.has( cmd.op1) )
      return ui.add_event(`${cmd.who} does not have ${cmd.op1}.`)
    
    let where = 'weapon'
    cmd.who.list_entities_here()
        .map( x=>{
              if(x.position==where) {
                ui.add_event(`${cmd.who} unequips ${x}.`)
                x.position=false
              }
        } ) // unequip all
    cmd.op1.move_to(cmd.who, where) // pick up and equip
    ui.add_event(`${cmd.who} now wields ${cmd.op1}.`)
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
      return ui.add_event(`${cmd.who} does not have ${cmd.op1}.`)
    if( cmd.op1.get('position') == false )
      return ui.add_event(`${cmd.who} does not have ${cmd.op1} equipped.`)
    
    cmd.op1.position = false
    ui.add_event(`${cmd.who} unequips ${cmd.op1}.`)
  },
  sortkey: 4,
})

new Verb({
  name: 'use',
  icon: '🔧',
  text: `Try to find a way to use an item. Try pushing or pulling it, turning it on. If it can be opened, then try opening it. If not, then try closing it. If it can be eaten, you will eat it.`,
  type: 'action',
  test: false,
  op1: true,    separator: 'and',
  op2: true,
  on_success: function(cmd) {    
    ui.add_event(`This does not seem to work.`)
  },
  sortkey: 2,
})

new Verb({
  name: 'consume',
  icon: '🍔',
  text: `Consume the given item.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    ui.add_event(`This does not seem to work.`)
  },
  sortkey: 6,
})

new Verb({
  name: 'give',
  icon: '🎁',
  text: `Give and item to someone.`,
  type: 'action',
  test: false,
  op1: true,    separator: 'to',
  op2: true,
  on_success: function(cmd) {
    if(cmd.op1.get_location()!=cmd.who) {
      ui.add_event(`${cmd.who} does not have ${cmd.op1}.`)
      return true
    }
    if(!cmd.op1.is_takeable()) {
      ui.add_event(`${cmd.who} cannot give away ${cmd.op1}.`)
      return true
    }
    if(!cmd.op2.is_character()) {
      ui.add_event(`${cmd.who} cannot give away ${cmd.op1} to ${cmd.op2}.`)
      return true
    }
    ui.add_event(`${cmd.who} gives ${cmd.op1} to ${cmd.op2}.`)
    cmd.op1.move_to(cmd.op2)
  },
  sortkey: 4,
})




//
// SPECIAL ACTIONS
// 
new Verb({
  name: 'pickpocket',
  icon: '👜',
  type: 'action',
  test: 'pickpocket',
  op1: true,
  reqs: {cool: 1},
  
  difficulty: function(cmd) {
    let owner = cmd.op1.get_location()
    return owner.performance('perception')
  },
  on_success: function(cmd) {
    if(cmd.op1.is_takeable()) {
      let owner = cmd.op1.get_location()
      cmd.op1.move_to(cmd.who)
      ui.add_event(`${cmd.who} has stolen ${cmd.op1} from ${owner}.`)      
    } 
    else
      ui.add_event(`${cmd.who} cannot steal ${cmd.op1}, items can be stolen only.`)
  },
  on_fail: function(cmd) {
    let owner = cmd.op1.get_location()
    // cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
    ui.add_event(`${owner} noticed that ${cmd.who} was trying to steal ${cmd.op1}!`)
    ui.add_event(`${owner} is angry!`)
  },
  sortkey: 5,
})

new Verb({
  name: 'sneak',
  icon: '🥷',
  text: `Enter sneak mode.`,
  type: 'action',
  test: false,
  reqs: {cool: 1},
  on_success: function(cmd) {
    ui.add_event(`${cmd.who} starts sneaking.`)
    cmd.who.add_status({name: "sneaking", timer: cmd.who.get('cool')})
  },
  sortkey: 6,
})
