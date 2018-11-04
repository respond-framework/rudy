const path = require('path')

module.exports = {
  extends: [path.resolve(__dirname, '../../.eslintrc.js')],
  rules: {
    'no-param-reassign': 0,
  },
}
