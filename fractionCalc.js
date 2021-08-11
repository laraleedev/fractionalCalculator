const fractionCalc = {
/**
  * Checks cli arguments for alignment to rules
  *
  * @param {string[]} args - Array of argument strings
  * @returns {boolean} true if args are in expected form, false if not
  */
  argsAreValid: function (args) {
    if (!Array.isArray(args) || args.length !== 4) {
      return false;
    }

    function validOperand (operand) {
    // Checks specific case of mixed number not having full fractional component
    // Adds protection against something like 1_0/1 or 0_1/1
      if (operand.match(/_/)) {
        if (!operand.split('_')[1].match(/^[1-9][0-9]*\/[1-9][0-9]*$/)) {
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

    return validOperand(args[1]) && validOperator(args[2]) && validOperand(args[3]);
  },

  /**
   * Handles displaying help text
   */
  displayHelp: function () {
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
  },

  /**
   *
   */
  main: function () {
    if (!this.argsAreValid(process.argv)) {
      this.displayHelp();
    } else {
      console.log('do stuff here');
    }
  }
};

module.exports = fractionCalc;
