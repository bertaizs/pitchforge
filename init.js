console.log('init')


STATS = {
    "tough": {},
    "cool":  {},
    "sharp": {},
    "charm": {},
}

SKILLS = {
    "melee": {},
    "lockpicking": {},
}

CHECKS = {

}

BONUS = 3
PENALTY = -BONUS
CP_PER_LEVEL = 4


/////////////////

let barbakan = new Entity({
    name: "Barbakan",
    epithet: "the bastion",
    tough:  4,
    cool:   2,
    sharp:  1,
    charm:  3,

})



ui.show_sheet(barbakan, {respec: true})
