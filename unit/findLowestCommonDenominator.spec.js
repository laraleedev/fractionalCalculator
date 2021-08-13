const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");

describe("findLowestCommonDenominator()", function () {
  it("should return lowest common denominator given two denominators", function () {
    const result = fractionCalc.findLowestCommonDenominator(4, 5);

    expect(result).to.equal(20);
  });
});
