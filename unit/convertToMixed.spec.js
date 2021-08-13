const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");

describe("convertToMixed()", function () {
  it("should return just numerator if number reduces cleanly to integer", function () {
    const result = fractionCalc.convertToMixed({ numerator: 5, denominator: 1 });

    expect(result).to.deep.equal({ numerator: 5 });
  });

  it("should return fraction in same form if it can't be reduced", function () {
    const result = fractionCalc.convertToMixed({ numerator: 3, denominator: 4 });

    expect(result).to.deep.equal({ numerator: 3, denominator: 4 });
  });

  it("should return fraction in mixed form if value is greater than 1", function () {
    const result = fractionCalc.convertToMixed({ numerator: 5, denominator: 4 });

    expect(result).to.deep.equal({ numerator: 1, denominator: 4, whole: 1 });
  });

  it("should retain negative flag if initial argument was negative", function () {
    const result = fractionCalc.convertToMixed({ numerator: 5, denominator: 4, negative: true });

    expect(result).to.deep.equal({ numerator: 1, denominator: 4, whole: 1, negative: true });
  });
});
