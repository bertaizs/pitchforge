
class Path {
  
  constructor(value = {}) {
    for (let i in value) this[i] = value[i];

    if( !('from' in this) || !('to' in this) )
      throw `defining path without two endpoints`
    
    if( this.from instanceof Entity )   // this.from must be an *id* of an Entity
      this.from = this.from.id
    if( this.to instanceof Entity )     // this.to must also be an *id* of an entity
      this.to = this.to.id
    
    this.twoway ??= true
    
    this.text ??= `a path leads somewhere`
    this.reverse_text ??= this.text
    
    this.perception_needed ??= -Infinity
    
    // register this Path into game.paths, this.id is the index
    this.id = game.paths.push(this)-1
  }
  
  toString() {return JSON.stringify(this)}
  
  
  has_endpoint(location) {
    location = game.entity(location)
    return  this.from == location.id ||
            this.to == location.id
  }
  
  // true if the entity can see the given path
  // based on the entity's perception or knowledge
  can_be_seen_by(entity) {
    entity = game.entity(entity)
    return entity.performance('perception')>=this.perception_needed
  }
  
  // true if the entity can traverse through the path
  // based on the entity's size and abilities, etc
  can_pass_through(entity) {
    return true // TODO, not implemented
  }
  
  move_through(entity, endpoint_id = false) {
    entity = game.entity(entity)
    if(!endpoint_id)
      endpoint_id = entity.get_location().id
    
    if(!this.can_pass_through(entity))
      throw `${entity} cannot pass through ${this}`
    
    if( endpoint_id == this.from )
      entity.move_to(this.to)
    else
    if( endpoint_id == this.to )
      entity.move_to(this.from)
    else
      throw `cannot relate entity ${entity} to path ${this} so cannot pass through it`
  }
  
  // path endpoints have:
  // - location id
  // - perception requirement
  // - knowledge requirement ???
  // - text
  // 
  // the path can be
  // - bidirectional or unidirectional
  // - open or blocked
  
}
