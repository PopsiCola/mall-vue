// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'indent': 0,
    'no-multi-spaces':'off',
    "no-multiple-empty-lines": [0, { "max": 100 }],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-unused-vars": [2, {
      "vars": "local",
      "args": "none"
    }],
    "semi": [0],
    "no-mixed-spaces-and-tabs": [0],
    "space-before-blocks":0,
    "key-spacing":0,
    "arrow-spacing":0,
    "no-trailing-spaces":0,
    "eol-last":0,
    "prefer-const":0,
    "quotes":0
  }
}
