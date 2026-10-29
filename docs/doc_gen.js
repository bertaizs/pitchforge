
const fs = require('fs');
// const path = require('path');

require('../www/pf/rules.js')
const populate = require('../tools/populate.js')

// console.log(rules)
// console.log("start")


try {
  const template = fs.readFileSync('docs/pmrpg.md', 'utf8');

  var data = {
    starting_cp: rules.starting_cp(),
    cp_gained_fixed: rules.cp_gained_fixed(),
    cp_gained_variable: rules.cp_gained_variable(),
    cp_gained_increase_per_level: 1/rules.cp_gained_variable(),
    cp_gain_example: ` (you gain ${rules.cp_gained_at_level(2)} cps at level 2 and 3, ${rules.cp_gained_at_level(4)} cps at level 4 and 5, etc)`,
    
  }


  let result = populate(template, data)
  // let result = template
  
  process.stdout.write(result);


  
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
