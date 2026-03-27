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
  `<p>You see a clearing in the forest with a dilapidated mansion.</p>
  <p>There is absolutely no point in going back into the forest. You would just die there among the ${ui.print_entity(trees)}.
  `,
  location_clues: [
    new Clue({ text: `Something has been dragged in to the bushes.`, reqs: {perception: 1} }),
  ]
})

  let mansion_front_door = new Entity({
    name: "Front Door",
    tags: ['door', 'closed'],
    // icon: 'mansion_front.png',
    description: `<p>A heavy wooden double door stands in the mansion's main enterance.</p>`,
    location_clues: [
      // new Clue({text: `Something is very-very wrong with this place.`, reqs: {'sixth sense': 1}}),
    ],
  })

let mansion_front = new Entity({
  name: "In front of the Mansion",
  icon: 'mansion_front.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing in front of the dilapidated ${ui.e(mansion)}.
  The forest is still near, its crooked ${ui.e(trees)} make you feel uncomfortable.
  So does the mansion.
  </p>
  <p>A wooden ${ui.e(mansion_front_door, "double door")} leads into the mansion.</p>
  `,
  location_clues: [
    new Clue({text: `Something is very-very wrong with this place.`, reqs: {'sixth sense': 1}}),
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
  name: "Left of the Mansion",
  icon: 'mansion_left.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing on the left side of the dilapidated ${ui.print_entity(mansion)}.
  The ${ui.print_entity(trees)} circle the mansion as if the haunted forest was trying to consume it.</p>
  `,
})

let mansion_right = new Entity({
  name: "Right side of the Mansion",
  icon: 'mansion_right.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>You are standing on the right side of the dilapidated ${ui.print_entity(mansion)}.
  There are ${ui.print_entity(trees)} everywhere.</p>
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

let well_bottom = new Entity({
  name: "Bottom of the Well",
  icon: 'well.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Well, you are at the bottom...</p>
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

let garage = new Entity({
  name: "Garage",
  icon: 'garage_interior.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Inside the garage behind the mansion.</p>
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
    reqs: {perception: 1},
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
  <p>A ${ui.print_entity(mansion_front_door, {label: "double door"})} leads to the outside.</p>
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
    tags: ['closed', 'door'],
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
    name: "lockpick",
    tags: ['tool', 'lockpick', 'item'],
    icon: 'lockpicks.png',
    description: `Handy for opening locks.`, // hook pick
}, {template: 'lockpick'} )

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
    name: "broken doll",
    description: `Someone has committed horrible things to this doll.`,
    location: ladies_bedroom,
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
})

let ladder = new Entity({
    tags: ['item'],
    name: "ladder",
    icon: 'ladder.png',
    description: `Someone has committed horrible things to this doll.`,
    location: mansion_right,
    position: `A [ladder] is lying next to the mansion's wall.`,
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
    {verb: /use/, op1: ladder},
    function(cmd) {
      if( cmd.who.get_location() == mansion_left || cmd.who.get_location() == mansion_right ) {
        ui.add_event(`You lean the ladder against the wall.`)
        ladder.move_to( cmd.who.get_location(), `A [ladder] has been leaned against the wall.` )
        ladder.connect( cmd.who.get_location(), mansion_roof )
        return true
      }
      if( cmd.who.get_location() == well ) {
        ui.add_event(`You slip the ladder into the well, it now reaches the bottom.`)
        ladder.move_to(well, `There is a [ladder] leading down into the well.`)
        ladder.connect( well_bottom, well )
        return true
      }
      ui.add_event(`There is no point in using the ladder here.`)
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
    tough:  10,
    cool:   10,
    sharp:  6,
    charm:  8,
    traits: {},
    location: coffin_room,
    // location: player_ship,
})

  game.add_trigger(
    {verb: /use/, op1: /stake/, op2: vampire},
    function(cmd) {
      if( vampire.is_up() ) {
        ui.add_event(`${cmd.who} drives the stake through the heart of the vampire.`)
        vampire.go_down()
        vampire.description = `The dreadful creature of the night is now nothing but a pile of ash.`
        return true
      }  
      ui.add_event(`The vampire is gone for good, there is no point in staking it again.`)
      return true
    }
  )

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
})

  let keyring = new Entity({
    name: "butler's keyring",
    tags: ['key', 'item'],
    description: `A keyring with lots of keys on it. This should open all or most doors of the mansion.`
  })

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


let dead_woodsman = new Entity({
    name: "dead woodsman",
    tags: ['prop', 'remains', 'container', 'open'],
    description: `The dead and partially eaten body of a woodsman.`,
    location: bushes,
})

let woodsmans_axe = Entity.spawn( 'axe', bushes, {name: "woodsman's axe"} )
let woodsmans_knife = Entity.spawn( 'knife', dead_woodsman )

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
