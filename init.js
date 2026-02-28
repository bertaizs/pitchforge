

let cellar = new Entity({
  name: "cellar",
  description: "A dark cellar, there are spiderwebs everywhere.",
})

let clearing = new Entity({
  name: "clearing",
  description: "A small clearing in the forest.",
})

let cottage = new Entity({
  name: "wooden cottage",
  description: "....",
}).move_to(clearing)

let cottage_door = new Path({
  from: clearing, 
  to: cottage, 
  text: `a door leads into the cottage`,
}, {
  text: `a door leads to the outside`,  
})

let stairs_to_cellar = new Path({
  from: cottage, 
  to: cellar, 
  text: `stairs lead down to the cellar under the cottage`,
}, {
  text: `stairs lead up to the cottage`,
})

let trapdoor_to_cellar = new Path({
  from: cottage, 
  to: cellar, 
  text: `there is a trapdoor on the cottage floor`,
  twoway: false,
  // reverse_text: `stairs lead up to the cottage`,
})





let barbakan = new Entity({
    name: "Barbakan",
    tags: ['character', 'dwarf'],
    epithet: "the bastion",
    icon: 'barbakan.jpeg',
    description: `A sturdy dwarf.`,
    tough:  4,
    cool:   2,
    sharp:  9,
    charm:  3,
    traits: {
        // 'absent-minded': true,
        'bruiser': true,
        'melee': true,
        'occultism': true,
        'hacking': true,
    }
}).level_up().move_to(clearing)

let skanzen = new Entity({
    name: "Skanzen",
    tags: ['character', 'elf'],
    epithet: "the cunning",
    description: `A gaunt elf.`,
    tough:  2,
    cool:   3,
    sharp:  3,
    charm:  3,
    traits: {
        'melee': true,
        'hacking': true,
        'perception': true,
        'thievery': true,
        // 'stealth': true,
    }
}).level_up().move_to(clearing)

let gustav = new Entity({
    name: "Gustav",
    tags: ['character', 'human'],
    epithet: "the blank page",
    tough:  0,
    cool:   0,
    sharp:  0,
    charm:  0,
    cp: 10,
    traits: {
    }
}).level_up().move_to(cottage)

game.add_trigger(
  {who: barbakan, verb: 'look', op1: gustav},
  function(cmd) {
    ui.add_event(`Barbakan looks at Gustav, but Gustav stares blankly...`)
    return true
  }
)

let orc = new Entity({
    name: "orc",
    tags: ['character', 'orc'],
    // epithet: "",
    icon: 'orc1.jpeg',
    tough:  4,
    cool:   2,
    sharp:  0,
    charm:  1,
    traits: {},
    location: clearing,
})



let sword = new Entity({
    name: "sword",
    tags: ['melee', 'weapon', 'item'],
    description: `Just a simple sword.`,
}).move_to(clearing)

let pie = new Entity({
    name: "pie",
    tags: ['consumable', 'food', 'item'],
    description: `A delicious pie.`,
}).move_to(clearing)

let lockpick = new Entity({
    name: "lockpick",
    tags: ['tool', 'lockpick', 'item'],
    description: `Handy for opening locks.`,
}).move_to(clearing)


game.select_player(barbakan)

let e = []



let ghoul_template = new Entity({
    name: "ghoul",
    tags: ['returned', 'character'],
    // epithet: "the bastion",
    description: `A stinking undead.`,
    tough:  2,
    cool:   -1,
    sharp:  -1,
    charm:  -1,
    traits: {
    }
}, {template: 'ghoul'}).move_to(clearing)
