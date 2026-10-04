
// this file is for issuing testing commands
// these are run before the core game starts

// player.gain_info({tag: 'alma', category: "Quest", value: 1})
// player.gain_info({tag: 'korte', category: "Quest", value: "malac"})


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
