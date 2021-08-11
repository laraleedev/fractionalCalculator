const expect = require('chai').expect;
const fractionCalc = require('../fractionCalc');

describe('argsAreValid()', function () {
  it('should return false if args are less than 4', function () {
    const result = fractionCalc.argsAreValid(['1', '2']);

    expect(result).to.be.false;
  });

  it('should return false if args are greater than 4', function () {
    const result = fractionCalc.argsAreValid(['1', '2', '3', '4', '5']);

    expect(result).to.be.false;
  });

  it('should return truthy for 4 valid args', function () {
    const result = fractionCalc.argsAreValid(['node', '2', '+', '2/6']);

    expect(!!result).to.be.true;
  });

  it('should return truthy for adding mixed and improper fractions', function () {
    const result = fractionCalc.argsAreValid(['node', '2/6', '+', '1_2/5']);

    expect(!!result).to.be.true;
  });

  it('should return falsy if first operand is invalid', function () {
    const result = fractionCalc.argsAreValid(['node', '2/0', '+', '1_2/5']);

    expect(!!result).to.be.false;
  });

  it('should return falsy if second operand invalid', function () {
    const result = fractionCalc.argsAreValid(['node', '2', '+', '2/0']);

    expect(!!result).to.be.false;
  });

  it('should return falsy if incorrect operator', function () {
    const result = fractionCalc.argsAreValid(['node', '1_1/6', '?', '8123/7']);

    expect(!!result).to.be.false;
  });

  it('should return truthy for subtraction', function () {
    const result = fractionCalc.argsAreValid(['node', '1_1/6', '-', '8123/7']);

    expect(!!result).to.be.true;
  });

  it('should return truthy for multiplication', function () {
    const result = fractionCalc.argsAreValid(['node', '1_1/6', '*', '8123/7']);

    expect(!!result).to.be.true;
  });

  it('should return truthy for division', function () {
    const result = fractionCalc.argsAreValid(['node', '1_1/6', '/', '8123/7']);

    expect(!!result).to.be.true;
  });

  it('should return truthy for 0 value fractions', function () {
    const result = fractionCalc.argsAreValid(['node', '0/6', '+', '3']);

    expect(!!result).to.be.true;
  });

  it('should return falsy for divide by zero', function () {
    const result = fractionCalc.argsAreValid(['node', '6/0', '+', '3']);

    expect(!!result).to.be.false;
  });

  it('should return falsy for 0_1/3', function () {
    const result = fractionCalc.argsAreValid(['node', '0_1/3', '+', '3']);

    expect(!!result).to.be.false;
  });

  it('should return falsy for 1_0/3', function () {
    const result = fractionCalc.argsAreValid(['node', '1_0/3', '+', '3']);

    expect(!!result).to.be.false;
  });

  it('should return falsy for 1_3/0', function () {
    const result = fractionCalc.argsAreValid(['node', '1_3/0', '+', '3']);

    expect(!!result).to.be.false;
  });
});
