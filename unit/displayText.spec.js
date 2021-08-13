const expect = require("chai").expect;
const fractionCalc = require("../fractionCalc");
const sinon = require("sinon");

describe("displayText()", function () {
  it("should display console.log message with fraction", function () {
    const spy = sinon.spy(console, "log");

    fractionCalc.displayText({ numerator: 1, denominator: 2 });

    expect(spy.calledWith("= 1/2")).to.be.true;

    spy.restore();
  });

  it("should display console.log message with integer", function () {
    const spy = sinon.spy(console, "log");

    fractionCalc.displayText({ numerator: 1 });

    expect(spy.calledWith("= 1")).to.be.true;

    spy.restore();
  });

  it("should display console.log message with negative mixed number", function () {
    const spy = sinon.spy(console, "log");

    fractionCalc.displayText({ numerator: 1, denominator: 2, whole: 1, negative: true });

    expect(spy.calledWith("= -1_1/2")).to.be.true;

    spy.restore();
  });
});
