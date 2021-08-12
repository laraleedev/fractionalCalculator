/** @module fractionCalc */
const inquirer = require('inquirer');

/** @namespace */
const fractionCalc = {
  /**
   * Checks cli arguments for alignment to rules
   * Initially checks for # of args
   *
   * @param {string} input - User input after prompt
   * @returns {boolean} true if args are in expected form, false if not
   */
  argsAreValid: function (input) {
    const errorStr = `
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

    const args = input.split(' ');

    if (!Array.isArray(args) || args.length !== 3) {
      return errorStr;
    }

    return !!(validOperand(args[0]) && validOperator(args[1]) && validOperand(args[2])) || errorStr;
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
   * Takes a fraction object with num/denom/negative bool,
   * checks if it can be converted to mixed. Returns mixed value
   * if converted
   *
   * @param {object} fraction
   * @param {number} fraction.numerator
   * @param {number} fraction.denominator
   * @param {boolean} fraction.negative - If true, fraction is negative
   * @returns {object} Original fraction if no changes, or just a numerator if reduces cleanly,
   *                   or mixed number object
   *
   */
  convertToMixed: function (fraction) {
    const converted = {};
    converted.negative = fraction.negative;
    const decimalForm = fraction.numerator / fraction.denominator;

    if (Number.isInteger(decimalForm)) {
      converted.numerator = fraction.numerator / fraction.denominator;
    } else if (decimalForm > 1) {
      converted.whole = parseInt(fraction.numerator / fraction.denominator, 10);
      converted.numerator = fraction.numerator % fraction.denominator;
      converted.denominator = fraction.denominator;
    } else { // Less than 1, no changes required
      return fraction;
    }

    return converted;
  },

  /**
   * Handles displaying result
   *
   * @param {object} result
   * @param {number} result.numerator
   * @param {number} result.denominator
   * @param {boolean} result.negative - true if negative, falsy if not
   * @param {number} result.whole - integer value of a mixed number if given
   */
  displayText: function (result) {
    console.log(`
      = ${result.negative ? '-' : ''}${result.whole ? result.whole + '_' : ''}${result.numerator}${result.denominator ? '/' + result.denominator : ''};
    `);
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
   * sends result to be displayed
   */
  main: function () {
    inquirer
      .prompt([
        {
          name: 'equation',
          message: '?',
          validate: this.argsAreValid
        }
      ])
      .then((answers) => {
        let result;
        const args = answers.equation.split(' ');

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
      })
      .catch((error) => {
        console.log('error ', error);
        if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment

        } else {
        // Something else went wrong
          console.log('asldkjf ');
        }
      });
  },

  /**
   * Handles addition and subtraction, which is just addition on a bad day (cause it's just negative)
   *
   * Future stuff:
   * - handling negative numbers should be as simple as flagging a fraction as negative,
   * then after finding common denominator, putting the negative back onto the numerator calculation.
   * Requires upgrading input validation first
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

    // Actual addition/subtraction calculation is done
    const result = {
      numerator: args[0].numerator + ((subtract ? -1 : 1) * args[2].numerator),
      denominator: lowestCommonDenom
    };

    // handle negative result
    result.negative = Math.sign(result.numerator) < 0;

    if (result.negative) {
      result.numerator = Math.abs(result.numerator);
    }

    // Simplify fraction
    const reducedFraction = this.reduceFraction(result);
    reducedFraction.negative = result.negative;

    return this.convertToMixed(reducedFraction);
  },

  /**
   *
   * @param {*} fractionArr
   * @returns
   */
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
   * Handles multiplication and division
   *
   * @param {string[]} args - Array of validated argument strings from cli
   * @param {*} division
    * @returns {string} Result of calculation
   */
  performMultiplication: function (args, division) {
    console.log('multiplication args ', args);
  }
};

module.exports = fractionCalc;
