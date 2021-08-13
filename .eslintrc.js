module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "plugin:mocha/recommended",
    "semistandard"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "chai-friendly",
    "mocha"
  ],
  rules: {
    "chai-friendly/no-unused-expressions": 2,
    "no-unused-expressions": 0,
    quotes: [2, "double"]
  }
};
