const rootConfig = require('../../jest.config')

module.exports = {
  ...rootConfig,
  verbose: false,
  silent: true,
  testURL: 'http://localhost:3000',
  testMatch: ['**/__tests__/integration/**/*.js?(x)'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./__test-helpers__/setupJest.js'],
  setupFiles: ['jest-localstorage-mock'],
  moduleFileExtensions: ['js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
  moduleNameMapper: {
    '^@respond-framework\\/([^/]+)\\/(.*)':
      '<rootDir>/../../packages/$1/src/$2',
    '^@respond-framework\\/([^/]+)': '<rootDir>/../../packages/$1/src',
  },
}
