const path = require('path')

module.exports = {
  extends: [
    path.resolve(__dirname, '../../../.eslintrc.js'),
    'plugin:jest/recommended',
  ],
}
