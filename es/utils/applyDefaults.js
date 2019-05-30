function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export var applyObjectDefault = function applyObjectDefault(defaultValue) {
  return defaultValue ? typeof defaultValue === 'function' ? defaultValue : function (provided) {
    return _objectSpread({}, defaultValue, provided);
  } : function (provided) {
    return provided;
  };
};
export var applyStringDefault = function applyStringDefault(defaultValue) {
  return defaultValue ? typeof defaultValue === 'function' ? defaultValue : function (provided) {
    return provided || defaultValue;
  } : function (provided) {
    return provided;
  };
};
//# sourceMappingURL=applyDefaults.js.map