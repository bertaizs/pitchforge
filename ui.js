
class UI {

    refresh() {

    }


    sheet( entity, params = {} ) {
        let s = ``
        s+= entity.get('name')
        s+= ' ' +entity.get('epithet')

        s+= `<div>level: ${entity.get('level')}</div>`

        s+= `<table>`

        for( let i in STATS ) {
            s+= `<tr><td>${STATS[i].icon}${i}</td><td style="width: 2em; text-align: right;">${plusminus(entity.get_stat(i))}</td><td>&nbsp;</td>`
            if( 'respec' in params ) {
                s+= `<td><a onclick="ui.sheet_click('${i}',+1,${entity.id})">➕</a></td>`
                s+= `<td><a onclick="ui.sheet_click('${i}',-1,${entity.id})">➖</a></td>`
            }
            s+= `<td><a onclick="ui.explanaition_click('${entity.id}','${i}')">❔</a></td>`
            s+= `</tr>`
        }
        s+= `</table>`

        s+= `<div>charapter points: ${entity.get('cp')}</div>`

        if( ! isEmpty(entity.traits) ) {
            s+= `<div>traits:<ul>`
            for( let i in entity.traits )
                s+= `<li>${i}</li>`
            s+= `</ul></div>`
        }

        s+= `<div>&nbsp;</div>`

        s+= `<div><a onclick="ui.sheet_level_up(${entity.id})">⬆️level up!</a></div>`


        return s
    }

    sheet_click( stat, plusminus, entity, params = {respec: true} ) {
        entity = game.entity(entity)
        entity.change_stat( stat, plusminus )
        ui.show_sheet( entity, params )
    }

    sheet_level_up( entity, params = {respec: true} ) {
        entity = game.entity(entity)
        entity.level_up( )
        ui.show_sheet( entity, params )
    }

    show_sheet( entity, params = {} ) {
        document.getElementById('work').innerHTML = this.sheet(entity, params)
    }

    explanaition(exp) {
        let s = ``
        let n = 0
        s+= `<table>`
        for( let i in exp ) {
            s+= `\n<tr><td>${exp[i].label}</td><td style="width: 2em; text-align: right;">${plusminus(exp[i].value)}</td>`
            n+= exp[i].value
        }
        s+= `</table>`
        s+= `<hr/>result: ${n}`
        return s
    }
    show_explanaition(exp) {
        document.getElementById('expl').innerHTML = this.explanaition(exp)
    }
    explanaition_click( entity, stat ) {
        entity = game.entity(entity)
        let e = []
        let n = entity.get_stat(stat, e)
        this.show_explanaition(e)
    }

}

var ui = new UI()
