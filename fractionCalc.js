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
   * Converts to fraction form, improper or otherwise. Also converts to int for easier handling later
   * Whole number times the denominator plus the original numerator
   *
   * @param {string} operand - Operand validated to be in right format
   * @returns {string} Operand converted to improper fraction form, if it was mixed
   */
  convertToFraction: function (operand) {
    const impFrac = {};

    if (operand.match(/_/)) { // Mixed numbers handling
      const [whole, fraction] = operand.split('_');
      const [numerator, denominator] = fraction.split('/');

      impFrac.numerator = ((parseInt(whole, 10) * parseInt(denominator, 10)) + parseInt(numerator, 10));
      impFrac.denominator = parseInt(denominator, 10);
    } else if (operand.match('/')) {
      // already a fraction
      const splitOperand = operand.split('/');

      impFrac.numerator = parseInt(splitOperand[0], 10);
      impFrac.denominator = parseInt(splitOperand[1], 10);
    } else {
      // already an integer
      impFrac.numerator = parseInt(operand, 10);
      impFrac.denominator = 1;
    }

    return impFrac;
  },

  /**
   *
   *
   */
  convertToMixed: function () {

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

    if (result) {
      console.log(`
        = ${result.negative ? '-' : ''}${result.numerator}/${result.denominator};
      `);
    } else {
      console.log(helpText);
    }
  },

  /**
   *
   *
   */
  findLowestCommonDenominator: function (op1, op2) {
    const lowerDenom = Math.min(op1, op2);
    const iterator = Math.max(op1, op2); // Use the higher denominator to iterate up with
    let x = iterator;

    while (x % lowerDenom > 0) {
      x += iterator;
    }

    return x;
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
      const args = [...process.argv]; // Clone array, we're going to modify it
      args.shift(); // remove non operator/operand

      switch (args[1]) {
        case '+':
          result = this.performAddition(args);
          break;
        case '-':
          result = this.performAddition(args, true);
          break;
        case '*':
          result = this.performMultiplication(args);
          break;
        case '/':
          result = this.performMultiplication(args, true);
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
    function convertToLowestCommonDenominator (fractionArr, lcd) {
      fractionArr.numerator = (lcd / fractionArr.denominator) * fractionArr.numerator;
      fractionArr.denominator = lcd;
    }

    args[0] = this.convertToFraction(args[0]);
    args[2] = this.convertToFraction(args[2]);

    const lowestCommonDenom = this.findLowestCommonDenominator(args[0].denominator, args[2].denominator);

    convertToLowestCommonDenominator(args[0], lowestCommonDenom);
    convertToLowestCommonDenominator(args[2], lowestCommonDenom);

    const result = {
      numerator: args[0].numerator + ((subtract ? -1 : 1) * args[2].numerator),
      denominator: lowestCommonDenom
    };

    // handle negative result
    result.negative = Math.sign(result.numerator) < 0;

    if (result.negative) {
      result.numerator = Math.abs(result.numerator);
    }

    const reducedFraction = this.reduceFraction(result);
    reducedFraction.negative = result.negative;

    return reducedFraction;
  },

  reduceFraction: function (fractionArr) {
    // https://stackoverflow.com/a/23575406
    // Ancient mathematician helping out

    const gcd = function (a, b) {
      if (!b) return a;

      return gcd(b, a % b);
    };

    const divisor = gcd(fractionArr.numerator, fractionArr.denominator);

    return {
      numerator: fractionArr.numerator / divisor,
      denominator: fractionArr.denominator / divisor
    };
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
