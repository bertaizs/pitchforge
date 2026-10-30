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


    run_who_test(cmd) {
      let result, e = {}
      result = cmd.who.performance(this.test, {}, e)   // TEST for the one taking action
      cmd.e = e
      return result
    }
    
    run_op1_test(cmd) {
      let vs_result, e2 = {}
      vs_result = cmd.op1.performance( (this.test_vs ? this.test_vs : this.test), {}, e2 )
      cmd.e2 = e2
      return vs_result
    }
    
    // executes the test for the verb, with respect to the given command
    // writes results of the command back into the cmd record
    run_test(cmd) {
      let result = 2 // assume success
      let vs_result = 0
      
      if( this.test ) {   // if a test is needed, we run it
        cmd.e = {}
        result = this.run_who_test(cmd)
        options.log_test_results && console.log(`${cmd.who}'s performance:`, cmd.e.result, cmd.e)

        options.log_test_results && console.log(`${cmd.op1}'s performance:`, cmd.e.result, cmd.e)
        
        if( this.difficulty ) {   // fixed difficulty
          if( typeof this.difficulty == 'number' )
            vs_result = this.difficulty
          else
            if( typeof verb.difficulty == 'function' )
              vs_result = this.difficulty(cmd)
            else
              throw `don't know how to process difficulty: ${this.difficulty}`
        } else
        if( this.op1 ) {          // versus test
          cmd.e2 = {}
          vs_result = this.run_op1_test(cmd)
        }

        options.log_test_results && console.log(`vs performance: ${vs_result}`)        
        result -= vs_result   // this is where we compare this entity's performance with the other's performance
        cmd.result = result
      } else {  // if no test is needed, we just set result as success
        options.log_test_results && console.log(`no test -> auto success`) 
        result = 1
      }

      return result
    }

}

// called via dedicated path links, not via calling this command
new Verb({
  name: 'move',
  type: 'move',
  test: false,
  op1: true,
  text: `Go somewhere.`,
  debug: true,
  on_success: function(cmd) {
    if( !('path' in cmd) )
      throw `no path received in cmd: ${cmd}`

    if( cmd.path )
      cmd.path.move_through(cmd)
    else {
      if( options.log_move ) console.log('moving directly, without a path')
      cmd.who.head_towards(cmd.op1)
    }
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
    ui.text(cmd.who, ` smiles. :)`)
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
    ui.text(cmd.op1, ` has been selected as the active character.`)
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

// new Verb({
//   name: 'talk',        prep: 'to',
//   icon: '💬',
//   text: `Talk to another character.`,
//   type: 'action',
//   test: false,
//   op1: true,
//   on_success: function(cmd) {
//     ui.add_event(`There is no response.`)
//   },
//   sortkey: 3,
// })

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

  run_who_test(cmd) {
    let result = cmd.who.performance_attack({}, cmd.e)
    cmd.e.label = "attack"
    return result
  },
  run_op1_test(cmd) {
    return cmd.op1.performance_defense({}, cmd.e2)
  },
  
  on_success: function(cmd) {
    // if( !cmd.op1.is_character() ) {
    //   return ui.text(`There is no point in attacking `, cmd.op1, `.`)
    // }
    let p = {
      attack_text: "attacks",
    }
    cmd.who.hit( cmd.op1, p, cmd )        
  },
  on_fail: function(cmd) {
    let p = {
      attack_text: "attacks",
    }
    cmd.who.miss( cmd.op1, p, cmd )
  },
})


new Verb({
  name: 'heavy attack',
  icon: '⚔️',
  text: `Heavy attack someone with the currently equipped melee weapon.`,
  type: 'combat',
  test: 'attack',
  test_vs: 'defense',
  op1: true,

  run_who_test(cmd) {
    let result = cmd.who.performance_attack({bonus: HEAVY_ATTACK_DIFFICULTY}, cmd.e)
    cmd.e.label = "attack"
    return result
  },
  run_op1_test(cmd) {
    return cmd.op1.performance_defense({}, cmd.e2)
  },
  
  on_success: function(cmd) {
    // if( !cmd.op1.is_character() ) {
    //   return ui.text(`There is no point in attacking `, cmd.op1, `.`)
    // }
    let p = {
      attack_text: "performs heavy attack",
      extra_damage_first: HEAVY_ATTACK_BONUS_DAMAGE,
    }
    cmd.who.hit( cmd.op1, p, cmd )    
  },
  on_fail: function(cmd) {
    let p = {
      attack_text: "performs heavy attack",
    }
    cmd.who.miss( cmd.op1, p, cmd )
  },
})


new Verb({
  name: 'feint',
  icon: '⚔️',
  text: `Feint an attack; do no damage, but if it works, build threat.`,
  type: 'combat',
  test: 'feint',
  test_vs: 'perception',
  op1: true,
  
  on_success: function(cmd) {
    let p = {
      attack_text: "feints",
      no_damage: true,
      half_damage_on_graze: false,
      threat_damage: true,
      // extra_damage_first: HEAVY_ATTACK_BONUS_DAMAGE,
    }
    cmd.who.hit( cmd.op1, p, cmd )  

//     if( !cmd.op1.is_character() ) {
//       return ui.text(`There is no point in attacking `, cmd.op1, `.`)
//     }
//     ui.text(cmd.who, ` feints `, cmd.op1, '.', ui.print_explanation_tag([cmd.e, cmd.e2])    )
// 
//     let dmg = cmd.who.get_damage()
//     // damage.value += HEAVY_ATTACK_BONUS_DAMAGE
//     
//     // damage that could hurt builds threat
//     if( dmg.tier>= cmd.op1.get_armor_tier() )
//       cmd.op1.build_threat(dmg.value)
//     else 
//       options.log_threat && console.log(`no threat is built as attack could not damage`)
  },
  on_fail: function(cmd) {
    ui.text(cmd.who, ` feints, but `, cmd.op1, ` does not fall for it.`, ui.print_explanation_tag([cmd.e, cmd.e2])  )
  },
})




// new Verb({
//   name: 'kick',
//   icon: '🥋',
//   text: `Deliver a powerful circle kick`,
//   type: 'combat',
//   test: 'attack',
//   test_vs: 'defense',
//   op1: true,
//   reqs: {traits: {'martial arts': true}},
  
//   on_success: function(cmd) {
//     if( !cmd.op1.is_character() ) {
//       return ui.add_event(`There is no point in attacking ${cmd.op1}.`)
//     }
    
//     // ui.add_event(`${cmd.who} strikes ${cmd.op1} and hits for ${damage} points of damage`)
//     ui.add_event(`${cmd.who} strikes ${cmd.op1}.`)
//     let damage = cmd.op1.take_damage({value: 2})
//     cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
//   },
//   on_fail: function(cmd) {
//     cmd.op1.add_status({name: 'threat', timer: false}, {stack_magnitude: true})
//     ui.add_event(`${cmd.who} swings at ${cmd.op1} but misses.`)
//   },
// })

new Verb({
  name: 'recover',         // prep: 'at',
  icon: '💤',
  text: `Recover lost body and spirit points and remove all threat from yourself. Does not heal your wounds.`,
  type: 'combat',
  test: false,
  sortkey: 99,
  on_success: function(cmd) {
    // todo: should not be immediate
    ui.text( cmd.who, ` takes a breather...` )
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
        ui.text(cmd.who, ` picks up `, cmd.op1)
      }
      else
        ui.text(cmd.who, ` cannot pick up `, cmd.op1, ` as it is not on the ground.`)
    } 
    else
      ui.text(cmd.who, ` cannot pick up `, cmd.op1)
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
    ui.text(cmd.who, ` drops `, cmd.op1)
  },
  sortkey: 2,
})

new Verb({
  name: 'equip',  // as weapon or into one of the item slots
  icon: '🧤', // 🧤🧢
  text: `Wield the given item as a weapon or equip it as armour.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.who.has( cmd.op1) )
      return ui.text(cmd.who, ` does not have `, cmd.op1)
    
    let where = cmd.where || 'weapon'
    cmd.who.equip( cmd.op1, where )
  },
  sortkey: 3,
})

new Verb({
  name: 'unequip',  // from any item slot
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.who.has( cmd.op1) )
      return ui.text(cmd.who, ` does not have `, cmd.op1)
    if( cmd.op1.get('position') == false )
      return ui.text(cmd.who, ` does not have `, cmd.op1, ` equipped.`)
    
    cmd.op1.position = false
    ui.text(cmd.who, ` unequips `, cmd.op1)
  },
  sortkey: 4,
})

new Verb({
  name: 'swap',  // as weapon
  icon: '🔁',
  text: `Swap the given equipped weapon with the weapon in your hand.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.who.has( cmd.op1) )
      return ui.text(cmd.who, ` does not have `, cmd.op1, `.`)
    if( !cmd.op1.get('position') )
      return ui.text(cmd.who, ` does not have `, cmd.op1, `equipped.`)
    if( !cmd.op1.is('weapon') )
      return ui.text(cmd.op1, ` is not a weapon.`)
    
    let original_weapon = cmd.who.get_weapon()
    let original_location = cmd.op1.get('position')

    cmd.who.equip( cmd.op1, 'weapon' )
    if( original_weapon )
      cmd.who.equip( original_weapon, original_location )

    cmd.quick = true
  },
  sortkey: 4,
})

new Verb({
  name: 'control',
  icon: '🕹️',
  text: `Control another creature.`,
  type: 'control',
  test: false,
  op1: true,
  on_success: function(cmd) {
    cmd.who.controlling = cmd.op1.id
    cmd.op1.add_status({name: 'controlled'})
    cmd.op1.add_status({name: 'stunned'})
    ui.text(cmd.who, `takes control of`, cmd.op1, `.`)
  },
  sortkey: 6,
})


// new Verb({
//   name: 'use',
//   icon: '🔧',
//   text: `Try to find a way to use an item. Try pushing or pulling it, turning it on. If it can be opened, then try opening it. If not, then try closing it. If it can be eaten, you will eat it.`,
//   type: 'action',
//   test: false,
//   op1: true,    separator: 'and',
//   op2: true,
//   on_success: function(cmd) {    
//     ui.add_event(`This does not seem to work.`)
//   },
//   sortkey: 2,
// })

new Verb({
  name: 'consume',
  icon: '🍔',
  text: `Consume the given item.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.op1.is('consumable') ) {
      ui.text(cmd.op1, ` cannot be consumed.`)
    } else {
      ui.text(cmd.who, ` consumes `, cmd.op1)
      cmd.op1.consumed_by(cmd.who)
      cmd.op1.destroy()
    }
  },
  sortkey: 6,
})

// !!! not used at the moment
new Verb({
  name: 'process',
  // icon: '🧪',
  text: `Use a given item, destroying it in the process.`,
  type: 'inventory',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( 'process' in cmd.op1 ) {
      cmd.op1.process(cmd)      
      cmd.op1.destroy()
    } else {
      throw `process called for ${cmd.op1} but it has no process() function`
    }
  },
  sortkey: 6,
})


new Verb({
  name: 'open',
  // icon: '🍔',
  text: `Open something closed.`,
  type: 'door',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.op1.is('closed') ) {
      ui.text( cmd.op1, ` is not closed.` )
    } else {
      if( cmd.op1.is('locked') ) {
        ui.text(cmd.op1, ` is locked.`)
      } else {
        cmd.op1.remove_tag('closed')
        cmd.op1.set_tag('open')
        ui.text( cmd.who, ` opens `, cmd.op1 ) 
      }    
    }
  },
  sortkey: 6,
})

new Verb({
  name: 'force',
  // icon: '🍔',
  text: `Open something locked open.`,
  type: 'door',
  test: false,
  op1: true,
  req: {items: /crowbar/},
  on_success: function(cmd) {
    if( cmd.op1.is('locked') ) {
      if( cmd.who.test('tough', 
          cmd.op1.performance('tough')   ) ) {
        cmd.op1.remove_tag('locked')
        cmd.op1.remove_tag('closed')
        cmd.op1.set_tag('open')
        ui.text(cmd.who, ` has ripped `, cmd.op1, ` open!`)
      } else {
        ui.text(cmd.who, ` failed to force `, cmd.op1, ` open.`)
      }
    } else {      
      ui.text( cmd.op1, ` is not locked.`)
    }
  },
  sortkey: 9,
})

new Verb({
  name: 'pick lock',
  // icon: '🍔',
  text: `Pick the lock on something locked.`,
  type: 'door',
  test: false,
  op1: true,
  req: {items: /lockpick/},
  on_success: function(cmd) {
    if( cmd.op1.is('locked') ) {
      if( cmd.who.test('lockpicking', 
          cmd.op1.performance('cool')   ) ) {
        cmd.op1.remove_tag('locked')
        ui.text(cmd.who, ` has picked the lock on `, cmd.op1)
      } else {
        ui.text(cmd.who, ` failed to pick the lock on `, cmd.op1)
      }
    } else {      
      ui.text( cmd.op1, ` is not locked.`)
    }
  },
  sortkey: 10,
})

new Verb({
  name: 'close',
  // icon: '🍔',
  text: `Close something open.`,
  type: 'door',
  test: false,
  op1: true,
  on_success: function(cmd) {
    if( !cmd.op1.is('open') ) {
      ui.text( cmd.op1, ` is not open.` )
    } else {
      cmd.op1.remove_tag('open')
      cmd.op1.set_tag('closed')
      ui.text( cmd.who, ` closes `, cmd.op1 ) 
    }
  },
  sortkey: 6,
})

new Verb({
  name: 'unlock',
  // icon: '🍔',
  text: `Unlock something locked with a key.`,
  type: 'door',
  test: false,
  op1: true,
  op2: true,
  on_success: function(cmd) {
    let door = cmd.op1
    let key = cmd.op2
    
    if( door.is('open') ) {
      ui.text( door, ` is open.`)
      return false
    }
    if( !door.is('locked') ) {
      ui.text( door, ` is not locked.`)
      return false
    }
    if( !key.is('key') ) {
      ui.text( key, ` will not work here.`)
      return false
    }

    if( door.lock_works_with(key) ) {
      door.remove_tag('locked')
      ui.text(cmd.who, ` unlocks `, door, ` with `, key)
      return true
    } else {
      ui.text( key, ` is not the right key for `, door )
    }
  },
  sortkey: 7,
})

new Verb({
  name: 'lock',
  // icon: '🍔',
  text: `Lock something locked with a key.`,
  type: 'door',
  test: false,
  op1: true,
  op2: true,
  on_success: function(cmd) {
    let door = cmd.op1
    let key = cmd.op2
    
    if( door.is('open') ) {
      ui.text( door, ` is open.`)
      return false
    }
    if( door.is('locked') ) {
      ui.text( door, ` is already locked.`)
      return false
    }
    if( !key.is('key') ) {
      ui.text( key, ` will not work here.`)
      return false
    }

    if( door.lock_works_with(key) ) {
      door.set_tag('locked')
      ui.text(cmd.who, ` locks `, door, ` with `, key)
      return true
    } else {
      ui.text( key, ` is not the right key for `, door )
    }
  },
  sortkey: 7,
})

// new Verb({
//   name: 'give',
//   icon: '🎁',
//   text: `Give and item to someone.`,
//   type: 'action',
//   test: false,
//   op1: true,    separator: 'to',
//   op2: true,
//   on_success: function(cmd) {
//     if(cmd.op1.get_location()!=cmd.who) {
//       ui.add_event(`${cmd.who} does not have ${cmd.op1}.`)
//       return true
//     }
//     if(!cmd.op1.is_takeable()) {
//       ui.add_event(`${cmd.who} cannot give away ${cmd.op1}.`)
//       return true
//     }
//     if(!cmd.op2.is_character()) {
//       ui.add_event(`${cmd.who} cannot give away ${cmd.op1} to ${cmd.op2}.`)
//       return true
//     }
//     ui.add_event(`${cmd.who} gives ${cmd.op1} to ${cmd.op2}.`)
//     cmd.op1.move_to(cmd.op2)
//   },
//   sortkey: 4,
// })




//
// SPECIAL ACTIONS
// 
new Verb({
  name: 'pickpocket',
  icon: '👜',
  type: 'action',
  test: 'pickpocket',
  op1: true,
  reqs: {cool: rules.difficulty('MEDIUM')},
  
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
  reqs: {cool: rules.difficulty('medium')},
  on_success: function(cmd) {
    ui.text( cmd.who, `starts sneaking.` )
    cmd.who.add_status({name: "sneaking", timer: false})
  },
  sortkey: 6,
})

new Verb({
  name: 'stop sneak',
  icon: '🥷',
  text: `Leave sneak mode.`,
  type: 'action',
  test: false,
  reqs: {},
  on_success: function(cmd) {
    cmd.who.stop_sneaking()
  },
  sortkey: 6,
})


// this is not a real verb; it calls a custom function instead
new Verb({
  name: 'custom',
  // icon: '🥷',
  text: `custom verb.`,
  type: 'action',
  test: false,
  // fn: ()=>"custom action",
  on_success: function(cmd) {
    let r = cmd.fn(cmd)   // execute a custom function
    if( r && typeof r == 'string')
      ui.add_event(r)
  },
  sortkey: 0,
})
