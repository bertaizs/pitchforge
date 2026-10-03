
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


function capitalize( str ) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}


function starts_with_capital(str) {
  return /^[A-Z]/.test(str);
}

function starts_with_an(str) {
  return /^(a |an )/.test(str)
}

function starts_with_the(str) {
  return /^(the |The )/.test(str)
}


function the(noun) {
  if(starts_with_capital(noun) || starts_with_an(noun) )
    return noun
  return "the "+noun
}

function deHtml(str) {
  return str.replace(/<[^>]*>?/gm, '');
}



function capitalizeFirstWordHTML(html) {
  if (!html || typeof html !== 'string') return '';

  // Matches leading HTML tags or non-letter characters, then captures the first letter.
  // Using unicode property escape \p{L} to support international letter characters.
  return html.replace(
    /^((?:<[^>]*>|[^<\p{L}])*?)(\p{L})/u,
    (_, prefix, firstLetter) => prefix + firstLetter.toUpperCase()
  );
}

/**
 * Ensures an HTML string ends with a punctuation mark (., !, ?, or )).
 * Inserts a period before any trailing closing HTML tags if needed.
 */
function ensureEndingPunctuation(html) {
  if (!html || typeof html !== 'string') return '';

  // Step 1: Extract any closing HTML tags or trailing whitespace at the very end.
  const match = html.match(/(?:\s*<\/?[^>]+>|\s)*$/);
  const trailingMarkup = match ? match[0] : '';
  
  // Step 2: Get the content preceding those trailing tags/spaces.
  const mainContent = html.slice(0, html.length - trailingMarkup.length);

  // If there's no actual content before trailing tags, return original input.
  if (!mainContent.trim()) return html;

  // Step 3: Check if the last visible character is a valid punctuation mark.
  const validEndings = ['.', '!', '?', ')'];
  const lastChar = mainContent.trim().slice(-1);

  if (validEndings.includes(lastChar)) {
    return html;
  }

  // Step 4: Insert '.' directly after the main content, before closing tags.
  return mainContent + '.' + trailingMarkup;
}

function sentence( str ) {
  str = capitalizeFirstWordHTML(str)
  str = ensureEndingPunctuation(str)
  return str
    // return str.charAt(0).toUpperCase() + str.slice(1) + " " + str2;
}


function clone(obj) {
  let o2 = {}
  for( let i in obj)
    o2[i] = obj[i]
  return o2
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function arrayify(x) {
  if (Array.isArray(x)) return x
  else return [x]
}
