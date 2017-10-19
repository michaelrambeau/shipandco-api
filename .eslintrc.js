module.exports = {
  extends: 'airbnb-base',
  plugins: ['import'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'space-before-function-paren': 0,
    'comma-dangle': ['error', 'never'],
    'no-underscore-dangle': 0,
    'arrow-parens': 0,
    'arrow-body-style': 0,
    'no-use-before-define': 0,
    camelcase: 0,
    'no-mixed-operators': 0,
    'no-console': 1,
  },
}
