
class UI {
  
  static icon(text) {
    if( text in STATS ) return STATS[text].icon
    if( text in POINTS ) return POINTS[text].icon
    return ''
  }
  
  static help_text(text) {
    if( text in STATS ) return STATS[text].text
    if( text in POINTS ) return POINTS[text].text
    return ""
  }
  
  static wicon(text) {
    return UI.icon(text)+text
  }
  
  static keyword(text) {
    let s = ``
    let help = UI.help_text(text)
    s+= `<span${help ? ' title="'+help+'"' : ''}>${UI.wicon(text)}</span>`
    return s
  }
 
  static numfield(text) { return `<span class="numfield">${text}</span>` }
  
  constructor() {
    this.cmd = new Cmd({verb: 'look'}, {validate: false})
    this.events = []
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
      return `<a class="entity" onclick="${ui.entity_link(e)}">${e.get_name()}</a>`
    }
    
    click_path(path_id) {
      let path = game.paths[path_id]
      options.log_clicks_on_paths && console.log(`clicked on path with id ${path_id}`)
      if(!path) throw `there is no path with id ${path_id}`

      // hack, should be done with commands!
      path.move_through(game.get_player())
      
      ui.refresh()
    }

    print_path(path) {
      // let e = game.entity(id)
//      return `<a class="path" onclick="${ui.path_link(path)}">${p.text}</a>`
      return `<a class="path" onclick="ui.click_path(${path.id})">${path.text}</a>`
    }
    
    
    // returns what the player entity sees when looking around in a location
    // - shows the location's interior (description & icon)
    // - show ministatus of characters & items ()
    // TODO: should call the active/player Entity on what the entity can see and return the results, and should only *process* those results here...
    print_look_around(entity) {
      entity = game.entity(entity)
      let location = entity.get_location()
      let entities = game.list_entities_at(location).filter(x=>x.id!=entity.id).sort()

      let s = `<table><tr><td style="width: 100%;">`      
      s+= `<div>${this.print_entity(location)}</div>`
      if( location.get('interior_icon') ) {
        s+= `<img class='entity_image' src="${options.pictures_location}/${location.get('interior_icon')}"></img>`
      }
      s+= `<div class="description">${location.get('interior_description')}</div>`
      
      s+= `<table>`      
        s+= this.print_list(
          entities.filter(x=>x.is_creature()),
          {label: "others"}
        )
  
        s+= this.print_list(
          entities.filter(x=>x.is_item()),
          {label: "items"}
        )
  
        s+= this.print_list(
          game.paths.filter(x=>( x.has_endpoint(location) && x.can_be_seen_by(entity) )),
          {label: "exists", display: this.print_path, separator: `<br/>`, prefix: "➡️ " }
        )
      s+= `</table>`

      s+= `</td></tr></table>\n`
      return s
    } // print_look_around

    // returns the character sheet of the entity
    // this is also what you see if you LOOK at the entity (from outside)
    print_look_at_entity( entity, params = {} ) { return this.print_sheet(entity, params) }
    // sheet( entity, params = {} ) { return this.print_sheet(entity, params) }
    print_sheet( entity, params = {} ) {
      entity = game.entity(entity)
      
      // the optional param 'perception' can limit what is displayed on the charsheet
      let perception = ('perception' in params ? params.perception : Infinity )
      options.log_perception_on_charsheets && console.log( `perception: ${perception}` )
      
      let s = `<div>`
      s+= ui.print_entity(entity)
      // s+= ' ' +entity.get('epithet')
      
      if( entity.get('icon') ) {
        s+= `<img class='entity_image' src="${options.pictures_location}/${entity.get('icon')}"/>`
      }
      
      s+= entity.get('description') ? `<div>`+entity.get('description')+`</div>` : ''
      
      // from here on, the sheet is viewed in a table
      s+= `<table>`      
      if( perception > 2 && entity.is_creature() ) {
        s+= this.print_list(
          [entity.get('level')],
          {label: "level", display: UI.numfield }
        )
      }
      if( perception > 0 && entity.is_creature() ) {
        s+= this.print_list(
          [`${UI.numfield(entity.get('body'))}/${entity.get('max_body')}`],
          {label: UI.keyword('body'), display: (x)=>x,
           left_class: "table_left table_nopadding", right_class: "table_right table_nopadding" }
        )
        s+= this.print_list(
          [`${UI.numfield(entity.get('spirit'))}/${entity.get('max_spirit')}`],
          {label: UI.keyword('spirit'), display: (x)=>x }
        )
        // s+= `<tr><td>...</td><td>...</td></tr>`
      }
      
      // STATS
      if( perception > 2 && entity.is_creature()) {
        for( let i in STATS ) {
            s+= `<tr><td class="table_left table_nopadding">${UI.keyword(i)}</td><td class="table_right table_nopadding"><span class="numfield">${plusminus(entity.get_stat(i))}</span> `
            if( 'respec' in params ) {
                s+= `<a onclick="ui.sheet_click('${i}',+1,${entity.id})">➕</a> `
                s+= `<a onclick="ui.sheet_click('${i}',-1,${entity.id})">➖</a> `
            }
            s+= `<a onclick="ui.explanation_click('${entity.id}','${i}')">❔</a> `
            s+= `</td>`
            s+= `</tr>`
        }
        s+= `<tr><td>&nbsp;</td></tr>`
      }
      
      // COMBAT
      let COMBAT = {'melee': true, 'defense': true, 'aim': true, 'target': true }
      if( perception > 2 && entity.is_creature()) {
        for( let i in COMBAT ) {
            s+= `<tr><td class="table_left table_nopadding">${i}</td><td class="table_right table_nopadding"><span class="numfield">${plusminus(entity.performance(i))}</span> `
            // s+= `<a onclick="ui.explanation_click('${entity.id}','${i}')">❔</a> `
            // TODO: fix explanation click
            s+= `</td>`
            s+= `</tr>`
        }
        s+= `<tr><td>&nbsp;</td></tr>`
      }

      // EQUIPMENT & INVENTORY
      if( perception > 0 && entity.is_creature() ) {
        let equipped = entity.get_equipped_items()
        if( equipped.length>0 )
          s+= this.print_list( equipped, {label: "equipment"} )
        
        let nonequipped = entity.get_nonequipped_items()
        if( nonequipped.length>0 )
          s+= this.print_list( nonequipped, {label: "inventory"} )
      }
      
      // TRAITS
      if( (perception > 2 && entity.is_creature()) || entity.is_item() ) {
        let traits = entity.get('traits')
        if( !isEmpty(traits) )
          s+= this.print_list(
            Object.keys(traits),
            {label: "traits", display: (x)=>x }
          )        
      }
      
      // STATUSES
      if( perception > 2 && entity.is_creature()) {
        let status = entity.get('status')
        s+= this.print_list(
          Object.keys(status),
          {label: UI.keyword('statuses'), display: (i)=>`${i} (timer: ${entity.status[i].timer}, magnitude: ${entity.status[i].magnitude})`,
            separator: `<br/>`, }
        )
      }

      // CHARACTER POINTS
      if( perception == Infinity ) {
        s+= this.print_list(
          [entity.get('cp')],
          {label: UI.keyword('character points'), display: UI.numfield }
        )
      }
      s+= `</table>`
      
      if( options.debug ) {
        s+= `\n<hr>`
        s+= `<div>`
        s+= `<a onclick="ui.show_sheet(${entity.id}, {respec: true})">✏️edit...</a> |`
        s+= `<a onclick="ui.sheet_level_up(${entity.id})">⬆️level up!</a> |`
        s+= `</div>`
      }
      s+= `</div>`
      return s
    } // print_sheet
    
    show_main() {
      let s = ``      
      s+= this.print_look_around(game.get_player())
      document.getElementById('main').innerHTML = s
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
        document.getElementById('work').innerHTML = this.print_sheet(entity, params)
    }

    explanation(exp) {
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
    show_explanation(exp) {
        document.getElementById('expl').innerHTML = this.explanation(exp)
    }
    explanation_click( entity, stat ) {
        entity = game.entity(entity)
        let e = []
        let n = entity.get_stat(stat, e)
        this.show_explanation(e)
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
      verbs = verbs.filter( (x)=>(VERBS[x].type==type) ).sort((x,y)=>(VERBS[x].sortkey-VERBS[y].sortkey))
      let s = `<tr><td class="table_left">${label}</td><td>`
      for( let i in verbs ) {
        s+= ``+this.verb(verbs[i])+`&nbsp;`
      }
      s+= `</td>`
      s+= `</tr>`
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
    
    print_list(list = [], params = {}) {
      params.label ??= "no label"
      // params.separator ??= " &nbsp; "
      params.separator ??= ", "
      params.left_class ??= "table_left"
      params.right_class ??= "table_right"
      params.prefix ??= ""
      
      let s = `<tr><td class="${params.left_class}">${params.label}</td><td class="${params.right_class}">`
      let first = true
      for( let item of list ) {
        if( first ) {
          first = false
        } else
          s+= params.separator

        s+= params.prefix
        if( 'display' in params ) {
          s+= params.display(item)          
        } 
        else if( item instanceof Entity ) {
          s+= this.print_entity(item)
        } 
        else throw `no way to display list`
      }
      s+= `</td></tr>`
      return s
    }
    
    set_title(title) {
      document.title = title
      document.getElementById('title').innerHTML = title
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
      
      s+= `<table>`
      s+= this.print_verbs( game.get_player() )
      // s+= this.print_equipment( game.get_player() )
      s+= this.print_list( game.get_player().get_equipped_items(),
                          {label: "equipment"} )
      s+= this.print_list( game.get_player().get_nonequipped_items(),
                          {label: "inventory"} )
      s+= `</table>`
      document.getElementById('cmd').innerHTML = s      
    }
    
    add_event(event = {}) {
      if( typeof event == 'string' )
        event = {type: 'text', text: event}
      
      if( 'type' in event == false ) throw `adding event without a type ${event}`
      this.events.push(event)
    }
    
    // execute an event
    // return as string anything to display
    print_event(event = {}) {
      if( 'type' in event == false ) throw `printing event without a type ${event}`
      
      if( event.type == 'text' ) {
        return `<p>`+event.text+`</p>`
      }
      throw `don't know what to do with an event of type `+event.type
    }
    
    // removes events from the queue and displays them
    show_events() {
      let s = ``
      while( this.events.length>0 ) {
        let event = this.events.shift()
        s+= this.print_event(event)
      }
      document.getElementById('work').innerHTML = s
    }
    
    exec(cmd = this.cmd) {
      game.exec(cmd)
      ui.refresh()
      ui.show_events()
    }
        

}

var ui = new UI()
