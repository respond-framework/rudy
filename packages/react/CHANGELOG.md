# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.1-from-git.0](https://github.com/respond-framework/rudy/tree/master/packages/react/compare/@respond-framework/react@0.1.1-test.2...@respond-framework/react@0.1.1-from-git.0) (2019-08-21)


### Bug Fixes

* update dependencies with security vulnerabilities ([#47](https://github.com/respond-framework/rudy/tree/master/packages/react/issues/47)) ([3c18480](https://github.com/respond-framework/rudy/tree/master/packages/react/commit/3c18480))





## 0.1.1-test.2 (2019-06-07)


### Features

* add compatibility with react-redux 6+ ([#33](https://github.com/respond-framework/rudy/tree/master/packages/react/issues/33)) ([cb45152](https://github.com/respond-framework/rudy/tree/master/packages/react/commit/cb45152))


### BREAKING CHANGES

* The object returned from createRouter now contains a key `api` which contains `routes`, `ctx` and such things. Previously they were in the root object.
* The `link` package has been renamed to `react`.
* The `Link` component now must be rendered as a descendant of the new `RudyProvider`.
* The core no longer monkey patches redux `getState` to have a key `api` with the rudy API.





## 0.1.1-test.1 (2019-04-15)

**Note:** Version bump only for package @respond-framework/react





## 0.1.1-test.0 (2018-11-05)

**Note:** Version bump only for package @respond-framework/react
