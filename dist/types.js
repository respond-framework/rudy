"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SET_FROM = exports.UNBLOCK = exports.BLOCK = exports.CONFIRM = exports.CLEAR_CACHE = exports.CHANGE_BASENAME = exports.ADD_ROUTES = exports.NOT_FOUND = exports.CALL_HISTORY = exports.prefixType = exports.PREFIX = void 0;
var PREFIX = '@@rudy';
exports.PREFIX = PREFIX;

var prefixType = function prefixType(type, prefix) {
  return "".concat(prefix || PREFIX, "/").concat(type);
};

exports.prefixType = prefixType;
var CALL_HISTORY = prefixType('CALL_HISTORY');
exports.CALL_HISTORY = CALL_HISTORY;
var NOT_FOUND = prefixType('NOT_FOUND');
exports.NOT_FOUND = NOT_FOUND;
var ADD_ROUTES = prefixType('ADD_ROUTES');
exports.ADD_ROUTES = ADD_ROUTES;
var CHANGE_BASENAME = prefixType('CHANGE_BASENAME');
exports.CHANGE_BASENAME = CHANGE_BASENAME;
var CLEAR_CACHE = prefixType('CLEAR_CACHE');
exports.CLEAR_CACHE = CLEAR_CACHE;
var CONFIRM = prefixType('CONFIRM');
exports.CONFIRM = CONFIRM;
var BLOCK = prefixType('BLOCK', '@@skiprudy'); // these skip middleware pipeline, and are reducer-only

exports.BLOCK = BLOCK;
var UNBLOCK = prefixType('UNBLOCK', '@@skiprudy');
exports.UNBLOCK = UNBLOCK;
var SET_FROM = prefixType('SET_FROM', '@@skiprudy');
exports.SET_FROM = SET_FROM;
//# sourceMappingURL=types.js.map