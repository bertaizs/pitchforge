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
