const path = require('path')
const {
  configs: {
    recommended: {
      env,
      ...jestConfig
    },
  },
  environments: {
    globals: {
      globals: jestGlobals,
    },
  },
} = require('eslint-plugin-jest');

module.exports = {
  extends: [
    'eslint-config-airbnb',
    'plugin:prettier/recommended',
    'plugin:flowtype/recommended',
    'prettier/flowtype',
    'prettier/react',
  ],
  parser: 'babel-eslint',
  settings: {
    'import/resolver': {
      lerna: {
        packages: path.resolve(__dirname, './packages'),
      },
    },
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: false },
    ],
    'no-underscore-dangle': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-nested-ternary': 0,
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: ['config/**'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.js'],
      ...jestConfig,
      globals: jestGlobals,
    },
  ],
}
