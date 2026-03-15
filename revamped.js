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

  // the mansion, as a prop on other locations
  let mansion = new Entity({
    name: "mansion",
    icon: 'mansion_front.png',
    // description: `<p></p>`,
    description: 
    `<p>A dilapidated mansion in standing on the forest clearing.</p>
    `,
  })

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
  `<p>You are standing in front of the dilapidated ${ui.print_entity(mansion)}.</p>
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

let mansion_roof = new Entity({
  name: "On the Roof of the Mansion",
  icon: 'mansion_roof.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You have climbed up to the roof of the mansion.</p>
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

  new Path({
    from: mansion_left, 
    to: mansion_roof, 
    text: `climb up to the roof`,
  }, {
    text: `climb down to the ground`,  
  })

  
// inside

let main_hall = new Entity({
  name: "Main Hall",
  icon: 'mansion_interior.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing in the main hall of the mansion.</p>
  `,
})

let dining_room = new Entity({
  name: "Dining Room",
  icon: 'mansion_dining_room.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are in the dining room of the mansion.</p>
  `,
})

let kitchen = new Entity({
  name: "Kitchen",
  icon: 'mansion_kitchen.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are in the mansion's kitchen.</p>
  `,
})

let pantry = new Entity({
  name: "Pantry",
  icon: 'mansion_pantry.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are in the mansion's pantry.</p>
  `,
})

let cellar = new Entity({
  name: "Winecellar",
  icon: 'mansion_cellar.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are in the winecellar under the mansion.</p>
  `,
})

  // prop
  let coffin = new Entity({
    name: "Coffin",
    icon: 'mansion_coffin.png',
    // description: `<p></p>`,
    interior_description: 
    `<p>A coffin...?</p>
    `,
  })
  
let coffin_room = new Entity({
  name: "Simple Room",
  icon: 'mansion_coffin.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>A small room with nothing but a ${ui.print_entity(coffin)} inside.</p>
  `,
})

let study = new Entity({
  name: "Study in Ruins",
  icon: 'mansion_study.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>This room could have been the study of the master.</p>
  `,
})

let gallery = new Entity({
  name: "On the Gallery, above the Main Hall",
  icon: 'mansion_interior.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing on the gallery, above the main hall.</p>
  `,
})

let master_bedroom = new Entity({
  name: "Master Bedroom",
  icon: 'mansion_master_bedroom.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Master Bedroom.</p>
  `,
})

let ladies_bedroom = new Entity({
  name: "Bedroom",
  icon: 'mansion_ladies_bedroom.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>This bedroom could have belonged to a young lady.</p>
  `,
})



  new Path({
    from: mansion_front, 
    to: main_hall, 
    text: `enter the mansion!`,
  }, {
    text: `leave the mansion via the main door`,  
  })

  new Path({
    from: main_hall, 
    to: dining_room, 
    text: `go into the dining room`,
  }, {
    text: `go back to the main hall`,  
  })
  
  new Path({
    from: dining_room, 
    to: kitchen, 
    text: `go into the kitchen`,
  }, {
    text: `go back to the dining room`,  
  })
  
  new Path({
    from: kitchen, 
    to: pantry, 
    text: `go into the pantry`,
  }, {
    text: `return to the kitchen`,  
  })
  
  new Path({
    from: main_hall, 
    to: cellar, 
    text: `go downstairs into the cellar`,
  }, {
    text: `walk up the stairs to go back to the main hall`,  
  })

  new Path({
    from: cellar, 
    to: coffin_room, 
    text: `explore a secret passage behind the barrels`,
  }, {
    text: `go back through the winecellar via the not-so-secret passage`,  
  })
  
  new Path({
    from: mansion_roof, 
    to: master_bedroom, 
    text: `climb down into a room`,
  }, // { text: `climb up to the mansion's roof`, }
  )

  new Path({
    from: main_hall, 
    to: gallery, 
    text: `walk up the stairs, to the gallery`,
  }, { text: `go downstairs, to the mansion's entrance`, })

  new Path({
    from: gallery, 
    to: master_bedroom, 
    text: `enter the larger bedroom`,
  }, { text: `leave to the gallery`, })

  new Path({
    from: gallery, 
    to: ladies_bedroom, 
    text: `enter the smaller bedroom`,
  }, { text: `leave to the gallery`, })
  
  new Path({
    from: main_hall, 
    to: study, 
    text: `enter the study`,
  }, { text: `go back to the the mansion's entrance`, })

  
  
  
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
Entity.spawn( 'ghoul', mansion_back )
Entity.spawn( 'ghoul', mansion_back )

Entity.spawn( 'knife', kitchen )
Entity.spawn( 'magnifying glass', study )
Entity.spawn( "doctor's bag", master_bedroom )

new Entity({
    tags: ['item'],
    name: "horribly mutilated teddy bear",
    description: `This teddy bear has parts missing, and its fillings it is all over the place. Poor thing must have gone through terrible times. You cannot bear such a horrible sight!`,
    Location: ladies_bedroom,
})

new Entity({
    tags: ['item'],
    name: "headless unicorn",
    description: `Sure, the head is missing, but it was definitely a unicorn.`,
    Location: ladies_bedroom,
})

new Entity({
    tags: ['item'],
    name: "broken doll",
    description: `Someone has committed horrible things to this doll.`,
    Location: ladies_bedroom,
})



let vampire_eyes = new Entity({
    name: "red eyes",
    description: `You feel lost in the mesmerizing <font style="color: red;">red eyes</font> of the vampire.`,
})

let vampire = new Entity({
    name: "vampire",
    tags: ['undead', 'character', 'boss'],
    icon: 'vampire4.png',
    description: `A creature of darkness with ${ui.print_entity(vampire_eyes)}; this beast returned from the grave to drain your blood.`,
    tough:  10,
    cool:   10,
    sharp:  6,
    charm:  8,
    traits: {},
    location: coffin_room,
    // location: player_ship,
})

let the_staff = new Entity({
    name: "the staff",
    tags: ['undead', 'construct', 'character'],
    icon: 'the_staff.png',
    description: `A assembled from different bodyparts of the mansion's staff.`,
    tough:  10,
    cool:   3,
    sharp:  3,
    charm:  -2,
    traits: {},
    location: main_hall,
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
