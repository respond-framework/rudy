const path = require('path')

module.exports = (api) => {
  const webpack = api.env('webpack')
  return {
    extends: path.resolve(__dirname, '../../babel.config.js'),
    plugins: [
      webpack && 'react-hot-loader/babel',
      webpack && '@babel/plugin-syntax-dynamic-import',
      webpack && 'babel-plugin-universal-import',
    ].filter(Boolean),
  };
}
