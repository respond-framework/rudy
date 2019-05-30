"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExtraneousPopEvent = exports.removePopListener = exports.addPopListener = void 0;

/* eslint-env browser */
var addPopListener = function addPopListener(onPop, onHash) {
  var useHash = !supportsPopStateOnHashChange();
  addEventListener(window, 'popstate', onPop);
  if (useHash) addEventListener(window, 'hashchange', onHash);
};

exports.addPopListener = addPopListener;

var removePopListener = function removePopListener(onPop, onHash) {
  var useHash = !supportsPopStateOnHashChange();
  removeEventListener(window, 'popstate', onPop);
  if (useHash) removeEventListener(window, 'hashchange', onHash);
};

exports.removePopListener = removePopListener;

var addEventListener = function addEventListener(node, event, listener) {
  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent("on".concat(event), listener);
};

var removeEventListener = function removeEventListener(node, event, listener) {
  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent("on".concat(event), listener);
}; // Returns true if browser fires popstate on hash change. IE10 and IE11 do not.


var supportsPopStateOnHashChange = function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
};
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */


var isExtraneousPopEvent = function isExtraneousPopEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
};

exports.isExtraneousPopEvent = isExtraneousPopEvent;
//# sourceMappingURL=popListener.js.map