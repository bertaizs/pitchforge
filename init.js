

let barbakan = new Entity({
    name: "Barbakan",
    epithet: "the bastion",
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




ui.show_sheet(gustav, {respec: true})

let e = []
