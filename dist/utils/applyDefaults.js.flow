// @flow

import type {
  Route,
  Options,
  ObjectDefault,
  StringDefault,
} from '../flow-types'

export const applyObjectDefault: (
  ?ObjectDefault,
) => (?Object, Route, Options) => ?Object = (defaultValue) =>
  defaultValue
    ? typeof defaultValue === 'function'
      ? defaultValue
      : (provided) => ({ ...defaultValue, ...provided })
    : (provided) => provided

export const applyStringDefault: (
  ?StringDefault,
) => (string, Route, Options) => string = (defaultValue) =>
  defaultValue
    ? typeof defaultValue === 'function'
      ? defaultValue
      : (provided) => provided || defaultValue
    : (provided) => provided
