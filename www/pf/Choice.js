
// these are offered to the player to choose from
// a Choice can have:
// * a cmd (in its attribute cmd), or
// * a custom function
// the latter are also executed via game.exec(cmd), via Verb 'custom'
// 
// Choices are often organized into a ChoiceList (also in this file)
class Choice {
  
  constructor(value = {}) {
    for (let i in value) this[i] = value[i];

    this.label ??= `choose me`
    this.sortkey ??= 0
    // this.cmd
    if( 'cmd' in this && !(this.cmd instanceof Cmd) )
      this.cmd = new Cmd(this.cmd)

    this.reqs ??= {}

    this.fn ??= (cmd)=>"nothing happens"
    if( typeof this.fn == 'string' && game.fn_exists(this.fn) )
      this.fn = game.get_fn(this.fn)
  }

  viable_for(who) {
    return game.entity(who).meets_requirements(this.reqs)
  }

  // executes the given choice
  make() {
    // console.log(`making choice: ${this.label}`)
    let cmd
    if( 'cmd' in this ) {
      cmd = this.cmd
    } else {
      cmd = new Cmd({verb: 'custom', fn: this.fn})
      if( 'clicked_entity_as' in this )
        cmd[this.clicked_entity_as] = this[this.clicked_entity_as]
    }
    // console.log(`command`, cmd)
    ui.cmd = cmd
    let r = game.exec(cmd)      
  }

}


// the list can have two type of Choices
// * one with a tag; this tag must be unique
// * untagged, they are just a list
class ChoiceList {

  constructor(values = false) {
    this.arr = []
    this.hash = {}

    if( Array.isArray(values) ) {
      this.arr = values
    }
    // this.arr ??= values.arr || []
    // this.hash ??= values.hash || {}
    // for (let i in value) this[i] = value[i];
  }

  add( choice, tag = false ) {
    if( !(choice instanceof Choice) ) // ensure we are using a Choice
      choice = new Choice(choice)
    
    if( !tag ) { // if no tag, add the choice with a number as its tag
      this.arr.push(choice)
      return this
    }
    
    if( tag in this.hash )    // if tag is already in the list, do not add and return false
      return this

    this.hash[tag] = choice   // add the choice with a tag
    return this
  }

  // TODO: retire, replaced by add
  add_quick( choice_data, tag = false ) {
    this.add( new Choice(choice_data), tag )
    return this
  }

  add_verb( verb, cmd, op, params = {} ) {
    if( !(verb in VERBS) )
      throw `unknown verb: ${verb}, cannot add such a choice`

    this.add( new Choice({
        label: params['label'] ?? `${verb} ${the(op)}`,
        cmd: {who: cmd.who, verb: verb, op1: op},
        reqs: VERBS[verb].req,
        sortkey: params['sortkey'] ?? VERBS[verb].sortkey
      }), verb  )
  }

  // removes any Choices with the given tag from this ChoiceList
  remove(tag) {
    delete this.hash[tag]
  }

  // return all Choices as a list (i.e. without tags, only sorting by a sortkey)
  get_list() {
    return Object.values(this.hash).concat(this.arr).sort( (a, b) => a.sortkey - b.sortkey )
  }

  // combine all Choices in ChoiceList withList into this ChoiceList
  merge( withList ) {
    this.arr = this.arr.concat(withList.arr)  // arrays are just appended
    for( let i in withList.hash )
      this.add(withList.hash[i], i)           // for tagged choices, if the tag already exists, the duplicate is dropped

    return this
  }

}
