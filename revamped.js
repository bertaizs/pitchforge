// name the game
game.set_title("Secrets of the Mansion - Revamped")

// you may want to disable verbs you do not need
// game.enable_verbs_only(['melee', 'pick up', 'drop', 'use', 'consume', 'look'])

// define the start location
let gloomy_forest = new Entity({
  name: "Gloomy Forest",
  tags: ['start', 'location'],
  icon: 'forest.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Who knows how long you have been wandering in this dark, gloomy forest?
  Was it hours or days? You have lost track of time for a while, 
  you are so hungry you kill for a burger or a glass of beer, 
  and you <i>really</i> need to sleep soon.</p>
  <p>Your compass is broken, it has been spinning around and around without stopping,
  you there is absolutely nothing you can read from it. No map, no compass, You
  have not got the faintest idea of where you are or how you got here.</p>
  <p>You know one thing: you need to get out of here. Quickly.</p>
  `,
})

// define the player entity
// - if you want to start with character creation, set location to game.chargen
// - if you have pre-created characters, just set the location to the start location
let player = new Entity({
    name: "Player",
    tags: ['player', 'character'],
    level: 1,
    icon: 'unknown_trenchcoat.png',
    description: `You are the player of this little game.`,
    tough:  0,
    cool:   0,
    sharp:  0,
    charm:  0,
    traits: {},
    location: game.chargen,
    // location: player_ship,
})

// mark the character to be the player; not needed if the char has the tag 'player'
// game.select_player(player)

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
  
  // trees, props
  let trees = new Entity({
    name: "trees",
    icon: 'forest.png',
    // description: `<p></p>`,
    description: 
    `<p>Sure, the forest contains many trees. They are old, dying, but there is absolutely nothing special about them.</p>
    `,
  })
  

let clearing_edge = new Entity({
  name: "Edge of the clearing",
  icon: 'forest_mansion_in_distance.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You see a clearing in the forest. A dilapidated mansion stands in the middle of the clearing. Its dark windows eye you suspiciously. 
  There is a stench of death and decay in the air, even the ${ui.e(trees)} around look dying.
  </p>
  <p>There is absolutely no point in going back into the forest. You would just die there among the trees.
  `,
  location_clues: [
    new Clue({ text: `Tracks on the ground show something has been dragged into the bushes.`, reqs: {perception: Test.BASIC} }),
  ]
})

let small_key = new Entity({
  name: "small key",
  tags: ['item', 'key',],
  description: `<p>What lock will this key will open?</p>`,
  clues: [
    new Clue({ text: `The key does not look complicated, it probably opens some lock inside the mansion. Its simple design suggests it is less likely to open a bedroom door, rather a pantry or a cellar.`, reqs: {sharp: Test.ADVANCED, cool: Test.EASY} }),
  ],
})

let cellar_door = new Entity({
    name: "door to the cellar",
    tags: ['door', 'closed', 'locked'],
    // icon: 'mansion_front.png',
    tough: 2,
    cool: 2,
    key: small_key,
    description: `<p>This door leads down to the cellar below the mansion.</p>`,
  })


  let copper_key = new Entity({
    name: "copper key",
    tags: ['item', 'key',],
    description: `<p>The key is somewhat dirty but it can probably still work.</p>`,
    clues: [
      new Clue({ text: `This key is likely to open the mansion's front door.`, reqs: {sharp: Test.MEDIUM} }),
    ],
  })
  
  let clue_knocking = new Clue({ text: `Knocking could be a way to get in, but may also draw unwanted attention.`, reqs: {sharp: Test.MEDIUM}, flag: '💡' })
  let mansion_front_door_knocker = new Entity({
    name: "knocker",
    // tags: ['door', 'closed', 'locked'],
    description: `<p>The knocker on the door forms the head of a bear, holding the ring you can knock with. You can <i>use</i> the knocker to knock, you know...</p>`,
    clues: [
      clue_knocking,
    ],
  })
  let mansion_front_door = new Entity({
    name: "front door",
    tags: ['door', 'closed', 'locked'],
    // icon: 'mansion_front.png',
    tough: Test.ADVANCED,
    cool: Test.MEDIUM,
    key: copper_key,
    description: `<p>A heavy wooden double door stands in the mansion's main entrance. There is a ${ui.e(mansion_front_door_knocker, "knocker")} on the door. You may want to consider knocking..</p>`,
    clues: [
      new Clue({ text: `Considering the overall state of the mansion, this door looks surprisingly sturdy.`, reqs: {perception: Test.EASY} }),
      clue_knocking,
      new Clue({ text: ()=>{
                              if( copper_key.get_location()==game.universe ) {
                                copper_key.move_to(mansion_front)
                                return `You find a ${ui.e(copper_key)} under the door mat.`
                              } else return ''
                            }, flag: true, reqs: {perception: Test.ADVANCED} }),
    ],
  })
  
let mansion_front = new Entity({
  name: "In front of the Mansion",
  icon: 'mansion_front.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing in front of the dilapidated ${ui.e(mansion)}.
  It has clearly seen better days; you can see holes in the roof. 
  Some walls are made of wood, some others are made of stone but both are severely damaged.
  The forest is still near, its crooked ${ui.e(trees)} make you feel uncomfortable.
  So does the mansion.
  </p>
  `,
  location_clues: [
    new Clue({text: ()=>`The ${ui.e(mansion_front_door, "front door")} leading into the mansion is ${mansion_front_door.is('open') ? "wide open" : "closed"}.`, reqs: {} }),
    new Clue({text: `There is a ${ui.e(mansion_front_door_knocker,"knocker")} on the door.`, reqs: {'perception': Test.EASY}}),
    new Clue({text: `Did this place belong to some very rich person? Was the home of a family? The mansion could support a couple of people and their servants.`, reqs: {'sharp': Test.EASY}}),
    new Clue({text: `Something is very-very wrong with this place.`, reqs: {'sixth sense': Test.EASY}}),
  ],
})

let mansion_back = new Entity({
  name: "Behind the Mansion",
  icon: 'mansion_back2.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing behind the dilapidated ${ui.print_entity(mansion)}.</p>
  `,
})



let mansion_left = new Entity({
  name: "On the left side of the Mansion",
  icon: 'mansion_left.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing on the left side of the dilapidated ${ui.print_entity(mansion)}.
  The ${ui.print_entity(trees)} circle the mansion as if the haunted forest was trying to consume it.
  </p>
  <p>The mansion has stone walls are in better condition here, you can see nothing but darkness through the windows.
  Its ground floor is slightly above your level, while there is a first floor built on it.
  The mansion's roof is in very bad shape, there are many tiles missing, there are some broken tiles here on the ground.
  </p>
  <p>From here you can see where you arrived at the clearing. You can also see a wooden building attached to the back of the mansion, but from here you cannot make it out what it could be.
  </p>
  `,
})


let foggy_road = new Entity({
  name: "foggy road",
  icon: 'foggy_road.png',
  description: 
  `<p>A foggy road leads away from the mansion.
  </p>`,
  interior_icon: 'foggy_road2.png',
  interior_description: 
  `<p>You are walking in the fog, but do not even feel getting away from the mansion or arriving anywhere.
  Is this a curse? The fog is dense, and you walk on, but there seems to be no point.
  The shape of the mansion is still looms behind you in the fog.</p>
  `,
})

let mansion_right = new Entity({
  name: "On the right side of the Mansion",
  icon: 'mansion_right.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing on the right side of the dilapidated ${ui.print_entity(mansion)}.
  There are huge cracks in the stone walls here, but the walls stand firm. 
  The ground floor is slightly above your level, while there the first floor is much higher above.
  You can see the path where you arrived to the clearing, and there are some wooden building attached to the back of the mansion. A garage, perhaps?</p>
  <p> There are ${ui.e(trees)}, trees and trees everywhere, 
  but there is a ${ui.e(foggy_road)} leading away from the mansion.</p>
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
  name: "the well",
  interior_icon: 'well_bottom.png',
  interior_description: 
  `<p>Well, you have hit the bottom...</p>
  <p>Absolutely no sign of any water here, just darkness, wet stones and moss. 
  Roots have breached the side of the well at certain points, and there are some plants growing from the ground too.</p>
  <p>When you look up, you see the beak, dark gray sky and top of the dying trees.</p>
  `,
  icon: 'well.png',
  // description: `<p></p>`,
  description: `<p>A sad, lone well, at the forest edge. 
  There is no sign of water inside. When you look down, pure darkness looks back at you.
  </p>`,
})

let well_area = new Entity({
  name: "At the Well",
  icon: 'well.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>A lone ${ui.e(well, "well")} is standing by the mansion, near the forest edge. Its roof has collapsed, and fits right into this dying place.</p>
  <p>The ${ui.e(mansion)} towers above you, while the ${ui.e(trees)} look just as dead as everything else.</p>
  `,
})
  .add(well)

// let well_bottom = new Entity({
//   name: "Bottom of the Well",
//   icon: 'well.png',
//   // description: `<p></p>`,
//   interior_description: 
//   `<p>Well, you are at the bottom...</p>
//   `,
// })

  let dead_woodsman = new Entity({
      name: "dead woodsman",
      tags: ['prop', 'remains', 'container', 'open'],
      description: `The dead and partially eaten body of a woodsman. A middle-aged male with a beard. Whatever killed him must have had large teeth and claws, and it has torn the lower part of his body into pieces.`,
      // location: bushes,
  })

let bushes = new Entity({
  name: "In the Bushes",
  icon: 'forest.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Behind the bushes lies a ${ui.e(dead_woodsman, "dead body")}. There is a lot of blood all over the place, with internal organs spilled out.</p>
  `,
})
  .add(dead_woodsman)
// dead_woodsman.move_to(bushes)

  let car_keys = new Entity({
    name: "car keys",
    tags: ['item', 'key'],
    description: `These keys belong to a car.`,
    // location: study,
  })

  let car = new Entity({
    name: "old car",
    tags: ['prop'],
    icon: 'garage_interior.png',
    // description: `<p></p>`,
    description: function() {
      if( !this.is('running') ) {
        return  `<p>This old car has seen better times, let's hope it is still functional. The car's door is open.</p>`
      } else {
        return  `<p>The engine of the car is running. All you need to do is <i>use</i> the car and you can get out of here!</p>`
      }
    },
    clues: [
      new Clue({text: `This car is a possible way to get away from this awful place!`, reqs: {sharp: Test.EASY}, flag: true})
    ]
  })

  game.add_trigger(
    {verb: /use/, op1: car, op2: car_keys },
    function(cmd) {
      ui.text(`You start the engine. The car is old, but it is working!`)
      ui.text(`Now all you need to do is <i>use</i> the car to get out of here.`)
      car.set_tag('running')
      return true
    })
  
  game.add_trigger(
    {verb: /use/, op1: car, op2: /^$/ },
    function(cmd) {
      if( !car.is('running')) {
        if( cmd.who.test('crafting', Test.ADVANCED) ) {
          ui.text(`You have hotwired the car. Cool! The engine is running.`)
          ui.text(`Now all you need to do is <i>use</i> the car to get out of here.`)        
          car.set_tag('running')
        } else {
          ui.text(`You have no idea how to hotwire the car. You will need to use keys.`)
        }
      } else {
        ui.text(`You hop into the car and drive on. Time to say goodbye to this accursed place!`)
        player.move_to(game.ending)
      }
      return true
    })


let garage = new Entity({
  name: "Garage",
  icon: 'garage_interior.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Inside the garage behind the mansion.</p>
  <p>An ${ui.e(car)} is gathering dust here.</p>
  `,
})

let shed = new Entity({
  name: "Shed",
  icon: 'shed.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Inside the wooden shed behind the mansion.</p>
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
    from: mansion_right,
    to: foggy_road, 
    text: `take the foggy road and start walking away from the mansion`,
  }, {
    text: `give up and go back to the mansion`,  
  })
  
  new Path({
    from: foggy_road,
    to: foggy_road, 
    text: `carry on walking in the fog, hoping to get somewhere`,
    on_move_through: function(cmd) {
      ui.text(`You feel hope slipping away... Is this a curse?`)
      cmd.who.take_damage({value: 1, type: 'spirit'})
    }
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
    to: well_area, 
    text: `walk to the well`,
  }, {
    text: `back to the mansion`,  
  })

  new Path({
    from: well_area, 
    to: well, 
    text: `climb down the stony side of the well`,
    reqs: {climbing: Test.VERYHARD},  
  }, {
    text: `climb up the stones on the well's side`,  
  })
  
  
  new Path({
    from: clearing_edge, 
    to: bushes, 
    text: `follow the trail into the bushes`,
    reqs: {perception: Test.BASIC},
  }, {
    text: `back to the clearing`,
    reqs: {},
  })

  new Path({
    from: mansion_left, 
    to: mansion_roof, 
    text: `climb up to the roof`,
    reqs: {climbing: 3},
  }, {
    text: `climb down to the ground`,
    reqs: {climbing: 3},
  })

  new Path({
    from: mansion_back, 
    to: garage, 
    text: `enter the garage`,
  }, {
    text: `leave through the garage door`,  
  })

  new Path({
    from: mansion_back, 
    to: shed, 
    text: `enter the shed`,
  }, {
    text: `leave the shed`,  
  })


  
// inside

let main_hall = new Entity({
  name: "Main Hall",
  icon: 'mansion_interior.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing in the main hall of the mansion.</p>
  <p>There is a dining room next to the main hall, its door has been torn open, something huge must have come out through it... or maybe it went in.
  There is another smaller room, with a destroyed door, it is probably a study of some sort.
  </p>
  <p>A ${ui.e(mansion_front_door, "double door")} leads to the outside.
  There is a ${ui.e(cellar_door, "small door")} leading to the cellar below the mansion.</p>
  <p>The staircase leading up to the gallery is in rather good shape, one may risk climbing it.</p>
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

  let garlic_braid = new Entity({
      name: "garlic braid",
      tags: ['prop'],
      description: `Braids of garlic hang on the walls.`,
      location: pantry,
      position: `[Braids of garlic] hang on the walls.`
  })
  
  let secret_barrel = new Entity({
    name: "strange barrel",
    description: `You wonder why this huge barrel has been bolted to the far wall of the cellar. When you knock on it, it gives a hollow sound, so it is probably empty. This makes no sense.`,
    clues: [
      new Clue({text: `When you push the lid of the barrel, it opens, and you see there is a secret passage inside it!`, flag: true,
        reqs: {perception: Test.EASY},
        info: new Info({tag: 'secret_passage', text: `There is a secret passage in the cellar, via an empty barrel.`}) })
    ],
  })
  
  let barrels = new Entity({
    name: "barrels",
    description: `There are lots of barrels in this cellar, some big, some small, but none seem interesting.
    However, there is a huge ${ui.e(secret_barrel, "strange barrel")} at the far end of the cellar, which looks very suspicious.`
  })
  
  game.add_trigger(
    {verb: /use/, op1: /crowbar|axe/, op2: barrels},
    function(cmd) {
      ui.text(`It makes no sense in whacking those barrels. It would take time to break them and you would be swimming in wine.`)
      return true
    }
  )

  game.add_trigger(
    {verb: /use/, op1: /crowbar|axe/, op2: secret_barrel},
    function(cmd) {
      ui.text(`You break the empty barrel and reveal a secret passage inside!`)
      barrels.description = `There are many barrels here. One of them is bolted to the wall at the far end of the cellar, it is broken open, and there is a hidden passage inside.`
      cmd.who.gain_info( new Info({tag: 'secret_passage', text: `There is a secret passage in the cellar, via an empty barrel.`}) )
      return true
    }
  )
  
  
let cellar = new Entity({
  name: "winecellar",
  icon: 'mansion_cellar.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are in the winecellar under the mansion. People use winecellars to store their wine, so the cellar has many-many ${ui.e(barrels)} inside.
  The barrels are lined up against the walls, both on the side and at the far end of the cellar.
  You also see bottles of wine all over the cellar.
  This place has clearly been preserved in much better shape than the rest of the mansion.</p>
  `,
  location_clues: [
    new Clue({text: `You notice a secret passage inside one of the barrels!`, reqs: {perception: Test.MEDIUM},}),
  ],
})

  // prop
  let coffin = new Entity({
    name: "Coffin",
    tags: ['closed', 'door', 'container'],
    icon: 'mansion_coffin.png',
    description: `<p>A coffin...?</p>`,
    interior_description: 
    `<p>You are inside a coffin??</p>
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
study.add( car_keys )

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
master_bedroom.add(small_key)

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
    door: mansion_front_door,
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
    door: cellar_door,
    text: `go downstairs into the cellar`,
  }, {
    text: `walk up the stairs to go back to the main hall`,  
  })

  new Path({
    from: cellar, 
    to: coffin_room, 
    text: `explore the secret passage behind the barrels`,
    reqs: [
      {perception: Test.MEDIUM},
      {knowledge: 'secret_passage'},
    ]
  }, {
    text: `go back through the winecellar via the not-so-secret passage`,  
    reqs: [],
  })
  
  new Path({
    from: mansion_roof, 
    to: master_bedroom, 
    text: `climb down the hole in the roof into a room`,
  }, { text: `climb up through the whole to the mansion's roof`, reqs: {climbing: 3}, }
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
    tags: ['undead', 'character'],
    // epithets: Entity.enemy_epithets,
    epithet: Entity.enemy_epithets,
    icon: ['ghoul.png', 'ghoul2.png', 'ghoul3.png', 'ghoul4.png', 'ghoul5.png'],
    description: `A stinking undead creature.`,
    faction: 'enemy',
    tough:  2,
    cool:   -1,
    sharp:  -1,
    charm:  -1,
    traits: {
    }
}, {template: 'ghoul'} )

new Entity({
    name: "lockpicks",
    tags: ['tool', 'lockpick', 'item'],
    icon: 'lockpicks.png',
    description: `Handy for opening locks.`, // hook pick
}, {template: 'lockpicks'} )

new Entity({
    name: "toolkit",
    tags: ['tool', 'item'],
    // icon: 'lockpicks.png',
    description: `Various tools: screwdrivers, wrenches, hammers, etc.`, // hook pick
}, {template: 'toolkit'} )



new Entity({
    name: "crowbar",
    tags: ['tool', 'weapon', 'item'],
    icon: 'crowbar.png',
    description: `A heavy crowbar.`,
    tier: 1,
}, {template: 'crowbar'} )

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
    tier: 2,
}, {template: 'axe'} )

new Entity({
    name: "knife",
    tags: ['melee', 'weapon', 'tool', 'item'],
    epithet: ["sharp", "rusty", "old"],
    icon: 'knife.png',
    description: `A simple knife.`,
    tier: 1,
}, {template: 'knife'} )

new Entity({
    name: "stick",
    tags: ['item'],
    // epithet: ["crooked", "old"],
    icon: 'stick.png',
    description: `Just a simple stick; broken from a tree or found in the forest.`,
}, {template: 'stick'} )

new Entity({
    name: "broken furniture",
    tags: ['item'],
    // epithet: ["crooked", "old"],
    icon: 'broken_furniture.png',
    description: `A broken piece of furniture.`,
}, {template: 'broken furniture'} )

new Entity({
    name: "stake",
    tags: ['item', 'weapon', 'tool'],
    // epithet: ["crooked", "old"],
    icon: 'stake.png',
    description: `A sharp stake.`,
    tier: 1,
}, {template: 'stake'} )

new Entity({
    name: "garlic",
    tags: ['item', 'consumable'],
    // epithet: ["crooked", "old"],
    icon: 'garlic.png',
    description: `A garlic bulb.`,
}, {template: 'garlic'} )

//
// ENTITIES
// 
// 

Entity.spawn( 'ghoul', mansion_front )

Entity.spawn( 'ghoul', mansion_back )
Entity.spawn( 'ghoul', mansion_back )
Entity.spawn( 'ghoul', garage )
Entity.spawn( 'ghoul', shed )
Entity.spawn( 'ghoul', shed )
Entity.spawn( 'ghoul', shed )

Entity.spawn( 'knife', kitchen )
Entity.spawn( 'knife', shed )
Entity.spawn( 'toolkit', shed )
Entity.spawn( 'magnifying glass', study )
Entity.spawn( "doctor's bag", master_bedroom )

let compass = new Entity({
    tags: ['item'],
    name: "broken compass",
    icon: 'compass.png',
    // description: `Your compass is broken, it is just spinning around and around. This is not natural.`,
    description: function(){return random(4)},
    location: player,
    clues: [
      new Clue({ text: `This cannot be natural.`, reqs: {sharp: 2} }),
    ]
})

new Entity({
    tags: ['item'],
    name: "horribly mutilated teddy bear",
    description: `This teddy bear has parts missing, and its fillings it is all over the place. Poor thing must have gone through terrible times. You cannot bear such a horrible sight!`,
    location: ladies_bedroom,
})

new Entity({
    tags: ['item'],
    name: "headless unicorn",
    description: `Sure, the head is missing, but it was definitely a unicorn.`,
    location: ladies_bedroom,
})

new Entity({
    tags: ['item'],
    name: "almost accurate Earth globe",
    description: `Interesting Earth globe, it has 'most' of the continents, mostly at the right place.`,
    location: study,
})

new Entity({
    tags: ['item'],
    name: "broken doll",
    description: `Someone has committed horrible things to this doll.`,
    location: ladies_bedroom,
})

let cross = new Entity({
    name: "cross",
    tags: ['item'],
    icon: 'cross.png',
    description: `A simple cross.`,
    location: well,
})


new Entity({
    tags: ['item', 'book'],
    name: "Dear Diary",
    icon: 'book.png',
    description: `<p>This book is a diary. Some recent entries:</p>
    <i>
      <p>Daddy has been acting very strange since he returned from the expedition. He is very secretive about the statue he has brought back. I took a sneak peak on it but it felt... very uncomfortable...</p>
      ...
      <p>He built a hidden room in the cellar. He walled away a part of the cellar, but there is a secret entrance via an empty barrel. I figured out how to open it but had nothing but a strange coffin inside. Weird.</p>
      ...
      <p>Daddy has been very obsessed with blood, and I really don't like this. I ordered a book from a certain Professor Van Helsing from Amsterdam to read about the subject. I don't want Daddy to find it so I hid it well.</p>
    </i>
    `,
    location: ladies_bedroom,
    clues: [
      new Clue({text: `The section about the secret passage is particularly interesting!`, flag: true, 
        info: new Info({tag: 'secret_passage', text: `There is a secret passage in the cellar, via an empty barrel.`}) })
    ],
})

new Entity({
    tags: ['item', 'book'],
    name: "Vampire Slaying for Dummies",
    icon: 'book.png',
    description: `<p>'Vampire Slaying for Dummies' by Professor Van Helsing.
    Skimming through the book, it is very academic, with a very detailed history of vampirism, 
    the anatomy of vampires and metaphysical description of the process of how they sustain. 
    However, there is a summary section with practical advice.</p>
    <i>Vampires are vile, powerful creatures, mundane attempts for slaying them shall fail. 
    Wounds which would kill a mortal merely slow them down. 
    Still, there are ways for slaying them permanently:
    <ul>
      <li>The most straightforward way of the slayer is to drive a stake through the heart. (The heart of the vampire, I mean.) 
      The must be made of organic material, preferably wood, the type of the wood does not matter. 
      It must be sharpened at one end so that it goes through the vampire in a frictionless manner.
      Metal or anything inorganic does not qualify.</li>
      <li>Complete incineration, as not even a vampire can regenerate when rendered into a pile of ash. However, make sure to burn every part of it.</li>
      <li>Exposure to direct sunlight -- that also results in setting the creature of the night ablaze, thus leading to full incineration via holy fire.</li>
      <li>Holy weapons, relics or symbols can help, the stronger faith of the wielder, the more likely holy fires will erupt. Any holy presence may still stun the beast or slow it down.</li>
    </ul>
    <p>Garlic, while not deadly also helps. The beasts hate garlic and are reluctant to touch let alone bite someone with the smell of garlic.
    It may give some protection, but it is no silver bullet.</p>
    <p>Speaking of silver: blades, weapons, bullets or items made of silver are very useful as the vampire slayer may sell them for quick cash thus funding the acquisition of further equipment.
    However, silver is <u>not</u> useful against vampires. (That is against werewolves, don't confuse them!)</p>
    </i>
    `,
    location: mansion_roof,
    clues: [
      new Clue({text: `While most of the book is academic, there is a really practical advice which shines through all parts:<br/>
        <i>By all means, do NOT look into the eyes of a vampire!</i>`, reqs: {sharp: Test.EASY},
        info: new Info({tag: 'slaying_vampires', text: `Vampires can be slain by driving a stake through their heart or by complete incineration.`}) })
    ],
})

let ladder = new Entity({
    tags: ['item'],
    name: "ladder",
    icon: 'ladder.png',
    description: `Someone has committed horrible things to this doll.`,
    location: mansion_right,
    position: `There is a [ladder] lying on the ground by the mansion's wall.`,
    path_up:   new Path({
      from: game.universe, 
      to: game.universe, 
      text: `climb up the ladder`,
    }),
    path_down:   new Path({
      from: game.universe, 
      to: game.universe, 
      text: `climb down the ladder`,
    }),
    connect: function( from, to ) {
      this.path_up.from = game.entity(from).id
      this.path_up.to = game.entity(to).id
      this.path_down.from = this.path_up.to
      this.path_down.to = this.path_up.from 
    },
    on_move() {
      this.connect( game.universe, game.universe )
    }
})

  game.add_trigger(
    {verb: /use/, op1: ladder, op2: /mansion|^$/},
    function(cmd) {
      if( cmd.who.get_location() == mansion_left || cmd.who.get_location() == mansion_right ) {
        ui.add_event(`You lean the ladder against the wall.`)
        ladder.move_to( cmd.who.get_location(), `A [ladder] has been leaned against the wall.` )
        ladder.connect( cmd.who.get_location(), mansion_roof )
        return true
      }
      if( cmd.who.get_location() == well_area ) {
        ui.add_event(`You slip the ladder into the well, it now reaches the bottom.`)
        ladder.move_to(well_area, `There is a [ladder] leading down into the well.`)
        ladder.connect( well, well_area )
        return true
      }
      ui.add_event(`There is no point in using the ladder here.`)
      return true
    }
  )
  
let ham = new Entity({
  tags: ['item', 'consumable'],
  name: 'a ham',
  icon: 'ham.png',
  description: 'A delicious-looking ham.',
  location: pantry,
  clues: [
    new Clue({ text: `The ham looks intact, not touched by the corruption.`, reqs: {'sixth sense': Test.BASIC} }),
    new Clue({ text: `The ham is smoked and salted, it thus remained edible.`, reqs: {'perception': Test.MEDIUM} }),
  ],  
})

  game.add_trigger(
    {verb: /consume|use/, op1: ham, op2: /knife|^$/},
    function(cmd) {
      ui.text(`You eat the ham. Finally, some food!`)
      player.gain_info({tag: 'quest_hunger', category: "Quest", text: "You found food, you are no longer hungry."})
      cmd.op1.destroy()
      cmd.who.level_up()
    },
  )

let whisky = new Entity({
  tags: ['item', 'consumable'],
  name: 'a bottle with mysterious liquid',
  icon: 'whisky.png',
  description: 'A bottle with some mysterious liquid inside. The label has been removed from the bottle.',
  location: study,
  clues: [
    new Clue({ text: `It smells like alcohol...`, reqs: {'perception': Test.MUNDANE} }),
    new Clue({ text: `This is definitely whisky! Some <i>very good</i> whisky!`, reqs: {'perception': Test.MEDIUM} }),
  ],  
})

  game.add_trigger(
    {verb: /consume|use/, op1: whisky, op2: /^$/},
    function(cmd) {
      ui.text(`The whisky burns your throat but gives you new strength!`)
      cmd.op1.destroy()
      cmd.who.level_up()
    },
  )
  

let idol = new Entity({
    tags: ['item', 'character'],
    name: "strange idol",
    icon: 'idol.png',
    description: `A chaotic, bizarre, decadent statue of a strange creature, with a combination of bat-wings, tentacles, eyes, teeth, claws all over it. 
    Its body is covered with scale, fur, skin and feathers, it does not resemble anything you are familiar with and defies all the rules of biology, anatomy or even geometry.
    There is no logic or symmetry in the creature, it stands as a mockery of everything you have known. 
    The black obsidian statue has a chaotic and malign aura and radiates an eerie glow.`,
    location: coffin,
    clues: [
      new Clue({ text: `You have a very bad feeling about this idol. You fear touching it and you would like to be as far away from it as possible.`, reqs: {'sixth sense': Test.BASIC} }),
      new Clue({ text: `You fear touching the idol and you would like to be as far away from it as possible. It is not safe to hold this... thing!`, reqs: {'sixth sense': Test.MEDIUM} }),
      new Clue({ text: `This idol is a singularity, a focus of malign energy and the sheer hatred it radiates distorts reality. Knowing of its existence already hurts you. This status must be gone for good.`, reqs: {'sixth sense': Test.ADVANCED}, flag: true }),
    ],
    act() {
      if( !this.is('remains') && this.get_location()==game.get_player() ) {
        ui.text(`You feel something is sucking you soul away.`)
        game.get_player().take_damage({type: 'spirit'})
      } 
    },
    go_down() {
      this.name = 'crushed idol'
      this.description = `Most of the malign radiation is gone, merely a shadow remains, as the evil idol has been destroyed.`
      this.clues = []
      this.set_tag('remains')
    }
})

  game.add_trigger(
    {verb: /examine/, op1: idol},
    function(cmd) {
      if( !idol.is('remains') ) {
        ui.text(`You feel mesmerized by the idol, lost in time and space; reality fades for a brief moment and you no longer know who or what you are, and cannot decide whether to cover in fear, run away, or bow down and worship this magnificent thing. You feel it is crushing your very soul; you struggle to move our eyes away.`)
        cmd.who.take_damage({type: 'spirit'})        
      }
      return false
    }
  )

  game.add_trigger(
    {verb: /attack/, op1: idol},
    function(cmd) {
      ui.text(`You crush the evil idol.`)
      idol.go_down()
      return true
    }
  )

  game.add_trigger(
    {verb: /use/, op1: /axe/, op2: idol},
    function(cmd) {
      ui.text(`You crush the evil idol.`)
      idol.go_down()
      return true
    }
  )
  
  



let vampire_eyes = new Entity({
    name: "red eyes",
    description: `You feel lost in the mesmerizing <font style="color: red;">red eyes</font> of the vampire.`,
})

let vampire = new Entity({
    name: "vampire",
    tags: ['undead', 'character', 'boss'],
    icon: 'vampire4.png',
    description: `A creature of darkness with ${ui.print_entity(vampire_eyes)}; this beast returned from the grave to drain your blood.`,
    faction: 'enemy',
    tough:  7,
    cool:   10,
    sharp:  6,
    charm:  8,
    traits: {},
    location: coffin,
    act() {
      if( this.get_location()==coffin && coffin.is('open') ) {
        this.move_to(coffin_room)
        ui.text(`A `,vampire,` rises from the coffin!<br/>
          `+ui.img('vampire3.png'))
        return true
      }
      
      if( this.has_penalty() )
        ui.text(vampire,` is reluctant to touch `,game.get_player(),` who smells garlic.`)
      
      this.autoattack()
      
      // ui.text(`no actions for the vampire`)
    },
    go_down() {
      ui.text(`The `, vampire, ` falls on the ground. No mortal could survive this, but your foe is no mere mortal. The vampire regenerates; your attack just stunned it for a while.`)
      vampire.add_status({name: 'stunned', timer: 3})
      vampire.recover()
    },
    has_penalty() {
      return Boolean(game.get_player().has_status('smells garlic'))
    },
})

  game.add_trigger(
    {verb: /use/, op1: /stake/, op2: vampire},
    function(cmd) {
      if( vampire.is_up() ) {
        ui.text(cmd.who,` drives the stake through the heart of the vampire, who collapses into a pile of ash.`)
        // vampire.go_down() // cannot be used as it is special
        vampire.remove_tag('character')
        vampire.set_tag('remains')
        vampire.name = "vampire's remains"
        vampire.icon = 'ashes.png'
        vampire.description = `The dreadful creature of the night is now nothing but a pile of ash.`
        return true
      }  
      ui.text(`The vampire is gone for good, there is no point in staking it again.`)
      return true
    }
  )

  game.add_trigger(
    {verb: /examine/, op1: vampire_eyes, },
    function(cmd) {
      if( vampire.is_up() ) {
        ui.text(`The vampire's eyes are peculiar... mesmerizing... You feel you must hold the creature's stare... forever...`)
        if( cmd.who.test('resistance', Math.trunc(vampire.performance('charm')/2) ) ) {
          cmd.who.take_damage({type: 'spirit', value: 3})
          if( cmd.who.is_up() ) {
            ui.text(`Summoning all your spiritual strength, you look away from the `, vampire, `'s eyes.`)
          }
          return true
        } else {
          ui.text(`You feel helpless as the `,vampire,` steps right next to you and reaches out to your neck with his fangs. The bite hurts just a little...`)          
          cmd.who.go_down()
          return true
        }
      }
      throw `this should not happen, the vampire is already dead`
    }
  )

let butler = new Entity({
  name: "the butler",
  // tags: ['character'],
  description: `An elderly gentleman with a monocle, probably part of the staff who serves at the mansion.`,
  // tough: 1,
  // cool:  2,
  // sharp: 2,
  // charm: 2,
  clues: [
    new Clue({ text: `There is something more to this person... You are feeling uneasy.`, reqs: {'sixth sense': Test.MEDIUM}, flag: true }),
  ],
})
  
let the_staff = new Entity({
    name: "the staff",
    tags: ['undead', 'construct', 'character'],
    icon: 'the_staff.png',
    description: `A assembled from different bodyparts of the mansion's staff.`,
    faction: 'neutral',
    attitude: -2,
    tough:  8,
    cool:   3,
    sharp:  3,
    charm:  -2,
    traits: {},
    location: main_hall,
    // location: player_ship,
    clues: [
      new Clue({ text: `One of the arms of the creature is holding a keyring, this might be useful.`, reqs: {perception: Test.EASY}, flag: true }),
    ],
    knocked: false,
})

  let keyring = new Entity({
    name: "butler's keyring",
    tags: ['key', 'item'],
    description: `A keyring with lots of keys on it. This should open all or most doors of the mansion.`,
    location: the_staff,
  })
  
  game.add_trigger(
    {verb: /use/, op1: keyring, op2: /door/},
    function(cmd) {
      if( cmd.op2.is('locked') ) {
        ui.text(`Going through the keyring you eventually find the right key to open the lock on the `, cmd.op2, '.' )
        cmd.op2.remove_tag('locked')
        return true
      }
      ui.text(cmd.op2,` is not locked.`)
      return true
    }
  )

  game.add_trigger(
    {verb: /move/, op1: study},
    function(cmd) {
      if( the_staff.is_up() ) {
        ui.add_event(`The staff does not let you enter the study.`)
        return true
      }

      ui.add_event(`You go into the study.`)
      return false
    }
  )



let woodsmans_axe = Entity.spawn( 'axe', bushes, {name: "woodsman's axe"} )
let woodsmans_knife = Entity.spawn( 'knife', dead_woodsman )

Entity.spawn( 'axe', shed, {name: "axe"} )

let knife_in_tree = Entity.spawn( 'knife', clearing_edge, {position: "A [knife] is stuck in a tree."} )



//
// GLOBAL TRIGGERS
//

game.add_trigger(
  {verb: /use/, op1: trees},
  function(cmd) {
    if( the_staff.is_up() ) {
      ui.add_event(`You break a branch from the trees.`)
      Entity.spawn( 'stick', cmd.who )
      return true
    }

    ui.add_event(`You go into the study.`)
    return false
  }
)

// todo: 
// - break furniture to get broken piece
// - use knife on stick or broken furniture to get stake

game.add_trigger(
  {verb: /use/, op1: /knife/, op2: /stick/},
  function(cmd) {
    ui.add_event(`${cmd.who} has carved a stake.`)
    cmd.op2.destroy()
    Entity.spawn( 'stake', cmd.who )
    return true
  }
)

game.add_trigger(
  {verb: /pick up|use/, op1: garlic_braid},
  function(cmd) {
    ui.add_event(`You pick up some garlic.`)
    Entity.spawn( 'garlic', cmd.who )
    return true
  }
)

game.add_trigger(
  {verb: /consume|use/, op1: /^garlic$/},
  function(cmd) {
  ui.add_event(`You eat the garlic bulb as a whole. Yuck! Now you smell garlic.`)
    cmd.op1.destroy()
    cmd.who.add_status({name: `smells garlic`, timer: false})
    // Entity.spawn( 'garlic', cmd.who )
    return true
  }
)

game.add_trigger(
  {verb: /use/, op1: cross, op2: vampire},
  function(cmd) {
    if( cmd.who.spend({value: 1, type: 'spirit'}) ) {
      ui.text(`The `,vampire,` backs off as you raise the `,cross,`. An immense force slams the vampire to the wall.`)
      vampire.add_status({name: 'stunned', timer: 4})
      // ui.text(`The `,vampire,` is brie fly stunned.`)
      return true      
    } else {
      ui.text(`You do not feel confident to stand up against the `,vampire,`.`)      
    }
  }
)

game.add_trigger(
  {verb: /use/, op1: mansion_front_door_knocker, op2: /^$/},
  function(cmd) {
  ui.text(`You knock on the mansion's door.`)
  if( the_staff.is_up() ) {
    ui.text(`You hear some movement from the outside, and after a while the door opens by an inch and an ${ui.e(butler, "elderly gentleman")} peeps at you.<br/>`,
            ui.img('butler_behind_door.png') ,
            `<i>Please leave. The master does not wish to be disturbed.</i>`
            )
    if( the_staff.knocked ) {
      the_staff.attitude--
      ui.text(`He looks very disappointed.`)
    }
    the_staff.knocked = true            
  } else
    ui.text(`There is no response.`)
  
  return true
  }
)

game.add_trigger(
  {verb: /talk/, op1: butler, op2: /^$/},
  function(cmd) {
  if( the_staff.is_up() && the_staff.knocked ) {
    if( cmd.who.test('social', Test.EASY-the_staff.attitude) ) {
      ui.text(ui.img('butler_behind_door.png') ,
              `<br/><i>Please come in, I shall announce your arrival to the master.</i>` )
      ui.text(`He moves away from the doorway, the mansion's door opens up and now you can enter.`)
      mansion_front_door.remove_tag('locked')
      mansion_front_door.remove_tag('closed')
      mansion_front_door.set_tag('open')
    } else {
      ui.text(ui.img('butler_behind_door.png') ,
              `<br/><i>Please leave, tramps have absolutely no business here.` )
      ui.text(`He closes the door.`)
      the_staff.attitude--      
    }
  }
  return true
  }
)

game.add_trigger(
  {verb: /attack/, op1: butler },
  function(cmd) {
    ui.text(`The butler has no intention to fight, he just closes the door.`)
    the_staff.attitude = -Infinity
  })


game.ending.description = function() {
  let s = `<p>Your adventure has ended.</p>`
  
  if( game.get_player().is_up() ) 
    s+= `<p>You have survived the adventure. 😄</p>`
  else
  s+= `<p>You are dead. 💀</p>`

  if( !vampire.is_up() )
    s+= `<p>You have successfully destroyed the vampire.</p>`
  else
  s+= `<p>The vampire still rules the mansion.</p>`

  if( idol.is('remains') )
    s+= `<p>You have vanquished the source of evil.</p>`
  else
  s+= `<p>You were unable to vanquish the evil that corrupted the mansion.</p>`

  
  return s
}

player.gain_info({tag: 'quest', category: "Quest", text: "You need to find a way out of this accursed place."})
player.gain_info({tag: 'quest_hunger', category: "Quest", text: "You are hungry."})
