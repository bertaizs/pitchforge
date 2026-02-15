
class UI {

    refresh() {
      ui.show_main()
      ui.show_sheet(game.get_player())
    }

    click_entity(id) {
      let entity = game.entity(id)
      // console.log( "clicked on: "+entity.get('name') )
      this.show_sheet( entity, {respec: true} )
    }
    
    entity_link(id) {
      return `ui.click_entity(${id})`
    }
    
    show_main() {
      let s = ``
      s+= `<ul>`
      for( let i in game.entities )
        s+= `<li><a onclick="${this.entity_link(game.entities[i].id)}">${game.entities[i].get('name')}</a></li>`
      s+= `</ul>`
      
      document.getElementById('main').innerHTML = s
    }

    sheet( entity, params = {} ) {
        let s = ``
        s+= entity.get('name')
        s+= ' ' +entity.get('epithet')

        s+= `<div>level: ${entity.get('level')}</div>`
        
        s += `<p>
                body: ${entity.get('body')}/${entity.get('max_body')},
                spirit: ${entity.get('spirit')}/${entity.get('max_spirit')}<br/>
              </p>`

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

        s+= `<div>character points: ${entity.get('cp')}</div>`

        if( ! isEmpty(entity.traits) ) {
            s+= `<div>traits:<ul>`
            for( let i in entity.traits )
                s+= `<li>${i}</li>`
            s+= `</ul></div>`
        }

        s+= `<div>&nbsp;</div>`

        if( ! isEmpty(entity.status) ) {
            s+= `<div>statuses:<ul>`
            for( let i in entity.status )
                s+= `<li>${i} (timer: ${entity.status[i].timer}, magnitude: ${entity.status[i].magnitude})</li>`
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

    

    select_entity(id) {
      // console.log( id + " has been selected")
      ui.show_sheet(game.entity(id), {respec: true})
    }
    
    entity_list( entities, callback ) {
      let s = ``
      s+= `<select onchange="ui.${callback.name}(this.value);">`
      // s+= `<option>none</option>`
            
      for( let i in entities ) {
        s+= `<option value="${entities[i].id}" onselect="alert(${entities[i].id})">${entities[i].get('name')}</option>`
      }
      s+= `</select>`
      
      return s
    }
    

}

var ui = new UI()
