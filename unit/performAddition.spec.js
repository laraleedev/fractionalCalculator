const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");

describe("performAddition()", function () {
  it("should return fraction object result", function () {
    const result = fractionCalc.performAddition(["1", "1"]);

    expect(result).to.deep.equal({ numerator: 2 });
  });

  it("should return zero if result is zero", function () {
    const result = fractionCalc.performAddition(["0", "0"]);

    expect(result).to.deep.equal({ numerator: 0 });
  });

  it("should return fraction object result with negative flag", function () {
    const result = fractionCalc.performAddition(["1", "2"], true);

    expect(result).to.deep.equal({ numerator: 1, negative: true });
  });
});
