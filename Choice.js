class Choice {
  
  constructor(value = {}, reverse = {}) {
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

    // console.log( `r`, r)
    // console.log('*******')
    
    // return this.action(cmd)
  }

}
