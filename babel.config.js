const supportsStaticEsm = (caller) =>
  Boolean(caller && caller.supportsStaticESM)

module.exports = (api) => {
  const envEs = api.env('es')
  const esModules = api.caller(supportsStaticEsm) || envEs
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: esModules ? false : undefined,
          targets: 'maintained node versions, last 1 version, > 1%, not dead',
        },
      ],
      '@babel/preset-react',
      '@babel/preset-flow',
    ],
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
    ],
  }
}
