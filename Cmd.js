/*
A Cmd (Command) is a specific action, which always refers to a verb
and it may also have one or more parameters, based on what parameters
the verb may have.
*/


class Cmd {
    constructor(value = {}, params = {}) {
        params.validate ??= true
      
        for( let i in value )
            this[i] = value[i]
        
        this.who ??= game.get_player()
    
            
            // Cmd shall always have an attr called verb
            // which must point to VERBS
        if( !('verb' in this) )
          throw `missing verb in command: ${this}`        
        if( typeof this.verb!='string' || !(this.verb in VERBS) )
          throw `invalid verb in command: ${this.verb}`
        let verb = VERBS[this.verb]

        this.op1 ??= false
        if( this.op1 ) this.op1 = game.entity(this.op1)
        this.op2 ??= false
        if( this.op2 ) this.op2 = game.entity(this.op2)
        this.param ??= false

        this.separator ??= false
        
        if( params.validate ) this.validate()
    }
    
    get_verb() { return VERBS[this.verb] }
    
    get_as_text(attr_name) {
      if( this[attr_name] instanceof Entity ) {
        return this[attr_name].get_name()
      }      
      if( typeof this[attr_name] == 'string' ) {
        return this[attr_name]
      }
      if( this[attr_name] == false ) {
        throw `getting empty attribute as string (${attr_name})`
        // return "..."
      }
      throw `not implemented ${attr_name} for ${this.op1}`
    }

    get_op1_text() {
      return this.get_as_text('op1')
    }
    
    get_op2_text() {
      return this.get_as_text('op2')
    }

    // checks if an attribute of the command matches pattern
    // - attr_name is the name of the attribute of this Cmd;
    //   the attribute is a string, an Entity or false (for empty)
    // - pattern is an Entity or a regexp
    // return true or false
    // not called directly, but from match()
    _match( attr_name, pattern ) {
      
      if( typeof this[attr_name] == 'string' ) {
        options.log_matching_details2 && console.log(`matching string vs regexp`)
        return Boolean(this[attr_name].match(pattern))
      }
      
      if( this[attr_name] instanceof Entity ) {
        if( pattern instanceof Entity ) {
          options.log_matching_details2 && console.log(`Entity vs Entity`)
          return this[attr_name].id == pattern.id          
        }
        
        options.log_matching_details2 && console.log(`Entity vs regexp`)
        return Boolean(this[attr_name].get_name().match(pattern))
      }
      
      if( this[attr_name] == false ) {
        options.log_matching_details2 && console.log(`nothing vs regexp`)
        return Boolean("".match(pattern))
      }
      
      throw `don't know how to match ${this[attr_name]} with ${pattern}`
    } // _match
    
    // calls _match, wraps around logging
    match( attr_name, pattern ) {
      options.log_matching_details && console.log(`matching ${this[attr_name]} with ${pattern}...`)
      let b = this._match(attr_name, pattern)
      if( b )
        options.log_matching_details && console.log(`match found.`)
      else
        options.log_matching_details && console.log(`not matching.`)
      return b
    }
    
    // validate if this Cmd is syntactically correct
    // with all mandatory fields populated
    // throws an exception or returns true
    validate() {
        let verb = this.get_verb()
        if( verb.op1 && !this.op1 )
        throw `mandatory op1 missing! (command: ${this.verb})`
        return true
    }
    
    toString() {return JSON.stringify(this)}
}
