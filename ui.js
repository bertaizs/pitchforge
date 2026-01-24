
class UI {

    refresh() {
        
    }


    sheet( entity, params = {} ) {
        let s = ``
        s+= entity.get('name')
        s+= ' ' +entity.get('epithet')

        s+= `<table>`

        for( let i in STATS ) {
            s+= `<tr><td>${i}</td><td>${entity.get(i)}</td>`
            if( 'respec' in params ) {
                s+= `<td><a onclick="alert('+')">➕</a></td>`
                s+= `<td><a onclick="alert('-')">➖</a></td>`
            }
            s+= `</tr>`
        }
        s+= `</table>`

        s+= `<div>charapter points: ${entity.get('cp')}</div>`

        return s
    }

    sheet_click( stat, plusminus, entity, params ) {
        entity.change_stat( stat, plusminus )
        ui.show_sheet( entity, params )
    }

    show_sheet( entity, params = {} ) {
        document.getElementById('work').innerHTML = this.sheet(entity, params)
    }


}

var ui = new UI()
