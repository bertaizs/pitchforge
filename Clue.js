
class Clue {
  
  constructor(value, params = {}) {
    for (let i in value) 
      this[i] = value[i]
    
    this.enabled ??= true // clue is not displayed if false
    // this.flag ??= ''      // appears before the clue, e.g. ❗
    this.flag ??= ''
    if( this.flag === true ) this.flag = '❗'
    this.reqs ??= []      // a list of requirement objects
    this.text ??= `default clue text`
    
    if( 'register' in params )
      game[params.register] = this
  }
  
  get_text() {
    if( typeof this.text == 'string' )
      return this.text
    if( typeof this.text == 'function' )
      return this.text()
  }
  
}
