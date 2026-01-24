


let barbakan = new Entity({
    name: "Barbakan",
    epithet: "the bastion",
    tough:  4,
    cool:   2,
    sharp:  1,
    charm:  3,

    traits: {
        'absent-minded': true,
        'bruiser': true,
        'melee': true,
    }

}).level_up()



ui.show_sheet(barbakan, {respec: true})

let e = {}