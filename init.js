

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


let s = `You are: ` +ui.entity_list( game.entities, ui.select_entity )
s+= ` <a onclick="ui.refresh()">refresh</a> |
<a onclick="game.tick(); ui.refresh();">tick</a> `

document.getElementById('cmd').innerHTML = s

ui.select_entity(barbakan)

// ui.show_sheet(gustav, {respec: true})

let e = []
