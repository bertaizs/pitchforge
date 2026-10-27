// various mini classes

class Explanation {
  constructor(value = {}) {
    for( let i in value )
        this[i] = value[i]

    this.explain ??= []
    this.label ??= 'no explanation label'
    this.who ??= undefined
    this.result ??= 0
  }

  add(x = {label: "no label", value: 0, fixed: false}) {
    this.explain.push(x)
  }
}
function Exp(x) { return new Explanation(x) }



class Damage {
  constructor(value = {}) {
    if( typeof value == 'number' )
      value = {value: value}
    for( let i in value )
        this[i] = value[i]

    this.value ??= 2
    this.tier ??= 1   // weapon damage
    this.type ??= 'body'
    this.element ??= 'kinetic'

    this.ignore_armor ??= false
  }

  toString() {
    let vs = ''
    if( this.type != 'body' )
      vs = `vs ${this.type}`
    return `${this.value} points of ${this.element} damage ${vs} (tier ${this.tier})`
  }
}
function Dmg(x) { return new Damage(x) }


class Requirements {
  constructor(value = {}) {
    for( let i in value )
        this[i] = value[i]

    this.traits ??= {}
    this.knowledge ??= []
    this.knowledge = arrayify(this.knowledge)
    this.items ??= []
    this.items = arrayify(this.items)
    this.equipment ??= []
  }  
}
function Reqs(x) { return new Requirements(x) }


class Value {

  constructor(value, p = {}) {
    this.value = value
    for( let i in p)
      this[i] = p[i]
    this.explanation ??= ``   // explanation
    this.who ??= false        // to whom (entity) the value belongs to
    this.what ??= false       // what is the value about
  }

  valueOf() { return this.value }
  get() { return this.valueOf() }
  toString() { return this.valueOf()+"" }
  
  explain(str) { 
    this.explanation += str
    return this
  }
  get_expl() { return this.explanation }
  get_expl_b64() { return btoa(this.get_expl()) }

  get_label() {
    if( !this.who )
      return `static value`
    else
      return this.who.get_name() +( this.what ? "'s "+this.what : '' ) 
  }
}
