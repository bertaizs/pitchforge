// defines an entity' knowledge about a certain thing
// entities can accumulate knowledge
// while knowledge can be part of requirements for clues, paths, items, etc.
// Knowledge also functions as journal/quests, where one can track progress.

class Info {
  
  constructor(value = {}, params = {}) {
    if( typeof value == 'string' )
      value = {tag: value, value: true}
    
    for( let i in value )
        this[i] = value[i]
    if( !('tag' in this) ) throw `Info block needs a tag` // Info.name identifies the subject of the info
    // this.tag         // is a unique id of what the info is about
    // this.category    // info may belong to a category, so that similar infos can be displayed together
    // this.text        // textual description of the info, optional
    this.value ??= true // actual value of the information
  }
  
  // returns a list of printable data strings that can be displayed
  // redefine this if needed
  summarize() {
    if( 'text' in this )
      return this.text
    else
      return this.tag+`: `+this.value
  }
  
  contains( other_info ) {
    if( !(other_info instanceof Info) ) 
      other_info = new Info(other_info)
    
    console.log(other_info)
    
    if( this.tag != other_info.tag ) return false
    
    if( other_info.value === true )
      return true
    
    if( typeof this.value == 'number' && typeof other_info.value == 'number' )
      return (this.value >= other_info.value)
    
    return (this.value == other_info.value)
  }
  
  // extends this Info's value with the received one
  // numbers are added
  // everything else is overwritten
  extend_with( value ) {
    if( typeof this.value=='number' && typeof value=='number' )
      this.value += value
    else
      this.value = value
    return this.value
  }
    
    
} // class Info
