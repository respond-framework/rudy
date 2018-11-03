/**
 * This file is here as a fallback, because babel-watch doesn't support
 * passing the `rootMode` option to babel
 */

module.exports = {
  env: {
    'babel-watch': {
      extends: '../../babel.config',
    }
  }
}
