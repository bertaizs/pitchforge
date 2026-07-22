class Choice {
  
  constructor(value = {}) {
    for (let i in value) this[i] = value[i];

    this.label ??= `choose me`
    this.sortkey ??= 0

    this.fn ??= (cmd)=>"nothing happens"
  }

  make(cmd) {
    console.log(`making choice: ${this.label}`)

    if( 'cmd' in this ) {
      game.get_player().exec(this.cmd)
    } else {
      cmd.verb = 'custom'
      cmd.fn = this.fn
      cmd = new Cmd(cmd)
      
      console.log(`command`, cmd)
      
      let r = cmd.who.exec(cmd)      
    }

  }

}


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

  remove(tag) {
    delete this.hash[tag]
  }

  // return the choices as a list (i.e. without tags, only sorting by a sortkey)
  get_list() {
    return Object.values(this.hash).concat(this.arr).sort( (a, b) => a.sortkey - b.sortkey )
  }

  merge( withList ) {
    this.arr = this.arr.concat(withList.arr)
    for( let i in withList.hash )
      this.add(withList.hash[i], i)

    return this
  }

}
