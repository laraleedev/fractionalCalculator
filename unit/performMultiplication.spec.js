const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");

describe("performMultiplication()", function () {
  it("should return zero if result is zero", function () {
    const result = fractionCalc.performMultiplication(["0", "1/4"]);

    expect(result).to.deep.equal({ numerator: 0 });
  });

  it("should return multiplication result", function () {
    const result = fractionCalc.performMultiplication(["1/2", "1/4"]);

    expect(result).to.deep.equal({ numerator: 1, denominator: 8 });
  });

  it("should return division result", function () {
    const result = fractionCalc.performMultiplication(["1/2", "1/4"], true);

    expect(result).to.deep.equal({ numerator: 2 });
  });
});
