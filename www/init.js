
// this file is for issuing testing commands
// these are run before the core game starts

// player.gain_info({tag: 'alma', category: "Quest", value: 1})
// player.gain_info({tag: 'korte', category: "Quest", value: "malac"})

console.log("AAAAAAAAÁÁÁÁÁ")


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
