console.log("start:the orc and the pie")

game.enable_verbs_only(['melee', 'pick up', 'drop', 'use', 'consume', 'look'])


let room = new Entity({
  name: "somewhere",
  icon: 'gray_background.png',
  description: "You are in a room in some dungeon in some fantasy world. Actually, it is not really important where you are, just play the game.<br/>There is no exit; don't even try to go anywhere.",
})

let pie = new Entity({
    name: "pie",
    icon: 'pie.jpg',
    tags: ['consumable', 'food', 'item'],
    description: `A delicious pie.`,
}).move_to(room)

let orc = new Entity({
    name: "orc",
    tags: ['character', 'orc'],
    description: `A bloodthirsty orc. It is thirsty for blood, but it is not hungry. Still, it has a pie. A yummy-yummy pie. This is an orc so it does not want to share.`,
    // epithet: "",
    icon: 'orc1.jpeg',
    tough:  1,
    cool:   1,
    sharp:  1,
    charm:  1,
    max_body: 1,
    traits: {},
    location: room,
})

let player = new Entity({
    name: "Player",
    tags: ['player', 'character'],
    icon: 'unknown_trenchcoat.png',
    description: `You are the player of this small game. It does not really matter who you are, what matters is that you are hungry. You want to eat a pie...`,
    tough:  10,
    cool:   10,
    sharp:  10,
    charm:  10,
    traits: {},
    location: room
})

game.select_player(player)
