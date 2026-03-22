
class UI {
  
  static icon(text) {
    if( text in STATS ) return STATS[text].icon
    if( text in POINTS ) return POINTS[text].icon
    if( text in VERBS && 'icon' in VERBS[text] ) return VERBS[text].icon
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
    this.cmd = new Cmd({verb: 'examine'}, {validate: false})
    this.events = []
  }

  refresh() {
    ui.show_main()
    // ui.show_sheet(game.get_player())
    ui.show_commands()
    ui.display_cmd()
    window.scroll(0,0)
  }

  click_entity(id) {
    let entity = game.entity(id)
    options.log_clicks_on_entities && console.log( "clicked on Entity: "+entity.get('name') )

    // if( this.cmd.get_verb().op1 )
    //   this.cmd.op1 = entity
    if( this.cmd.get_verb().op1 && !this.cmd.op1 )
      this.cmd.op1 = entity
    else
    if( this.cmd.get_verb().op1 && !this.cmd.get_verb().op2 )
      this.cmd.op1 = entity
    else
    if( this.cmd.get_verb().op2 && this.cmd.op1 && entity!=this.cmd.op1 )
      this.cmd.op2 = entity
    
    ui.display_cmd()
  }
    
  entity_link(e) {
    let id = game.entity(e).id
    return `ui.click_entity(${id})`
  }
    
  // returns the way the entity appears in html
  // by default, this is a clickable <a > element, where the text is the entity's get_name() value
  // one can add params to change this behavior
  print_entity(id, params = {}) {
    let e = game.entity(id)
    params.label ??= false // this will appear as a link
    params.context ??= false  // the <a > element will be put into this sentence, replacing [entity]
    params.prefix ??= ''
    
    if( !params.label && params.context ) {
      let t = params.context.match(/\[(.*)\]/)
      if( t && t.length>=2 )
        params.label = t[1]
      else
        throw `error when matching regexp: ${params.context}`
    }
    
    let link = `<a class="entity" onclick="${ui.entity_link(e)}">${params.prefix}${params.label || e.get_name()}</a>`
    if( params.context ) {
      return params.context.replace( /\[.*\]/, link )
    }
    return link
    // return `<a class="entity" onclick="${ui.entity_link(e)}">${params.label || e.get_name()}</a>`
  }
    
  print_entity_ministatus(entity, params = {}) {
    entity = game.entity(entity)
    params.icon ??= true
    params.stats ??= true
    
    let s = ``
    s+= `<span class="ministatus">`
    let prefix = ''
    if( params.icon && entity.get('icon') )
      prefix = `<img src='${options.pictures_location}/${entity.get('icon')}' class="combat_icon" /> `
    
    s+= ui.print_entity(entity, {prefix: prefix})
    
    if( params.stats && entity.is_character() ) {
      // s+= " "+UI.icon('body')+entity.get('body')+"/"+entity.get('max_body')        
      s+= " "+UI.icon('body')+entity.get('body')
      s+= " "
      s+= " "+UI.icon('spirit')+entity.get('spirit')
    }
    s+= `</span>`
    return s
  }
    
    click_path(path_id) {
      let path = game.paths[path_id]
      options.log_clicks_on_paths && console.log(`clicked on path with id ${path_id}`)
      if(!path) throw `there is no path with id ${path_id}`

      // hack, should be done with commands!
    // -  path.move_through(game.get_player())
      
      if( ! path.can_pass_through(game.get_player()) )
        throw `${game.get_player()} cannot pass through this.`
      
      ui.exec(new Cmd({verb: 'move', who: game.get_player(), op1: game.entity(path.to)}) )
    }

    print_path(path) {
      let t = path.text.match(/(.*)\[(.*)\](.*)/)
      if( !t || t.length<4 )
        return `<a class="path" onclick="ui.click_path(${path.id})">${path.text}</a>`
      else {
        return t[1]+`<a class="path" onclick="ui.click_path(${path.id})">${t[2]}</a>`+t[3]
      }
    }
    
    print_clue(clue) {
      let s = `<p>${clue.flag+" "}${clue.text}</p>`
      return s
    }
    
    // returns what the player entity sees when looking around in a location
    // - shows the location's interior (description & icon)
    // - show ministatus of characters & items ()
    // TODO: should call the active/player Entity on what the entity can see and return the results, and should only *process* those results here...
    print_look_around(entity) {
      // console.log(`ui.print_look_around`)
      entity = game.entity(entity)
      let location = entity.get_location()
      let entities = game.list_entities_at(location).filter(x=>x.id!=entity.id).sort()

      // style="width: 100%;"
      let s = `<table><tr><td style="vertical-align: top;">`
        if( location.get('interior_icon') ) {
          s+= `<img class='entity_image' src="${options.pictures_location}/${location.get('interior_icon')}"></img>`
        }
      s+= `</td><td style="vertical-align: top;">`
      s+= `<div>${this.print_entity(location)}</div>`
      s+= `<div class="description">${location.get_interior_description()}</div>`
      
      for( let clue of location.location_clues ) {
        if( entity.meets_requirements(clue.reqs) && clue.enabled )
          s += ui.print_clue(clue)
      }
      
      if( ! entity.get_location().is('abstract') ) {
        
        // items with position, printed as part of the description
        // (this without a specific position will be printed later)
        for( let item of entities.filter(x=>(x.is_item()&&x.get('position'))) ) {
          s+= "<p>"+this.print_entity(item, {context: item.get('position')})+"</p>"
        }
        
        s+= `<table>`        
        s+= this.print_list(
          entities.filter(x=>x.is_creature()),
          {label: "others", not_if_empty: true, display: ui.print_entity_ministatus}
        )
  
        s+= this.print_list(
          entities.filter(x=>x.is_item() && !x.get('position')),
          {label: "items", not_if_empty: true, display: ui.print_entity_ministatus}
        )
  
        s+= this.print_list(
          game.paths.filter(x=>( x.has_endpoint(location) && x.can_be_seen_by(entity) )),
          {label: "exists", display: this.print_path, separator: `<br/>`, prefix: "➡️ " }
        )          
        s+= `</table>`
      }

      s+= `</td></tr></table>\n`
      return s
    } // print_look_around
    
    
    print_sheet_stats( entity, params ) {
      let s = ``
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
      return s
    }
    

    // returns the character sheet of the entity
    // this is also what you see if you LOOK at the entity (from outside)
    print_look_at_entity( entity, params = {} ) { return this.print_sheet(entity, params) }
    // sheet( entity, params = {} ) { return this.print_sheet(entity, params) }
    print_sheet( entity, params = {} ) {
      entity = game.entity(entity)
      
      // the optional param 'perception' can limit what is displayed on the charsheet
      let perception = ('perception' in params ? params.perception : Infinity )
      options.log_perception_on_charsheets && console.log( `perception: ${perception}` )
      
      let s = `<table><tr><td style="vertical-align: top;">`
      if( entity.get('icon') ) {
        s+= `<img class='entity_image' src="${options.pictures_location}/${entity.get('icon')}"/>`
      }
      s+= `</td><td style="vertical-align: top;">`
      
      // let s = `<div>`
      s+= ui.print_entity(entity)
      if( options.show_tags ) {
        s+= `<div class="tags">${entity.get('tags').join(" ")}</div>`
      }
      s+= entity.get('description') ? `<div>`+entity.get('description')+`</div>` : ''
      
      // TODO: the below refers to the player, while perception does not; this is inconsistent, let's fix it!
      for( let clue of entity.clues ) {
        if( game.get_player().meets_requirements(clue.reqs) && clue.enabled )
          s += ui.print_clue(clue)
      }
      
      // from here on, the sheet is viewed in a table
      s+= `<table>`      
      if( perception > 2 && entity.is_creature() ) {
        s+= this.print_list(
          [entity.get('level')],
          {label: "level", display: UI.numfield }
        )
      }
      if( perception >= 0 && entity.is_creature() ) {
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
        s+= ui.print_sheet_stats(entity, params)
      }
      
      // COMBAT
      let COMBAT = {'attack': true, 'defense': true, 
                // 'melee': true,
                // 'aim': true, 'target': true
      }
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
      if( perception > 0 && entity.is_creature() || entity.is_open_container() ) {
        let equipped = entity.get_equipped_items()
        if( equipped.length>0 )
          s+= this.print_list( equipped, {label: "equipment", not_if_empty: true, display: ui.print_entity_ministatus} )
        
        let nonequipped = entity.get_nonequipped_items()
        if( nonequipped.length>0 )
          s+= this.print_list( nonequipped, {label: "inventory", not_if_empty: false, display: ui.print_entity_ministatus} )
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
          {label: UI.keyword('statuses'), 
           // display: (i)=>`${i} (timer: ${entity.status[i].timer}, magnitude: ${entity.status[i].magnitude})`,
           display: (i)=>{ return i+ 
                            (entity.status[i].magnitude!=1 ? " (level "+entity.status[i].magnitude+")" : "")+ 
                            (entity.status[i].timer ? " for "+entity.status[i].timer+" rounds" : "") },
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
      s+= `</td></tr></table`
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
      s+= `<select onchange="ui.${callback.name}(this.value);" name="entity_picker">`
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
      <a class="verb" title="${verb.get_text()}" onclick="ui.click_verb('${verb.get_name()}')">${UI.icon(verb.name)+verb.get_label()}</a>
      </span>\n`
      return s
    }
    
    filtered_verbs(verbs, type, params = {}) {
      params.optional ??= false
      params.label ??= type
      verbs = verbs.filter( (x)=>(VERBS[x].type==type) ).sort((x,y)=>(VERBS[x].sortkey-VERBS[y].sortkey))

      let s = ``
      if( !params.optional || verbs.length>0 ) {
        s+= `<tr><td class="table_left">${params.label}</td><td>`
        for( let i in verbs ) {
          s+= ``+this.verb(verbs[i])+`&nbsp;`
        }
        s+= `</td>`
        s+= `</tr>`        
      }
      return s
    }
    
    print_verbs(entity) {
      entity = game.entity(entity)
      let verbs = entity.get_verbs()
      let s = ``
      s+= this.filtered_verbs(verbs, 'combat')
      s+= this.filtered_verbs(verbs, 'action')
      s+= this.filtered_verbs(verbs, 'inventory', {label: "item mgmnt"})
      // s+= this.filtered_verbs(verbs, 'thievery', {optional: true})
      // s+= this.filtered_verbs(verbs, 'misc')
      if( options.debug ) {
        let d = `<table><tr>`
        d+= this.filtered_verbs(verbs, 'debug')
        d+= `</tr></table>`
        document.getElementById('debug').innerHTML += d
      }
      return s
    }
    
    print_list(list = [], params = {}) {
      params.label ??= "no label"
      // params.separator ??= " &nbsp; "
      params.separator ??= ", "
      params.left_class ??= "table_left"
      params.right_class ??= "table_right"
      params.prefix ??= ""
      params.not_if_empty ??= false
      
      if( params.not_if_empty && list.length==0 )
        return ""
      
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
      if( !game.get_player().get_location().is('abstract') ) {
        let verb = cmd.get_verb()
        document.getElementById('who').innerHTML = ui.print_entity_ministatus(game.get_player())
        document.getElementById('verb').innerHTML = verb.get_name()
        document.getElementById('prep').innerHTML = verb.get_prep()
        document.getElementById('op1').innerHTML = ( cmd.op1 ? cmd.get_op1_text() : "" )
        document.getElementById('sep').innerHTML = ( cmd.op2 ? verb.get_sep() : "" )
        document.getElementById('op2').innerHTML = ( cmd.op2 ? cmd.get_op2_text() : "" )        
      }
    }
    
    show_commands() {
      let s = ``
      if( options.debug ) {
        let d = ``
        d+= `Select: ` +ui.entity_list( game.entities, ui.select_entity )
        d+= ` <a onclick="ui.refresh()">refresh</a> |
        <a onclick="game.tick(); ui.refresh();">tick</a> <br/>`
        document.getElementById('debug').innerHTML = d
      }
      
      if( ! game.get_player().get_location().is('abstract') ) {
        s+= `
        <div>
        <span id="who" class="cmd">who</span>: 
        
        <span id="verb" class="cmd">verb</span>
        <span id="prep" class="cmd" >preposition</span>
        <span id="op1" class="cmd" >operand 1</span>
        <span id="sep" class="cmd" >operand separator</span>
        <span id="op2" class="cmd" >operand 1</span>

        &nbsp; <button class="btn" onclick="ui.exec()">⏎</button>
        &nbsp; <button class="btn" onclick="ui.show_sheet(game.get_player())">sheet</button>
        </div>
        `
        
        s+= `<table>`
        s+= this.print_verbs( game.get_player() )
        // s+= this.print_equipment( game.get_player() )
        s+= this.print_list( game.get_player().get_equipped_items(),
                            {label: "equipment", not_if_empty: false, display: ui.print_entity_ministatus} )
        s+= this.print_list( game.get_player().get_nonequipped_items(),
                            {label: "inventory", not_if_empty: true, display: ui.print_entity_ministatus} )
        s+= `</table>` 
      }      
      document.getElementById('cmd').innerHTML = s      
    }
    
    print_background( background ) {
      let s = ``
      if( background.traits ) {
        s+= background.traits.length>1 ? "traits: " : "trait: "
        s+= background.traits.join(", ")
      }
      if( background.inventory ) {
        if( s ) s+= " and "
        s+= background.inventory.length>1 ? "items: " : "item: "
        s+= background.inventory.join(", ")
      }
      let others = Object.keys( STATS ).concat( ["cp"] )
      for( let x of others ) 
        if( x in background ) {
          if( s ) s+= " and "
          s+= x+": "+plusminus(background[x])
        }
      return "starts with "+s
    }
    
    selector( id, options = {}, params = {} ) {
      params.label ??= (x)=>x        
      let s = ``
      s+= `<select id="${id}" onchange="document.getElementById('${id}_info').innerHTML = '('+ui.print_background(game.character_backgrounds[this.value])+')'">`
      for( let o in options )
        s+= `<option value="${o}">${params.label(o, options)}</option>`
      s+= `</select>`
      return s
    }
    
    chargen_sheet(chargen = game.chargen) {
      let s = ``
      s+= `<p>You think, therefore you are. 
      You float between worlds, beyond time and space, 
      voices echo in your mind when you start zooming on someone, somewhere.
      Who are you?</p>
      
      <p>You know the answer. You are called 
      <input type="text" id="chr_name" value="mysterious stranger"/>.
      </p>`
      
      s+= `<p>If you look into a mirror, you would see something like:</p>`
      s+= `<img id="chr_icon" src="${options.pictures_location}/${game.get_player().icon}" class="entity_image" 
          style=""/>`
      s+= `<br/>`
      for( let img of game.character_icons ) {
        s+= `<img src="${options.pictures_location}/${img}" class="entity_image" style="width: 50px;"
              onclick="document.getElementById('chr_icon').src='${options.pictures_location}/${img}'; game.get_player().icon = '${img}' "/>`
      }

      s+= `<p>Through many years of sacrifice, you have learned to become `
      s+= this.selector( 'chr_background', game.character_backgrounds, {label: (x,y)=>(y[x].label || x)} )
      s+= `.`
      s+= `<div id="chr_background_info"></div>`
      s+= `</p>`
      
      // s+= `<table>`
      // s+= ui.print_sheet_stats( game.get_player(), {respec: true} )
      // s+= this.print_list(
      //   [game.get_player().get('cp')],
      //   {label: UI.keyword('character points'), display: UI.numfield }
      // )
      // s+= `</table>`
      
      s+= `
      <p><a class="path" onclick="game.chargen.start()">➡️onward!</a></p>
      `
      return s
    }

    // called when an event happens; the event is added into the event queue;
    // the event queue is displayed when the UI receives control
    add_event(event = {}) {
      if( typeof event == 'string' )
        event = {type: 'text', text: event}
      
      if( 'type' in event == false ) throw `adding event without a type ${event}`
      options.log_events && console.log(event)
      this.events.push(event)
    }
    
    // execute an event
    // return as string anything to display
    print_event(event = {}) {
      if( 'type' in event == false ) throw `printing event without a type ${event}`
      
      if( event.type == 'text' ) {
        return `<p>`+sentence(event.text)+`</p>`
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
    
    click_somewhere() {
      // if( document.getElementById('expl').innerHTML!="" ) 
      //   document.getElementById('expl').innerHTML = ""
    }
    
    // scrollTo(html_id = 'output') {
    //   window.scrollTo(document.getElementById(html_id).getBoundingClientRect() )
    // }
    
    exec(cmd = this.cmd) {
      // document.getElementById('output').style.display = 'none'
      document.getElementById('output').style.animation = null
      document.getElementById('output').offsetHeight
      game.exec(cmd)
      game.end_player_turn()
      ui.refresh()
      ui.show_events()
      // ui.scrollTo()
      // document.getElementById('output').style.display = 'block'
      document.getElementById('output').style.animation = "fadeIn 1s ease-in";
    }
        

}

var ui = new UI()
