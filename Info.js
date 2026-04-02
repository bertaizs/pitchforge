// defines an entity' knowledge about a certain thing
// entities can accumulate knowledge
// while knowledge can be part of requirements for clues, paths, items, etc.
// Knowledge also functions as journal/quests, where one can track progress.

class Info {
  constructor(value = {}, params = {}) {
    for( let i in value )
        this[i] = value[i]
    // if( !('name' in this) ) throw `Info block needs a name` // Info.name identifies the subject of the info
  }
  
  // returns a list of printable data strings that can be displayed
  summarize() {
    let t = []
    // for( let i of Object.keys(this).sort() )
    for( let i in this )
      if( typeof this[i]=='string' && !i.match(/^_/) )
        t.push(this[i])
    return t
  }
    
  // extends this Info with the (tag=>value) pairs in attrs
  gain( attrs = {} ) {
    for( let i in attrs ) {
      this[i] = attrs[i]
    }
    return this
  }
  
  // true, if this Info contains all the tags in attrs
  contains( attrs = {} ) {
    for( let i in attrs ) {
      if( !(i in this) ) {
        return false
      }
    }
    return true
  }

} // class Info
