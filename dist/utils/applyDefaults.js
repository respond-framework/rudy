"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyStringDefault = exports.applyObjectDefault = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var applyObjectDefault = function applyObjectDefault(defaultValue) {
  return defaultValue ? typeof defaultValue === 'function' ? defaultValue : function (provided) {
    return _objectSpread({}, defaultValue, provided);
  } : function (provided) {
    return provided;
  };
};

exports.applyObjectDefault = applyObjectDefault;

var applyStringDefault = function applyStringDefault(defaultValue) {
  return defaultValue ? typeof defaultValue === 'function' ? defaultValue : function (provided) {
    return provided || defaultValue;
  } : function (provided) {
    return provided;
  };
};

exports.applyStringDefault = applyStringDefault;
//# sourceMappingURL=applyDefaults.js.map