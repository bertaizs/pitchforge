// name the game
game.set_title("First Strike")

// you may want to disable verbs you do not need
// game.enable_verbs_only(['melee', 'pick up', 'drop', 'use', 'consume', 'examine'])

// define the start location
let player_ship = new Entity({
  name: "The Black Sheep",
  tags: ['start', 'location'],
  icon: 'gray_background.png',
  description: `<p></p>`,
  interior_description: `<p>int</p>`,
})
// game.set_start_location(player_ship)

// define the player entity
// - if you want to start with character creation, set location to game.chargen
// - if you have pre-created characters, just set the location to the start location
let player = new Entity({
    name: "Player",
    tags: ['player', 'character'],
    level: 1,
    icon: 'unknown_trenchcoat.png',
    // icon: 'unknown_trenchcoat.png',
    description: `You are the player of this small game.`,
    tough:  0,
    cool:   0,
    sharp:  0,
    charm:  0,
    traits: {},
    location: game.chargen,
    // location: player_ship,
})

// mark the character to be the player
// game.select_player(player)
