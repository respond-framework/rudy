# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.1-test.8](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/compare/integration-tests@1.0.1-test.7...integration-tests@1.0.1-test.8) (2019-12-20)

**Note:** Version bump only for package integration-tests





## [1.0.1-test.7](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/compare/integration-tests@1.0.1-test.6...integration-tests@1.0.1-test.7) (2019-11-13)

**Note:** Version bump only for package integration-tests





## [1.0.1-test.6](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/compare/integration-tests@1.0.1-test.5...integration-tests@1.0.1-test.6) (2019-10-23)


### Bug Fixes

* **tests:** import through package exports, not file paths ([780e5ca](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/commit/780e5ca))





## [1.0.1-test.5](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/compare/integration-tests@1.0.1-test.4...integration-tests@1.0.1-test.5) (2019-10-16)


### Bug Fixes

* **history:** store index of current history stack entry in the browser location state ([#61](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/issues/61)) ([3abd2b1](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/commit/3abd2b1))


### BREAKING CHANGES

* **history:** browsers that don't support the history API or session storage are no longer supported at all. In practice this means IE9 is no longer supported.
* **history:** future entries in the history stack remain even if the user has since navigated from a previous entry to an external site (because they are no longer removed when they are potentially still the future entries in the browser stack)

Fixes https://github.com/respond-framework/rudy/issues/59





## [1.0.1-test.4](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/compare/integration-tests@1.0.1-test.3...integration-tests@1.0.1-test.4) (2019-09-10)


### Bug Fixes

* update dependencies with security vulnerabilities ([#47](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/issues/47)) ([3c18480](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/commit/3c18480))
* **history:** pushing/replacing a route sometimes resulted in a back/next action ([#56](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/issues/56)) ([f6e06ad](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/commit/f6e06ad))


### BREAKING CHANGES

* **history:** dispatching a route that matches the previous/next route in the history stack is no longer reinterpreted as a back/next action
* **history:** history functions `set`/`setParams`/`setState`/`setQuery`/`setHash`/`setBasename` no longer accept a function as an argument
* **history:** history functions `set`/`setParams`/`setState`/`setQuery` no longer merge their arguments with the existing params/state/query
* **history:** history functions `back`/`next`/`jump` no longer accept a state argument

Fixes https://github.com/respond-framework/rudy/issues/48





## [1.0.1-test.3](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/compare/integration-tests@1.0.1-test.2...integration-tests@1.0.1-test.3) (2019-06-07)


### Features

* add compatibility with react-redux 6+ ([#33](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/issues/33)) ([cb45152](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/commit/cb45152))


### BREAKING CHANGES

* The object returned from createRouter now contains a key `api` which contains `routes`, `ctx` and such things. Previously they were in the root object.
* The `link` package has been renamed to `react`.
* The `Link` component now must be rendered as a descendant of the new `RudyProvider`.
* The core no longer monkey patches redux `getState` to have a key `api` with the rudy API.





## [1.0.1-test.2](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/compare/integration-tests@1.0.1-test.1...integration-tests@1.0.1-test.2) (2019-06-06)

**Note:** Version bump only for package integration-tests





## 1.0.1-test.1 (2019-04-15)


### Features

* **transformations:** Various changes, documentation ([#24](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/issues/24)) ([c7c2320](https://github.com/respond-framework/rudy/tree/master/packages/integration-tests/commit/c7c2320))


### BREAKING CHANGES

* **transformations:** `fromPath` and `toPath` Have changed type signatures, and the defaults behave differently.





## 1.0.1-test.0 (2018-11-05)

**Note:** Version bump only for package integration-tests
