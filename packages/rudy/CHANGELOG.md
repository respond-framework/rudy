# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.1-test.4](https://github.com/respond-framework/rudy/tree/master/packages/rudy/compare/@respond-framework/rudy@0.1.1-test.3...@respond-framework/rudy@0.1.1-test.4) (2019-09-10)


### Bug Fixes

* **history:** pushing/replacing a route sometimes resulted in a back/next action ([#56](https://github.com/respond-framework/rudy/tree/master/packages/rudy/issues/56)) ([f6e06ad](https://github.com/respond-framework/rudy/tree/master/packages/rudy/commit/f6e06ad))


### BREAKING CHANGES

* **history:** dispatching a route that matches the previous/next route in the history stack is no longer reinterpreted as a back/next action
* **history:** history functions `set`/`setParams`/`setState`/`setQuery`/`setHash`/`setBasename` no longer accept a function as an argument
* **history:** history functions `set`/`setParams`/`setState`/`setQuery` no longer merge their arguments with the existing params/state/query
* **history:** history functions `back`/`next`/`jump` no longer accept a state argument

Fixes https://github.com/respond-framework/rudy/issues/48





## [0.1.1-test.3](https://github.com/respond-framework/rudy/tree/master/packages/rudy/compare/@respond-framework/rudy@0.1.1-test.2...@respond-framework/rudy@0.1.1-test.3) (2019-06-07)


### Build System

* add ability to publish to git instead of NPM ([#34](https://github.com/respond-framework/rudy/tree/master/packages/rudy/issues/34)) ([95e59e0](https://github.com/respond-framework/rudy/tree/master/packages/rudy/commit/95e59e0))


### Features

* add compatibility with react-redux 6+ ([#33](https://github.com/respond-framework/rudy/tree/master/packages/rudy/issues/33)) ([cb45152](https://github.com/respond-framework/rudy/tree/master/packages/rudy/commit/cb45152))


### BREAKING CHANGES

* The object returned from createRouter now contains a key `api` which contains `routes`, `ctx` and such things. Previously they were in the root object.
* The `link` package has been renamed to `react`.
* The `Link` component now must be rendered as a descendant of the new `RudyProvider`.
* The core no longer monkey patches redux `getState` to have a key `api` with the rudy API.
* Remove UMD builds





## [0.1.1-test.2](https://github.com/respond-framework/rudy/tree/master/packages/rudy/compare/@respond-framework/rudy@0.1.1-test.1...@respond-framework/rudy@0.1.1-test.2) (2019-06-06)


### Bug Fixes

* **core:** Pass the configured title state key or selector into the title middleware [#28](https://github.com/respond-framework/rudy/tree/master/packages/rudy/issues/28) ([381d8c3](https://github.com/respond-framework/rudy/tree/master/packages/rudy/commit/381d8c3))





## 0.1.1-test.1 (2019-04-15)


### Features

* add options to the call middleware ([#17](https://github.com/respond-framework/rudy/tree/master/packages/rudy/issues/17)) ([4ee0198](https://github.com/respond-framework/rudy/tree/master/packages/rudy/commit/4ee0198))
* **transformations:** Various changes, documentation ([#24](https://github.com/respond-framework/rudy/tree/master/packages/rudy/issues/24)) ([c7c2320](https://github.com/respond-framework/rudy/tree/master/packages/rudy/commit/c7c2320))


### BREAKING CHANGES

* **transformations:** `fromPath` and `toPath` Have changed type signatures, and the defaults behave differently.





## 0.1.1-test.0 (2018-11-05)

**Note:** Version bump only for package @respond-framework/rudy
