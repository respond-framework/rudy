# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.1-test.8](https://github.com/hedgepigdaniel/rudy/compare/@respond-framework/boilerplate@0.1.1-test.7...@respond-framework/boilerplate@0.1.1-test.8) (2019-12-20)

**Note:** Version bump only for package @respond-framework/boilerplate





## [0.1.1-test.7](https://github.com/hedgepigdaniel/rudy/compare/@respond-framework/boilerplate@0.1.1-test.6...@respond-framework/boilerplate@0.1.1-test.7) (2019-11-13)


### Features

* scroll restoration ([#65](https://github.com/hedgepigdaniel/rudy/issues/65)) ([e326fd2](https://github.com/hedgepigdaniel/rudy/commit/e326fd2))


### BREAKING CHANGES

* scroll restoration is enabled by default

Fixes https://github.com/respond-framework/rudy/issues/62





## [0.1.1-test.6](https://github.com/hedgepigdaniel/rudy/compare/@respond-framework/boilerplate@0.1.1-test.5...@respond-framework/boilerplate@0.1.1-test.6) (2019-10-23)

**Note:** Version bump only for package @respond-framework/boilerplate





## [0.1.1-test.5](https://github.com/hedgepigdaniel/rudy/compare/@respond-framework/boilerplate@0.1.1-test.4...@respond-framework/boilerplate@0.1.1-test.5) (2019-10-16)

**Note:** Version bump only for package @respond-framework/boilerplate





## [0.1.1-test.4](https://github.com/respond-framework/rudy/compare/@respond-framework/boilerplate@0.1.1-test.3...@respond-framework/boilerplate@0.1.1-test.4) (2019-09-10)


### Bug Fixes

* update dependencies with security vulnerabilities ([#47](https://github.com/respond-framework/rudy/issues/47)) ([3c18480](https://github.com/respond-framework/rudy/commit/3c18480))





## [0.1.1-test.3](https://github.com/respond-framework/rudy/compare/@respond-framework/boilerplate@0.1.1-test.2...@respond-framework/boilerplate@0.1.1-test.3) (2019-06-07)


### Features

* add compatibility with react-redux 6+ ([#33](https://github.com/respond-framework/rudy/issues/33)) ([cb45152](https://github.com/respond-framework/rudy/commit/cb45152))


### BREAKING CHANGES

* The object returned from createRouter now contains a key `api` which contains `routes`, `ctx` and such things. Previously they were in the root object.
* The `link` package has been renamed to `react`.
* The `Link` component now must be rendered as a descendant of the new `RudyProvider`.
* The core no longer monkey patches redux `getState` to have a key `api` with the rudy API.





## [0.1.1-test.2](https://github.com/respond-framework/rudy/compare/@respond-framework/boilerplate@0.1.1-test.1...@respond-framework/boilerplate@0.1.1-test.2) (2019-06-06)


### Bug Fixes

* **boilerplate:** use req.url instead of req.path in examples ([#29](https://github.com/respond-framework/rudy/issues/29)) ([30fea9e](https://github.com/respond-framework/rudy/commit/30fea9e))





## 0.1.1-test.1 (2019-04-15)

**Note:** Version bump only for package @respond-framework/boilerplate





## 0.1.1-test.0 (2018-11-05)

**Note:** Version bump only for package @respond-framework/boilerplate
