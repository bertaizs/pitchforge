/*


tough + 


calc = {
    type: "min",
    
    data: [
      
    ],

    tough: +2,
    charm: +1,
  
min = {
    tough: +2,
    charm: +1,
  }

}


*/



class Calc {
  
  constructor( input ) {
    if( typeof input == 'object' ) {
      for( let i in input )
        this[i] = input[i]
    }
    else
    if( typeof input == 'string' ) {
      console.log( string )
    }
    throw "invalid Calc"
  }
  
}
