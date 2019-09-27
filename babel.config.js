const supportsStaticEsm = (caller) =>
  Boolean(caller && caller.supportsStaticESM)

module.exports = (api) => {
  const envEs = api.env('es')
  const test = api.env('test')
  const esModules = api.caller(supportsStaticEsm) || envEs
  return {
    overrides: [
      {
        test: /\.tsx?$/,
        presets: ['@babel/preset-typescript'],
      },
      {
        test: /\.jsx?$/,
        presets: ['@babel/preset-flow'],
      },
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: esModules ? false : undefined,
          targets: 'maintained node versions, last 1 version, > 1%, not dead',
        },
      ],
      '@babel/preset-react',
    ].filter(Boolean),
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      test && '@babel/plugin-transform-runtime',
    ].filter(Boolean),
  }
}
