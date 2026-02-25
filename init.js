

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
    epithet: "the bastion",
    description: `A sturdy dwarf.`,
    tough:  4,
    cool:   2,
    sharp:  1,
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



game.select_player(barbakan)
// ui.refresh()

// ui.show_sheet(gustav, {respec: true})

let e = []
