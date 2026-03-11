// name the game
game.set_title("Secrets of the Mansion - Revamped")

// you may want to disable verbs you do not need
// game.enable_verbs_only(['melee', 'pick up', 'drop', 'use', 'consume', 'look'])

// define the start location
let gloomy_forest = new Entity({
  name: "Gloomy Forest",
  icon: 'forest.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Who know how long you have been wandering in this dark, gloomy forest?
  Was it hours or days? You have lost track of time for a while, 
  you are so hungry you kill for a burger or a glass of beer, 
  and you <i>really</i> need to sleep soon.</p>
  <p>Your compass is broken, it has been spinning around and around without stopping,
  you there is absolutely nothing you can read from it. No map, no compass, You
  have not got the faintest idea of where you are or how you got here.</p>
  <p>You know one thing: you need to get out of here. Quickly.</p>
  `,
})
game.set_start_location(gloomy_forest)

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
game.select_player(player)

//
// LOCATIONS AND PATHS
// 

let clearing_edge = new Entity({
  name: "Edge of the clearing",
  icon: 'forest_mansion_in_distance.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You see a clearing in the forest with a dilapidated mansion.</p>
  <p>There is absolutely no point in going back into the forest. You would just die there.
  `,
})

let mansion_front = new Entity({
  name: "In front of the Mansion",
  icon: 'mansion_front.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing in front of the dilapidated mansion.</p>
  `,
})

let mansion_back = new Entity({
  name: "Behind the Mansion",
  icon: 'mansion_back.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing behind the dilapidated mansion.</p>
  `,
})

let mansion_left = new Entity({
  name: "Left of the Mansion",
  icon: 'mansion_left.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing on the left side of the dilapidated mansion.</p>
  `,
})

let mansion_right = new Entity({
  name: "Right side of the Mansion",
  icon: 'mansion_right.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing on the right side of the dilapidated mansion.</p>
  `,
})

let well = new Entity({
  name: "At the Well",
  icon: 'well.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing at the well.</p>
  `,
})

let bushes = new Entity({
  name: "In the Bushes",
  icon: 'forest.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Behind the bushes lies a dead body.</p>
  `,
})

  new Path({
    from: gloomy_forest, 
    to: clearing_edge, 
    text: `continue in the forest, you find something`,
  }, // {  text: `back into the forest`,  }
  )

  new Path({
    from: clearing_edge, 
    to: mansion_front, 
    text: `walk up to the mansion`,
  }, {
    text: `walk away from the mansion`,  
  })
  
  new Path({
    from: mansion_front, 
    to: mansion_left, 
    text: `start going around the mansion to the left`,
  }, {
    text: `go back to the front of the mansion`,  
  })

  new Path({
    from: mansion_front, 
    to: mansion_right, 
    text: `start going around the mansion to the right`,
  }, {
    text: `go back to the front of the mansion`,  
  })

  new Path({
    from: mansion_left, 
    to: mansion_back, 
    text: `explore what is behind the mansion`,
  }, {
    text: `go back to the left side of the mansion`,  
  })

  new Path({
    from: mansion_right, 
    to: mansion_back, 
    text: `go behind the mansion`,
  }, {
    text: `go to the right side of the mansion`,  
  })

  new Path({
    from: mansion_left, 
    to: well, 
    text: `walk to the well`,
  }, {
    text: `back to the mansion`,  
  })

  new Path({
    from: clearing_edge, 
    to: bushes, 
    text: `follow the trail into the bushes`,
  }, {
    text: `back to the clearing`,
  })




//
// TEMPLATES
// 
let ghoul_template = new Entity({
    name: "ghoul",
    tags: ['returned', 'character'],
    epithets: Entity.enemy_epithets,
    icon: 'ghoul.png',
    description: `A stinking undead creature.`,
    tough:  2,
    cool:   -1,
    sharp:  -1,
    charm:  -1,
    traits: {
    }
}, {template: 'ghoul'} )

new Entity({
    name: "lockpick",
    tags: ['tool', 'lockpick', 'item'],
    description: `Handy for opening locks.`,
}, {template: 'lockpick'} )

new Entity({
    name: "red stapler",
    tags: ['tool', 'item'],
    icon: 'red_stapler.png',
    description: `It is <font style="color: red;">red</font>.`,
}, {template: 'red stapler'} )

new Entity({
    name: "doctor's bag",
    tags: ['tool', 'item'],
    description: `Belongs to a doctor.`,
}, {template: "doctor's bag"} )

new Entity({
    name: "magnifying glass",
    tags: ['tool', 'item'],
    icon: 'magnifying_glass.png',
    description: `Makes things bigger.`,
}, {template: "magnifying glass"} )

new Entity({
    name: "axe",
    tags: ['melee', 'weapon', 'tool', 'item'],
    icon: 'axe.png',
    description: `Chop-chop.`,
}, {template: 'axe'} )

new Entity({
    name: "knife",
    tags: ['melee', 'weapon', 'tool', 'item'],
    // icon: 'axe.png',
    description: `A sharp knife.`,
}, {template: 'knife'} )

//
// ENTITIES
// 
// 

Entity.spawn( 'ghoul', mansion_front )

Entity.spawn( 'ghoul', mansion_back )
Entity.spawn( 'ghoul', mansion_back )


let vampire_eyes = new Entity({
    name: "red eyes",
    description: `You feel lost in the mesmerizing <font style="color: red;">red eyes</font> of the vampire.`,
})

let vampire = new Entity({
    name: "vampire",
    tags: ['undead', 'character'],
    icon: 'unknown_raincoat2.png',
    // icon: 'unknown_trenchcoat.png',
    description: `A creature of darkness with ${ui.print_entity(vampire_eyes)}; this beast returned from the grave to drain your blood.`,
    tough:  10,
    cool:   10,
    sharp:  6,
    charm:  8,
    traits: {},
    location: mansion_back,
    // location: player_ship,
})

let dead_woodsman = new Entity({
    name: "dead woodsman",
    tags: ['prop', 'remains', 'container', 'open'],
    description: `The dead and partially eaten body of a woodsman.`,
    location: bushes,
})

let woodsmans_axe = Entity.spawn( 'axe', bushes )
let woodsmans_knife = Entity.spawn( 'knife', dead_woodsman )




//
// TRIGGERS
//
