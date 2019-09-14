const path = require('path')

module.exports = {
  extends: [path.resolve(__dirname, '../../.eslintrc.js')],
  env: {
    'shared-node-browser': true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.browser.js',
          '.server.js',
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.css',
        ],
      },
    },
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'react/prop-types': ['error', { skipUndeclared: true }],
  },
}
