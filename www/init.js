
// this file is for issuing testing commands
// these are run before the core game starts

// player.gain_info({tag: 'alma', category: "Quest", value: 1})
// player.gain_info({tag: 'korte', category: "Quest", value: "malac"})

let danger_room = new Entity({
  name: "danger room",
  tags: ['location'],
  // icon: 'forest.png',
  // description: `<p></p>`,
  interior_description: 
  `<p>Danger room.</p>
  `,
})

new Path({
  from: gloomy_forest, 
  to: danger_room, 
  text: `to the danger room`,
},  {  text: `back into the forest`,  }
)

// test entities

new Entity({
    name: "power armor",
    tags: ['heavy', 'armor', 'item'],
    // icon: 'axe.png',
    description: `I'VE GOT THE POWER!`,
    tier: 2,
    kinetic_armor: 2,
    energy_armor: 2,
    psy_armor: 1,
}, {template: 'power armor'})

new Entity({
    name: "leather armor",
    tags: ['armor', 'item'],
    // icon: 'axe.png',
    description: `I'VE GOT THE POWER!`,
    tier: 0,
    kinetic_armor: 1,
    energy_armor: 1,
}, {template: 'leather armor'})

new Entity({
    name: "chain mail",
    tags: ['armor', 'item'],
    // icon: 'axe.png',
    description: `I'VE GOT THE POWER!`,
    tier: 1,
    kinetic_armor: 1,
}, {template: 'chain mail'})

new Entity({
    name: "plate mail",
    tags: ['heavy', 'armor', 'item'],
    // icon: 'axe.png',
    description: `I'VE GOT THE POWER!`,
    tier: 1,
    kinetic_armor: 2,
}, {template: 'plate mail'})

new Entity({
    name: "greataxe",
    tags: ['melee', 'two-handed', 'weapon', 'item',],
    icon: 'axe.png',
    description: `A mighty axe forged by the dwarves.`,
    // tier: 2,
    damage: Dmg({value: 3, tier: 2}),
}, {template: 'greataxe'} )





new Entity({
    name: "dagger",
    tags: ['cool', 'melee', 'weapon', 'tool', 'item'],
    icon: 'knife.png',
    description: `A simple knife.`,
    tier: 1,
} ).move_to(gloomy_forest)

let flaming_sword = new Entity({
    name: "flaming sword",
    tags: ['melee', 'weapon', 'sword', 'item'],
    icon: 'knife.png',
    description: `A simple knife.`,
    damage: [Dmg({value: 2, tier: 1}), Dmg({value: 1, tier: 1, element: 'energy'})]
} ).move_to(gloomy_forest)

new Entity({
    name: "cowboy hat",
    tags: ['clothing', 'item'],
    // icon: 'knife.png',
    description: `Howdy?`,
    reqs: { tough: 2 },
    bonus: { cool: 3, perception: 10 },
} ).move_to(gloomy_forest)

new Entity({
    name: "jester's hat",
    tags: ['clothing', 'item'],
    // icon: 'knife.png',
    description: `Fun!`,
    reqs: { charm: 1 },
    bonus: { cool: 3, sharp: -3 },
} ).move_to(gloomy_forest)

new Entity({
    name: "wooden shield",
    tags: ['shield', 'item'],
    // icon: 'knife.png',
    description: `A sturdy wooden shield.`,
    reqs: { tough: 2 },
    bonus: { block: 2 },
} ).move_to(gloomy_forest)



// enemies

// Entity.spawn( 'ghoul', danger_room )


let wight = new Entity({
    name: "wight",
    tags: ['undead', 'character', ],
    // icon: 'vampire4.png',
    description: `A dangerous wight.`,
    faction: 'enemy',
    tough:  3,
    cool:   2,
    sharp:  1,
    charm:  -2,
    traits: {},
    tier: 1,
    location: danger_room,
})



let power_armor = Entity.spawn( 'power armor', gloomy_forest )
let leather_armor = Entity.spawn( 'leather armor', gloomy_forest )
let chain_mail = Entity.spawn( 'chain mail', gloomy_forest )
let plate_mail = Entity.spawn( 'plate mail', gloomy_forest )

let greataxe = Entity.spawn( 'greataxe', gloomy_forest )
