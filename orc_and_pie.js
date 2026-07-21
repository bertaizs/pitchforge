game.set_title("The orc and the pie (a very simple but classic adventure)")


game.enable_verbs_only(['attack', 'pick up', 'drop', 'use', 'consume', 'examine'])

let room = new Entity({
  name: "in the middle of somewhere",
  tags: ['start', 'location'],
  icon: 'gray_background.png',
  description: `You are in some fantasy world. It is not really important where you are, you can be in a dungeon, in a room, a top of a mountain or wherever you want. Just play the game.
  
  <br/>There is no exit; don't even try to go anywhere.
  
  <p>Hint: You are supposed to kill the orc to eat the pie.</p>`,
})

let pie = new Entity({
    name: "pie",
    icon: 'pie.png',
    tags: ['consumable', 'food', 'item'],
    description: `A delicious pie.`,
}).move_to(room)

let orc = new Entity({
    name: "orc",
    tags: ['character', 'orc'],
    level: 1,
    description: `A bloodthirsty orc. It is thirsty for blood, but it is not hungry. Still, it has a pie. A yummy-yummy pie. This is an orc so it does not want to share.`,
    // epithet: "",
    icon: 'orc1.jpg',
    tough:  1,
    cool:   1,
    sharp:  1,
    charm:  1,
    max_body: 1,
    max_spirit: 1,
    traits: {},
    location: room,
})

let player = new Entity({
    name: "Player",
    tags: ['player', 'character'],
    level: 1,
    icon: 'hero.png',
    // icon: 'unknown_trenchcoat.png',
    description: `You are the player of this small game. It does not really matter who you are, what matters is that you are hungry. You want to eat a pie...`,
    tough:  10,
    cool:   10,
    sharp:  10,
    charm:  10,
    traits: {},
    location: room
})

game.add_trigger(
  {who: player, verb: /consume/, op1: orc},
  function(cmd) {
    ui.add_event(`No, it is not the orc you are supposed to eat. (Try eating the pie instead.)`)
    return true
  }
)

game.add_trigger(
  {who: player, verb: /use/, op1: orc},
  function(cmd) {
    ui.add_event(`How exactly are you planning to use the orc?`)
    return true
  }
)

game.add_trigger(
  {who: player, verb: /pick up|examine/, op1: pie},
  function(cmd) {
    if( orc.is_up() ) {
      ui.add_event(`The orc does not let you close to the pie!`)
      return true
    }
    return false
  } 
)

game.add_trigger(
  {who: player, verb: /(use|consume)/, op1: pie},
  function(cmd) {
    if( orc.is_up() ) {
      ui.add_event(`The orc does not let you eat the pie. You need to get rid of the orc first!`)
      return true
    }
    else {
      cmd.op1.move_to(game.universe)
      let text = `Congratulations, you have eaten the pie and completed this game! 😁`
      ui.add_event(text)
      room.interior_description = text
      return true
    }      
  }
)


let backroom = new Entity({
  name: "another place",
  tags: ['location'],
  icon: 'cottage_inside.png',
  description: `You are in some fantasy world. It is not really important where you are, you can be in a dungeon, in a room, a top of a mountain or wherever you want. Just play the game.
  
  <br/>There is no exit; don't even try to go anywhere.
  
  <p>Hint: You are supposed to kill the orc to eat the pie.</p>`,
})


new Path({
  from: room, 
  to: backroom, 
  text: `a door leads to a backroom`,
},  {  text: `return to the main room`,  }
)
