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

  add(x = {label: "no label", value: 0}) {
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
    this.tier ??= 1
    this.type ??= 'body'
    this.element ??= 'kinetic'

    this.ignore_armor ??= false
  }  
}
function Dmg(x) { return new Damage(x) }
