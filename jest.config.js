const path = require('path')

module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': path.relative(
      process.cwd(),
      path.resolve(__dirname, './config/babel-jest'),
    ),
  },
  testEnvironment: 'node',
}
