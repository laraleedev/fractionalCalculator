const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");

describe("convertToFraction()", function () {
  it("should return fraction object for whole number input", function () {
    const result = fractionCalc.convertToFraction("2");

    expect(result).to.deep.equal({ numerator: 2, denominator: 1 });
  });

  it("should convert strings into numbers", function () {
    const result = fractionCalc.convertToFraction("3/5");

    expect(result).to.deep.equal({ numerator: 3, denominator: 5 });
  });

  it("should convert mixed number into improper fraction", function () {
    const result = fractionCalc.convertToFraction("4_1/6");

    expect(result).to.deep.equal({ numerator: 25, denominator: 6 });
  });
});
