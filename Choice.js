class Choice {
  
  constructor(value = {}, reverse = {}) {
    for (let i in value) this[i] = value[i];

    this.label ??= `choose me`

    this.action ??= (cmd)=>"nothing happens"
  }

  make(cmd) {
    console.log(`making choice: ${this.label}`)
    return this.action(cmd)
  }

}
