"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportsDom = exports.supportsSession = exports.supportsHistory = void 0;

/* global window */
var _hasHistory;

var supportsHistory = function supportsHistory() {
  if (_hasHistory !== undefined) return _hasHistory;
  if (typeof window === 'undefined') return false;
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return _hasHistory = false;
  }

  return _hasHistory = window.history && 'pushState' in window.history;
};

exports.supportsHistory = supportsHistory;

var _hasSession;

var supportsSession = function supportsSession() {
  if (_hasSession !== undefined) return _hasSession;
  if (typeof window === 'undefined') return _hasSession = false;

  try {
    window.sessionStorage.setItem('hasStorage', 'yes');
    return _hasSession = window.sessionStorage.getItem('hasStorage') === 'yes';
  } catch (error) {
    return _hasSession = false;
  }
};

exports.supportsSession = supportsSession;

var supportsDom = function supportsDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
};

exports.supportsDom = supportsDom;
//# sourceMappingURL=supports.js.map