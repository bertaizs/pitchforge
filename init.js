

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
}).level_up()

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
}).level_up()

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
}).level_up()



ui.select_entity(barbakan)
// ui.refresh()

// ui.show_sheet(gustav, {respec: true})

let e = []
