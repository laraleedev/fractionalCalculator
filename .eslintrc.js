module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:mocha/recommended',
    'semistandard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'chai-friendly',
    'mocha'
  ],
  rules: {
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2
  }
};
