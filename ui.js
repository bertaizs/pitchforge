
class UI {
  
    constructor() {
      this.cmd = new Cmd({verb: 'look'}, {validate: false})
    }

    refresh() {
      ui.show_main()
      // ui.show_sheet(game.get_player())
      ui.show_commands()
      ui.display_cmd()
    }

    click_entity(id) {
      let entity = game.entity(id)
      options.log_clicks_on_entities && console.log( "clicked on Entity: "+entity.get('name') )
      // this.show_sheet( entity, {respec: true} )
      if( this.cmd.get_verb().op1 )
        this.cmd.op1 = entity
      ui.display_cmd()
    }
    
    entity_link(e) {
      let id = game.entity(e).id
      return `ui.click_entity(${id})`
    }
    
    print_entity(id) {
      let e = game.entity(id)
      return `<a class="entity" onclick="${ui.entity_link(e)}">${e.get('name')}</a>`
    }
    
    show_main() {
      let s = ``
      s+= `<ul>`
      // for( let i in game.entities )
      //  s+= `<li>`+this.print_entity(game.entities[i].id)+`</li>\n`
      for( const e of game.entities.filter(x=>x.id!=0) )
        s+= `<li>${this.print_entity(e)}</li>\n`
      s+= `</ul>`
      
      document.getElementById('main').innerHTML = s
    }

    sheet( entity, params = {} ) {
      entity = game.entity(entity)
      
      // the optional param 'perception' can limit what is displayed on the charsheet
      let perception = ('perception' in params ? params.perception : Infinity )
      options.log_perception_on_charsheets && console.log( `perception: ${perception}` )
      
      let s = ``
      // s+= entity.get('name')
      s+= ui.print_entity(entity)
      s+= ' ' +entity.get('epithet')
      
      s+= entity.get('description') ? `<div>`+entity.get('description')+`</div>` : ''

      if( perception > 2) {
        s+= `<div>level: ${entity.get('level')}</div>`          
      }
      
      if( perception > 0) {
        s += `<p>
                body: ${entity.get('body')}/${entity.get('max_body')},
                spirit: ${entity.get('spirit')}/${entity.get('max_spirit')}<br/>
              </p>`          
      }

      if( perception > 2){
        s+= `<table>`
        for( let i in STATS ) {
            s+= `<tr><td title="${STATS[i].text}">${STATS[i].icon}${i}</td><td style="width: 2em; text-align: right;">${plusminus(entity.get_stat(i))}</td><td>&nbsp;</td>`
            if( 'respec' in params ) {
                s+= `<td><a onclick="ui.sheet_click('${i}',+1,${entity.id})">➕</a></td>`
                s+= `<td><a onclick="ui.sheet_click('${i}',-1,${entity.id})">➖</a></td>`
            }
            s+= `<td><a onclick="ui.explanaition_click('${entity.id}','${i}')">❔</a></td>`
            s+= `</tr>`
        }
        s+= `</table>`          
      }

      if( perception > 5 ) {
        if( ! isEmpty(entity.traits) ) {
            s+= `<div>&nbsp;</div>`  
            s+= `<div>traits:<ul>`
            for( let i in entity.traits )
                s+= `<li>${i}</li>`
            s+= `</ul></div>`
        }
        s+= `<div>&nbsp;</div>`          
      }
      
      if( perception > 2 ) {
        if( ! isEmpty(entity.status) ) {
            s+= `<div>statuses:<ul>`
            for( let i in entity.status )
                s+= `<li>${i} (timer: ${entity.status[i].timer}, magnitude: ${entity.status[i].magnitude})</li>`
            s+= `</ul></div>`
        }
        // s+= `<div>&nbsp;</div>`
      }
      
      if( perception == Infinity ) {
        s+= `<div>character points: ${entity.get('cp')}</div>`          
      }
      
      if( options.debug ) {
        s+= `\n&nbsp;<hr>`
        s+= `<div>`
        s+= `<a onclick="ui.show_sheet(${entity.id}, {respec: true})">✏️edit...</a> |`
        s+= `<a onclick="ui.sheet_level_up(${entity.id})">⬆️level up!</a> |`
        s+= `</div>`
      }
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
      // game.player_id = game.entity(id).id
      game.select_player(id)
      ui.refresh()
      // ui.show_sheet(game.entity(id), {respec: true})
    }
    
    entity_list( entities, callback ) {
      let s = ``
      s+= `<select onchange="ui.${callback.name}(this.value);">`
      s+= `<option>none</option>`
            
      // for( let i in entities ) {
      //   s+= `<option value="${entities[i].id}" onselect="alert(${entities[i].id})">${entities[i].get('name')}</option>`
      // }
      for( const e of entities.filter(x=>x.id!=0) ) {
        s+= `<option value="${e.id}" >${e.get('name')}</option>`
      }
      s+= `</select>`
      
      return s
    }
    
    click_verb(verb) {
      options.log_clicks_on_verbs && console.log(`clicked verb: ${verb}`)
      
      this.cmd = new Cmd({verb: verb}, {validate: false})
      ui.display_cmd()
    }
    
    verb(v) {
      let verb = VERBS[v]
      let s = `<span>
      <a class="verb" title="${verb.get_text()}" onclick="ui.click_verb('${verb.get_name()}')">${verb.get_label()}</a>
      </span>\n`
      return s
    }
    
    filtered_verbs(verbs, type, label = type) {
      // let verbs = entity.get_verbs()
      verbs = verbs.filter( (x)=>(VERBS[x].type==type) ).sort()
      let s = `<div>${label}: `
      for( let i in verbs ) {
        s+= this.verb(verbs[i])
      }
      s+= `</div>`
      return s
    }
    
    print_verbs(entity) {
      entity = game.entity(entity)
      let verbs = entity.get_verbs()
      let s = ``
      s+= this.filtered_verbs(verbs, 'combat')
      s+= this.filtered_verbs(verbs, 'misc')
      s+= this.filtered_verbs(verbs, 'inventory')
      if( options.debug )
        s+= this.filtered_verbs(verbs, 'debug')
      return s
    }
    
    display_cmd(cmd = this.cmd) {
      let verb = cmd.get_verb()
      // document.getElementById('who').innerHTML = game.get_player().get_name()
      document.getElementById('who').innerHTML = ui.print_entity(game.get_player())
      document.getElementById('verb').innerHTML = verb.get_name()
      document.getElementById('prep').innerHTML = verb.get_prep()
      document.getElementById('op1').innerHTML = ( cmd.op1 ? cmd.get_op1_text() : "" )
      document.getElementById('sep').innerHTML = ( cmd.op2 ? cmd.get_op1_text() : "" )
      document.getElementById('op2').innerHTML = ( cmd.op2 ? cmd.get_op1_text() : "" )
      // console.log(cmd)
    }
    
    show_commands() {
      let s = ``
      if( options.debug ) {
        s+= `Select: ` +ui.entity_list( game.entities, ui.select_entity )
        s+= ` <a onclick="ui.refresh()">refresh</a> |
        <a onclick="game.tick(); ui.refresh();">tick</a> <br/>`
      }
      s+= `
      <div>
      (<span id="who" class="cmd">who</span>): 
      
      <span id="verb" class="cmd">verb</span>
      <span id="prep" class="cmd" >preposition</span>
      <span id="op1" class="cmd" >operand 1</span>
      <span id="sep" class="cmd" >operand separator</span>
      <span id="op2" class="cmd" >operand 1</span>
      
      &nbsp; <button class="btn" onclick="ui.exec()">go</button>
      &nbsp; <button class="btn" onclick="ui.show_sheet(game.get_player())">sheet</button>
      </div>
      `
      s+= this.print_verbs( game.get_player() )
            
      document.getElementById('cmd').innerHTML = s      
    }
    
    exec(cmd = this.cmd) {
      game.exec(cmd)
      ui.refresh()
    }

}

var ui = new UI()
