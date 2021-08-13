/** @module fractionCalc */
const inquirer = require("inquirer");

/** @namespace */
const fractionCalc = {
  /**
   * Type definition
   * @typedef {Object} FractionObj
   * @property {number} numerator
   * @property {number} [denominator]
   * @property {boolean} [negative] - True if fraction is negative, falsy otherwise
   * @property {number} [whole] - The integer part of the mixed number, if it exists
   */

  /**
   * Checks prompted input for alignment to rules
   * Initially splits by space and checks for exactly 3 arguments
   *
   * @param {string} input - User input after prompt
   * @returns {boolean} true if args are in expected form, false if not
   */
  argsAreValid: function (input) {
    function validOperand (operand) {
    // Checks specific case of mixed number not having full fractional component
    // Adds protection against something like 1_0/1 or 0_1/1
      if (operand.match(/_/)) {
        if (!operand.split("_")[1].match(/^[1-9][0-9]*\/[1-9][0-9]*$/)) {
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

    const errorText = `
    Fractional Calculator
    
    Accepts space deliminated arguments in the form of operators (+, -, *, /)
    and operands (whole numbers, fractions, improper fractions, mixed numbers).
    Order should be operand operator operand.
    Mixed numbers should be in the form whole_numerator/denominator

    Examples: 
        3/4 + 1/2
        1 * 1_4/5
        7/6 / 5/4
    `;
    const args = input.split(" ");

    if (args.length !== 3) {
      return errorText;
    }

    return !!(validOperand(args[0]) && validOperator(args[1]) && validOperand(args[2])) || errorText;
  },

  /**
   * Converts to fraction form, improper or otherwise. Also converts to int for easier handling later
   * Whole number times the denominator plus the original numerator
   *
   * @param {string} operand - Operand validated to be in right format
   * @returns {{numerator: number, denominator: number}}} Operand converted to improper fraction form, if it was mixed
   */
  convertToFraction: function (operand) {
    const impFrac = {};

    if (operand.match(/_/)) { // Mixed numbers handling
      const [whole, fraction] = operand.split("_");
      const [numerator, denominator] = fraction.split("/");

      impFrac.numerator = ((parseInt(whole, 10) * parseInt(denominator, 10)) + parseInt(numerator, 10));
      impFrac.denominator = parseInt(denominator, 10);
    } else if (operand.match("/")) {
      // already a fraction
      const splitOperand = operand.split("/");

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
   * @param {boolean} [fraction.negative] - If true, fraction is negative
   * @returns {FractionObj} Original fraction if no changes, or just a numerator if reduces cleanly,
   *                         or mixed number object
   */
  convertToMixed: function (fraction) {
    const converted = {};
    const decimalForm = fraction.numerator / fraction.denominator;

    if (fraction.negative) {
      converted.negative = fraction.negative;
    }

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
   * Handles displaying result of calculation
   *
   * @param {object} result
   * @param {number} result.numerator
   * @param {number} result.denominator
   * @param {boolean} result.negative - true if negative, falsy if not
   * @param {number} result.whole - integer value of a mixed number if given
   */
  displayText: function (result) {
    const negativeAndWhole =
      (result.negative ? "-" : "") +
      (result.whole ? result.whole + "_" : "");

    const denominator = result.denominator ? "/" + result.denominator : "";

    console.log(`= ${negativeAndWhole}${result.numerator}${denominator}`);
  },

  /**
   * Calculates lowest common denominator between two denominators
   *
   * @param {number} denom1 - Denominator 1
   * @param {number} denom2 - Denominator 2
   * @returns {number} Lowest common denominator
   */
  findLowestCommonDenominator: function (denom1, denom2) {
    const lowerDenom = Math.min(denom1, denom2);
    const iterator = Math.max(denom1, denom2); // Use the higher denominator to iterate up with
    let x = iterator;

    while (x % lowerDenom > 0) {
      x += iterator;
    }

    return x;
  },

  /**
   * Starting point. Launches prompt, processes user input, figures out which operation is being performed,
   * sends result to be displayed
   */
  main: function () {
    inquirer
      .prompt([
        {
          name: "equation",
          message: "?",
          validate: this.argsAreValid
        }
      ])
      .then((answers) => {
        let result;
        const args = answers.equation.split(" ");
        const operator = args.splice(1, 1);

        switch (operator[0]) {
          case "+":
            result = this.performAddition(args);
            break;
          case "-":
            result = this.performAddition(args, true);
            break;
          case "*":
            result = this.performMultiplication(args);
            break;
          case "/":
            result = this.performMultiplication(args, true);
            break;
          default: // Issues should be caught before this in the arg validation
            console.log(this.helpText);
            break;
        }

        this.displayText(result);
      })
      .catch((error) => {
        console.log("Error with prompt logic", error);
        if (error.isTtyError) {
          console.log("TTY error");
        }
      });
  },

  /**
   * Handles addition and subtraction, which is just addition on a bad day (cause it's just negative)
   *
   * @param {string[]} args - Array of validated argument strings from cli
   * @param {boolean} subtract - If true, performs subtraction. Addition when false
   * @returns {FractionObj} Result of calculation
   */
  performAddition: function (args, subtract) {
    // Only useful for addition/subtraction
    function convertToLowestCommonDenominator (fractionArr, lcd) {
      fractionArr.numerator = (lcd / fractionArr.denominator) * fractionArr.numerator;
      fractionArr.denominator = lcd;
    }

    args[0] = this.convertToFraction(args[0]);
    args[1] = this.convertToFraction(args[1]);

    const lowestCommonDenom = this.findLowestCommonDenominator(args[0].denominator, args[1].denominator);

    convertToLowestCommonDenominator(args[0], lowestCommonDenom);
    convertToLowestCommonDenominator(args[1], lowestCommonDenom);

    // Actual addition/subtraction calculation is done
    const addResult = {
      numerator: args[0].numerator + ((subtract ? -1 : 1) * args[1].numerator),
      denominator: lowestCommonDenom
    };

    // handle negative result
    addResult.negative = Math.sign(addResult.numerator) < 0;

    if (addResult.negative) {
      addResult.numerator = Math.abs(addResult.numerator);
    }

    // Simplify fraction
    const reducedFraction = this.reduceFraction(addResult);
    reducedFraction.negative = addResult.negative;

    return this.convertToMixed(reducedFraction);
  },

  /**
   * Handles multiplication and division
   *
   * @param {string[]} args - Array of validated argument strings from cli
   * @param {boolean} division - True if dividing, falsy if multiplying
   * @returns {FractionObj} Result of calculation
   */
  performMultiplication: function (args, division) {
    args[0] = this.convertToFraction(args[0]);
    args[1] = this.convertToFraction(args[1]);

    // 1/4 / 1/2 === 1/4 * 2/1
    const multiplyResult = {
      numerator: args[0].numerator * (division ? args[1].denominator : args[1].numerator),
      denominator: args[0].denominator * (division ? args[1].numerator : args[1].denominator)
    };

    // Simplify fraction
    const reducedFraction = this.reduceFraction(multiplyResult);

    return this.convertToMixed(reducedFraction);
  },

  /**
   * Simplifies/reduces fractions
   * https://stackoverflow.com/a/23575406
   * Ancient mathematician's algorithm
   *
   * @param {object} fractionObj
   * @param {number} fractionObj.numerator
   * @param {number} fractionObj.denominator
   * @returns {object} Numerator and denominator
   */
  reduceFraction: function (fractionObj) {
    // gcd = greatest common denominator
    const gcd = function (a, b) {
      if (!b) return a;

      return gcd(b, a % b);
    };

    const divisor = gcd(fractionObj.numerator, fractionObj.denominator);

    return {
      numerator: fractionObj.numerator / divisor,
      denominator: fractionObj.denominator / divisor
    };
  }
};

module.exports = fractionCalc;
