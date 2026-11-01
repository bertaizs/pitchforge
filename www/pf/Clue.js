
class Clue {
  
  constructor(value, params = {}) {
    for (let i in value) 
      this[i] = value[i]
    
    this.enabled ??= true // clue is not displayed if false
    // this.flag ??= ''      // appears before the clue, e.g. ❗
    this.flag ??= true
    if( this.flag === true ) this.flag = '❗'
    this.reqs ??= []      // a list of requirement objects
    this.text ??= `default clue text`
    // this.info 
    
    if( 'register' in params )
      game[params.register] = this
  }
  
  get_text() {
    if( typeof this.text == 'string' )
      return this.text
    if( typeof this.text == 'function' )
      return this.text()
  }
  
  // returns any this.info array
  // if there is none, returns []
  // if it is not an array, it converts in into an array
  get_info() {
    if(! ('info' in this) ) return []
    let t = this.info
    if(! (t instanceof Array) )
      t = [t]
    return t
  }
  
}
