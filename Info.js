// defines an entity' knowledge about a certain thing
// entities can accumulate knowledge
// while knowledge can be part of requirements for clues, paths, items, etc.
// Knowledge also functions as journal/quests, where one can track progress.

class Info {
  constructor(value = {}, params = {}) {
    for( let i in value )
        this[i] = value[i]
        
    if( !('name' in this) ) throw `Info block needs a name` // Info.name identifies the subject of the info
    // this.text ??= this.name                                 // Info.text shall be displayed when the info is displayed
    // 
    // all other attributes are custom (tag: value); values can be
    // - strings - if a new value is acquired, it overwrites this
    // - numeric - if a new value is required, it is added to this    
  }
  
  // get_text() {
  //   if( typeof this.text == 'string' )
  //     return this.text
  //   if( typeof this.text == 'function' )
  //     return this.text()
  //   throw `unable to get_text for ${this.name}`
  // }
  
  summarize() { return this.name }
  
  // returns this info as text
  get_text() {
    if( 'text' in this && typeof this.text=='string' )
      return this.text
    return this.summarize()
  }
  
  // extends this Info with the info (tag=>value pairs) in attrs
  gain( attrs = {} ) {
    for( let i in attrs ) {
      if( typeof attrs[i] == 'string' )
        this[i] = attrs[i]      // if string, replace it
      if( typeof attrs[i] == 'number' ) {
        this[i] ??= 0
        this[i] += attrs[i]     // if number, add it to the existing number
      }
    }
    return this
  }
  
  // true, if this Info contains AT LEAST as much info as in attrs
  contains( attrs = {} ) {
    for( let i in attrs ) {
      if( !(i in this) ) {
        return false
      }
      else if( i!='name' || i!='text' ) {
        if( typeof attrs[i] == 'string' && attrs[i]!=this[i] )
          return false
        else
        if( typeof attrs[i] == 'number' && attrs[i]>this[i] )
          return false
      }
    }
    return true
  } 

} // class Info
