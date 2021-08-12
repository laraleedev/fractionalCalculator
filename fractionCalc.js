/** @module fractionCalc */

/** @namespace */
const fractionCalc = {
  /**
   * Checks cli arguments for alignment to rules
   * Initially checks for # of args
   *
   * @param {string[]} args - Array of argument strings from cli
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
   * Checks for and converts any found mixed operands to improper fraction form
   *
   * @param {string} operand - Array of validated argument strings from cli
   * @returns {string} Operand converted to improper fraction form, if it was mixed
   */
  convertMixedToImproper: function (operand) {
    if (operand.match(/_/)) {
      const [whole, fraction] = operand.split('_');
      const [numerator, denominator] = fraction.split('/');

      return ((parseInt(whole, 10) * parseInt(denominator, 10)) + parseInt(numerator, 10)) + '/' + denominator;
    } else {
      return operand;
    }
  },

  /**
   *
   *
   */
  convertImproperToMixed: function () {

  },

  /**
   * Handles displaying help text
   *
   * @param {string} result - If given, displays result. Otherwise shows help text
   */
  displayText: function (result) {
    const helpText = `
      Fractional Calculator
      
      Accepts space deliminated arguments in the form of operators (+, -, *, /)
      and operands (whole numbers, fractions, improper fractions, mixed numbers).
      Order should be operand operator operand.
      Mixed numbers should be in the form whole_numerator/denominator
  
      Examples: 
          npm start 3/4 + 1/2
          npm start 1 * 1_4/5
          npm start 7/6 / 5/4
      `;

    console.log(result || helpText);
  },

  /**
   *
   *
   */
  findLowestCommonDenominator: function (op1, op2) {
    // const denom1 = op1.split('/')[1];
  },

  /**
   * Starting point. Processes args, figures out which operation is being performed,
   * displays result
   */
  main: function () {
    let result;
    if (!this.argsAreValid(process.argv)) {
      this.displayText();
    } else {
      switch (process.argv[2]) {
        case '+':
          result = this.performAddition(process.argv);
          break;
        case '-':
          result = this.performAddition(process.argv, true);
          break;
        case '*':
          result = this.performMultiplication(process.argv);
          break;
        case '/':
          result = this.performMultiplication(process.argv, true);
          break;
        default:
          this.displayHelp();
          break;
      }

      this.displayText(result);
    }
  },

  /**
   * Handles addition and subtraction, which is just addition on a bad day (cause it's just negative)
   *
   * @param {string[]} args - Array of validated argument strings from cli
   * @param {boolean} subtract - If true, performs subtraction. Addition when false
   * @returns {string} Result of calculation
   */
  performAddition: function (args, subtract) {
    args[1] = this.convertMixedToImproper(args[1]);
    args[3] = this.convertMixedToImproper(args[3]);

    this.findLowestCommonDenominator(args[1], args[3]);

    console.log('args ', args);
  },

  /**
   * Handles multiplication and
   *
   * @param {string[]} args - Array of validated argument strings from cli
   * @param {*} division
    * @returns {string} Result of calculation
   */
  performMultiplication: function (args, division) {

  }
};

module.exports = fractionCalc;
