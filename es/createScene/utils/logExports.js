function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { typeToScene } from '../../utils';
export default (function (types, actions, routes, options) {
  var opts = _objectSpread({}, options);

  opts.scene = typeToScene(Object.keys(routes)[0]);
  delete opts.logExports;
  var optsString = JSON.stringify(opts).replace(/"scene":/, 'scene: ').replace(/"basename":/, 'basename: ').replace(/"/g, "'").replace('{', '{ ').replace('}', ' }').replace(/,/g, ', ');
  var t = '';

  for (var type in types) {
    t += "\n\t".concat(type, ",");
  }

  var a = '';

  for (var action in actions) {
    a += "\n\t".concat(action, ",");
  } // destructure createActions()


  var exports = "const { types, actions } = createScene(routes, ".concat(optsString, ")");
  exports += "\n\nconst { ".concat(t.slice(0, -1), "\n} = types");
  exports += "\n\nconst { ".concat(a.slice(0, -1), "\n} = actions"); // types exports

  exports += "\n\nexport {".concat(t);
  exports = "".concat(exports.slice(0, -1), "\n}"); // actions exports

  exports += "\n\nexport {".concat(a);
  exports = "".concat(exports.slice(0, -1), "\n}");
  if (process.env.NODE_ENV !== 'test') console.log(exports);
  return exports;
});
//# sourceMappingURL=logExports.js.map