"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  utils: true,
  createRouter: true,
  createScene: true,
  createHistory: true,
  History: true,
  MemoryHistory: true,
  BrowserHistory: true
};
Object.defineProperty(exports, "createRouter", {
  enumerable: true,
  get: function get() {
    return _createRouter.default;
  }
});
Object.defineProperty(exports, "createScene", {
  enumerable: true,
  get: function get() {
    return _createScene.default;
  }
});
Object.defineProperty(exports, "createHistory", {
  enumerable: true,
  get: function get() {
    return _createHistory.default;
  }
});
Object.defineProperty(exports, "History", {
  enumerable: true,
  get: function get() {
    return _History.default;
  }
});
Object.defineProperty(exports, "MemoryHistory", {
  enumerable: true,
  get: function get() {
    return _MemoryHistory.default;
  }
});
Object.defineProperty(exports, "BrowserHistory", {
  enumerable: true,
  get: function get() {
    return _BrowserHistory.default;
  }
});
exports.utils = void 0;

var supports = _interopRequireWildcard(require("./history/utils/supports"));

var popListener = _interopRequireWildcard(require("./history/utils/popListener"));

var sessionStorage = _interopRequireWildcard(require("./history/utils/sessionStorage"));

var _createRouter = _interopRequireDefault(require("./core/createRouter"));

var _createScene = _interopRequireDefault(require("./createScene"));

var _createHistory = _interopRequireDefault(require("./core/createHistory"));

var _History = _interopRequireDefault(require("./history/History"));

var _MemoryHistory = _interopRequireDefault(require("./history/MemoryHistory"));

var _BrowserHistory = _interopRequireDefault(require("./history/BrowserHistory"));

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

var _actions = require("./actions");

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});

var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _middleware = require("./middleware");

Object.keys(_middleware).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _middleware[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var utils = {
  supports: supports,
  popListener: popListener,
  sessionStorage: sessionStorage
};
/** if you want to extend History, here is how you do it:

import History from '@respond-framework/rudy'

class MyHistory extends History {
  push(path) {
    const location = this.createAction(path)
    // do something custom
  }
}

// usage:

import { createRouter } from '@respond-framework/rudy'
import { createHistory as creatHist } from '@respond-framework/rudy'

const createHistory = (routes, opts) => {
  if (opts.someCondition) return new MyHistory(routes, opts)
  return creatHist(routes, opts)
}

const { middleware, reducer, firstRoute } = createRouter(routes, { createHistory })

*/

exports.utils = utils;
//# sourceMappingURL=index.js.map