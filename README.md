# fractionalCalculator

## Coding Challenge

Write a command line program in the language of your choice that will take operations on fractions as an input and produce a fractional result.
Legal operators shall be *, /, +, - (multiply, divide, add, subtract)
Operands and operators shall be separated by one or more spaces
Mixed numbers will be represented by whole_numerator/denominator. e.g. “3_1/4”
Improper fractions and whole numbers are also allowed as operands.

### examples:
```
? 1/2 * 3_3/4
= 1_7/8
? 2_3/8 + 9/8
3_1/2
```

### Testing Challenge
After you complete your program, please create a proposal for how you would deploy, test, and maintain this program. This part of the exercise is open-ended and intended to determine how you approach real-world quality-engineering. Please detail how your testing approach would change depending on any variables and factors or unknowns which you deem important. Please consider the full life cycle of the product and various real-world environments that it might live in. As part of your proposal, you may reference any tests performed in your original implementation, expand upon them, and/or provide new test code. Be certain to include test code samples sufficient to demonstrate the ideas presented in the proposal.

## Run
```
npm start // Help text displays
npm start 1/5 + 1_4/6 // Arguments for calculation
```

## Dev
Created using node 14.16.0.

```
npm ci // Installs dependencies, should also trigger husky install via postinstall script
```

### Linting/Testing
A precommit hook is added via husky that triggers linting (with auto fix enabled) and the test script defined in npm scripts. Failing either will halt commit.

Can fire tests off manually via
```
npm test
```

### Documentation
```
npm run doc // Generates jsdoc documentation
```


## Considerations
- Negative numbers: Not explicitly defined in the original challenge definition, but a likely candidate for _a future release_. Would require more time with the regexes to handle. Tested to be an invalid argument for now. Does not (currently) allow negative numbers, fractional or otherwise.
    - results can be negative (through subtraction), this is handled
    - Potential way to handle it: check for and flag for negative input, then check the rest of the input as normal (with negative removed)
- Why not interactable prompts: Looked into using something like https://www.npmjs.com/package/prompt or child_process, but decided to have it as argv instead to make it a better candidate for seamlessly integrating into an automation pipeline (such as allowing other processes to call and use it rapidly)