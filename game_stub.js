// this file is a stub, it contains just minimal content for the engine to function


// name the game
game.set_title("Sample Game")

// you may want to disable verbs you do not need
// game.enable_verbs_only(['melee', 'pick up', 'drop', 'use', 'consume', 'examine'])

// define the start location
let start_location = new Entity({
  name: "Starting location",
  tags: ['start', 'location'],
  icon: 'gray_background.png',
  description: `<p></p>`,
  interior_description: `<p>this is your starting location</p>`,
})

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
    tough:  2,
    cool:   2,
    sharp:  1,
    charm:  2,
    traits: {},
    
    // location: game.chargen,    // starts character generator (abstract location)
    location: start_location,        // no character generator, place (a precreated) character at a start location
})



// Optional:
// if there is character creation, then you can define any character backgrounds here
game.character_backgrounds = {
  "tough guy": {
    label: `tough guy`,
    tough:  4,
    cool:   0,
    sharp:  0,
    charm:  0,
    // inventory: ['magnifying glass'],
    // traits: ['perception'],
  },
  "smart one": {
    label: `smart one`,
    tough:  0,
    cool:   1,
    sharp:  3,
    charm:  2,
  },
  "blank page": {
    label: `blank page`,
    tough:  0,
    cool:   0,
    sharp:  0,
    charm:  0,
    cp: 10,
  },  
}
