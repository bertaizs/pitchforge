// a Path leads from one Entity to another
// entities can pass through Paths
// a Path is in one direction only, but one can easily create
// another Path object in the reverse direction

class Path {
  
  constructor(value = {}, reverse = {}) {
    for (let i in value) this[i] = value[i];

    if( !('from' in this) || !('to' in this) )
      throw `defining path without two endpoints`
    
    if( this.from instanceof Entity )   // this.from must be an *id* of an Entity
      this.from = this.from.id
    if( this.to instanceof Entity )     // this.to must also be an *id* of an entity
      this.to = this.to.id
    
    this.text ??= `a path leads somewhere`
    
    this.door ??= false
    if( this.door instanceof Entity )
      this.door = this.door.id
    
    this.reqs ??= []  // requirements for being able to use this path
    
    // this.perception_needed ??= -Infinity
    
    // register this Path into game.paths, this.id is the index
    this.id = game.paths.push(this)-1

    // if reverse is provided, we create another Path in the opposite direction
    // populating it based on the info in this overwritten by the reverse
    if( ! isEmpty(reverse) ) {
      // create reverse path
      let rev = {}
      for(let i in value)
        rev[i] = value[i]
      for( let i in reverse )
        rev[i] = reverse[i]
      rev.from = this.to
      rev.to = this.from
      
      let reverse_path = new Path(rev, {})
      this.reverse_id = reverse_path.id
      reverse_path.reverse_id = this.id      
    }
  }
  
  toString() {return JSON.stringify(this)}
  
  get_reverse() { return game.paths[this.reverse_id] }
  
  has_endpoint(location) {
    location = game.entity(location)
    return  this.from == location.id
  }
  
  // true if the entity can see the given path
  // based on the entity's perception or knowledge
  can_be_seen_by(entity) {
    return entity.meets_requirements( this.reqs )
  }
  
  // true if the entity can traverse through the path
  // based on the entity's size and abilities, etc
  can_pass_through(entity) {
    // canNOT pass through if there is a door and it is locked
    if( this.door && game.entity(this.door).is('closed') )
      return false
    
    return true // TODO, not implemented
  }
  
  // called when moving through this path; redefine if you need a custom event
  // returns true if successful; if false, then the move does not happen
  on_move_through(cmd) { return true }
  
  move_through(cmd) {
    let entity = cmd.who

    if(!this.can_pass_through(entity)) {
      // throw `${entity} cannot pass through ${this}`
      ui.text(entity, ` cannot pass through.`)
      cmd.verb = 'nop'
      return false
    }
    
    if( this.on_move_through(cmd) ) {
      entity.move_to(this.to)
      return true
    } else {
      cmd.verb = 'nop'
      return false      
    }
  }
  
}
