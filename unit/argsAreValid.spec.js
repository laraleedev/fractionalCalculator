const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");

describe("argsAreValid()", function () {
  it("should return help text if args are less than 3", function () {
    const result = fractionCalc.argsAreValid("1 +");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text if args are greater than 3", function () {
    const result = fractionCalc.argsAreValid("1 + 2 3");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return truthy for 3 valid args", function () {
    const result = fractionCalc.argsAreValid("1 + 2");

    expect(!!result).to.be.true;
  });

  it("should return truthy for adding mixed and improper fractions", function () {
    const result = fractionCalc.argsAreValid("2/6 + 1_2/5");

    expect(!!result).to.be.true;
  });

  it("should return help text if first operand is invalid", function () {
    const result = fractionCalc.argsAreValid("2/0 + 1_2/5");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text if second operand invalid", function () {
    const result = fractionCalc.argsAreValid("2 + 2/0");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text if incorrect operator", function () {
    const result = fractionCalc.argsAreValid("1_1/6 ? 8123/7");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text for negative operand", function () { // Possible future feature to add
    const result = fractionCalc.argsAreValid("-1 + 1");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return truthy for subtraction", function () {
    const result = fractionCalc.argsAreValid("1_1/6 - 8123/7");

    expect(!!result).to.be.true;
  });

  it("should return truthy for multiplication", function () {
    const result = fractionCalc.argsAreValid("1_1/6 * 8123/7");

    expect(!!result).to.be.true;
  });

  it("should return truthy for division", function () {
    const result = fractionCalc.argsAreValid("1_1/6 / 8123/7");

    expect(!!result).to.be.true;
  });

  it("should return truthy for 0 value fractions", function () {
    const result = fractionCalc.argsAreValid("0/6 + 3");

    expect(!!result).to.be.true;
  });

  it("should return help text for divide by zero", function () {
    const result = fractionCalc.argsAreValid("6/0 + 3");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text for 0_1/3", function () {
    const result = fractionCalc.argsAreValid("0_1/3 + 3");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text for 1_0/3", function () {
    const result = fractionCalc.argsAreValid("1_0/3 + 3");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text for 1_3/0", function () {
    const result = fractionCalc.argsAreValid("1_3/0 + 3");

    expect(result).to.include("Fractional Calculator");
  });

  it("should return help text for decimals", function () {
    const result = fractionCalc.argsAreValid("3.1231 + 3");

    expect(result).to.include("Fractional Calculator");
  });
});
