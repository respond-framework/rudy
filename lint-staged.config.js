const micromatch = require('micromatch')

const eslintMatcher = '*.{js,jsx,ts,tsx}'

module.exports = {
  '*': (files) =>
    files.reduce(
      (commands, file) => [
        ...commands,
        micromatch.isMatch(file, eslintMatcher)
          ? `eslint --cache --report-unused-disable-directives --max-warnings 0 --fix '${file}'`
          : `prettier --write '${file}'`,
        `git add '${file}'`,
      ],
      [],
    ),
  '**/*.ts?(x)': () => 'tsc -b config/tsconfig.json',
}
