/**
 * Checks cli arguments for alignment to rules
 *
 * @param {string[]} args - Array of argument strings
 * @returns {boolean} true if args are in expected form, false if not
 */
function argsAreValid (args) {
  if (args.length !== 5) {
    return false;
  }

  function validOperand (operand) {
    // Checks specific case of mixed number not having full fractional component
    // Adds protection against something like 1_0/1 or 0_1/1
    if (operand.match(/_/)) {
      if (!operand.split('_')[1].match(/^[1-9][0-9]*\/[1-9][0-9]*$/)) {
        console.log('alsdkfj');
        return false;
      }
    }

    // Checks for mixed number, integer, fraction (improper or otherwise)
    // Prevents divide by zero situations
    // DOES allow value zero fractions like 0/2
    return operand.match(/^(?:[1-9][0-9]*_)*[0-9][0-9]*(?:\/[1-9][0-9]*)*$/);
  }

  function validOperator (operator) {
    return operator.match(/[+\-*/]/);
  }

  // console.log('arg 3', args[2]);
  // console.log('arg 4', args[3]);
  // console.log('arg 5', args[4]);
  // console.log('3', validOperand(args[2]));
  // console.log('4', validOperator(args[3]));
  // console.log('5', validOperand(args[4]));
  // console.log(validOperand(args[2]) && validOperator(args[3]) && validOperand(args[4]));

  return validOperand(args[2]) && validOperator(args[3]) && validOperand(args[4]);
}

/**
 * Handles displaying help text
 */
function displayHelp () {
  console.log(
    `
    Fractional Calculator
    
    Accepts space deliminated arguments in the form of operators (+, -, *, /)
    and operands (whole numbers, fractions, improper fractions, mixed numbers).
    Order should be operand operator operand.
    Mixed numbers should be in the form whole_numerator/denominator

    Examples: 
        node fractionCalc.js 3/4 + 1/2
        node fractionCalc.js 1 * 1_4/5
        node fractionCalc.js 7/6 / 5/4
    `
  );
}

/**
 *
 */
function main () {
  if (!argsAreValid(process.argv)) {
    displayHelp();
  } else {
    console.log('do stuff here');
  }
}

main();
