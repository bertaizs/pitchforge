
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

    this.requirements ??= {}

    this.fn ??= (cmd)=>"nothing happens"
  }

  viable_for(who) {
    return game.entity(who).meets_requirements(this.requirements)
  }

  // executes the given choice
  make() {
    console.log(`making choice: ${this.label}`)
    let cmd
    if( 'cmd' in this ) {
      cmd = this.cmd
      // console.log(`command`, this.cmd)
      // game.exec(this.cmd)
    } else {
      cmd = new Cmd({verb: 'custom', fn: this.fn})
      // cmd.verb = 'custom'
      // cmd.fn = this.fn      
    }
    console.log(`command`, cmd)
    let r = game.exec(cmd)      
  }

}


// the list can have two type of Choices
// * one with a tag; this tag must be unique
// * untagged, they are just a list
class ChoiceList {

  constructor(values = {}) {
    this.arr ??= values.arr || []
    this.hash ??= values.hash || {}
    // for (let i in value) this[i] = value[i];
  }

  add( choice, tag = false ) {
    if( !tag ) { // if no tag, add the choice with a number as its tag
      this.arr.push(choice)
      return this
    }
    
    if( tag in this.hash )    // if tag is already in the list, do not add and return false
      return false

    this.hash[tag] = choice   // add the choice with a tag
    return this
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
