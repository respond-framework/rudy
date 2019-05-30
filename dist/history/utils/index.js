"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "supportsDom", {
  enumerable: true,
  get: function get() {
    return _supports.supportsDom;
  }
});
Object.defineProperty(exports, "supportsHistory", {
  enumerable: true,
  get: function get() {
    return _supports.supportsHistory;
  }
});
Object.defineProperty(exports, "supportsSession", {
  enumerable: true,
  get: function get() {
    return _supports.supportsSession;
  }
});
Object.defineProperty(exports, "addPopListener", {
  enumerable: true,
  get: function get() {
    return _popListener.addPopListener;
  }
});
Object.defineProperty(exports, "removePopListener", {
  enumerable: true,
  get: function get() {
    return _popListener.removePopListener;
  }
});
Object.defineProperty(exports, "isExtraneousPopEvent", {
  enumerable: true,
  get: function get() {
    return _popListener.isExtraneousPopEvent;
  }
});
Object.defineProperty(exports, "saveHistory", {
  enumerable: true,
  get: function get() {
    return _sessionStorage.saveHistory;
  }
});
Object.defineProperty(exports, "restoreHistory", {
  enumerable: true,
  get: function get() {
    return _sessionStorage.restoreHistory;
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function get() {
    return _sessionStorage.get;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function get() {
    return _sessionStorage.set;
  }
});
Object.defineProperty(exports, "clear", {
  enumerable: true,
  get: function get() {
    return _sessionStorage.clear;
  }
});
Object.defineProperty(exports, "pushState", {
  enumerable: true,
  get: function get() {
    return _sessionStorage.pushState;
  }
});
Object.defineProperty(exports, "replaceState", {
  enumerable: true,
  get: function get() {
    return _sessionStorage.replaceState;
  }
});

var _supports = require("./supports");

var _popListener = require("./popListener");

var _sessionStorage = require("./sessionStorage");
//# sourceMappingURL=index.js.map