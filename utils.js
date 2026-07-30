
// return a random number between 0 and n-1
function random(n) {
    return Math.floor( Math.random()*n )
}

// rolls an n-sided die and returns the result
function die_roll(n=6) {
  return random(n)+1
}

// return a string with "+z" or "-z". 0 also becomes "+0"
function plusminus(z) {
    if( z>=0 ) return "+"+z
    else return ""+z
}

function tags( str = "" ) {
    let t = str.split( /[ ]*,[ ]+/ )
    let o = {}
    for( let i in t ) {
        if( t[i] != "" ) {
            let tal = t[i].match( /(.+):[ ]*(\d+)/ )
            if( tal )
                o[tal[1]] = parseInt(tal[2])
            else
                o[t[i]] = true
        }
    }
    return o
}

function pick_one( fromArray ) {
    if( fromArray.length==0 ) throw `cannot pick from empty array`
    return fromArray[random(fromArray.length)]
}

function sentence( str, str2 = "" ) {
    return str.charAt(0).toUpperCase() + str.slice(1) + " " + str2;
}

function starts_with_capital(str) {
  return /^[A-Z]/.test(str);
}

function the(noun) {
  if(starts_with_capital(noun) || /^(a |an )/.test(noun) )
    return noun
  return "the "+noun
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function arrayify(x) {
  if (Array.isArray(x)) return x
  else return [x]
}
