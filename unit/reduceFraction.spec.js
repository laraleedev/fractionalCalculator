const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");

describe("reduceFraction()", function () {
  it("should return reduced fraction when given reducable fraction with higher denominator", function () {
    const result = fractionCalc.reduceFraction({ numerator: 17, denominator: 51 });

    expect(result).to.deep.equal({ numerator: 1, denominator: 3 });
  });

  it("should return reduced fraction when given reducable fraction with higher numerator", function () {
    const result = fractionCalc.reduceFraction({ numerator: 25, denominator: 5 });

    expect(result).to.deep.equal({ numerator: 5, denominator: 1 });
  });

  it("should return same fraction if not reducable ", function () {
    const result = fractionCalc.reduceFraction({ numerator: 3, denominator: 4 });

    expect(result).to.deep.equal({ numerator: 3, denominator: 4 });
  });
});
