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
    // console.log(entity)
    // console.log(this)
    return entity.meets_requirements( this.reqs )
    // entity = game.entity(entity)
    // return entity.performance('perception')>=this.perception_needed
  }
  
  // true if the entity can traverse through the path
  // based on the entity's size and abilities, etc
  can_pass_through(entity) {
    return true // TODO, not implemented
  }
  
  move_through(entity, endpoint_id = false) {
    entity = game.entity(entity)
    
    if(!this.can_pass_through(entity))
      throw `${entity} cannot pass through ${this}`
    
    entity.move_to(this.to)
  }
  
}
