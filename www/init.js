
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



new Entity({
    name: "power armor",
    tags: ['heavy', 'armor', 'item'],
    // icon: 'axe.png',
    description: `I'VE GOT THE POWER!`,
    tier: 4,
} ).move_to(gloomy_forest)

new Entity({
    name: "dagger",
    tags: ['cool', 'melee', 'weapon', 'tool', 'item'],
    icon: 'knife.png',
    description: `A simple knife.`,
    tier: 1,
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
    description: `Howdy?`,
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
