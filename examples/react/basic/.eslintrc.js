const path = require('path')

module.exports = {
  extends: [path.resolve(__dirname, '../../../.eslintrc.js')],
  env: {
    browser: true,
  },
  rules: {
    'no-param-reassign': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'react/jsx-filename-extension': 0,
    'react/prop-types': ['error', { skipUndeclared: true }],
    'import/no-extraneous-dependencies': 0, // There is no package.json
  },
}
