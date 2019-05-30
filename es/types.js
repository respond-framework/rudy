export var PREFIX = '@@rudy';
export var prefixType = function prefixType(type, prefix) {
  return "".concat(prefix || PREFIX, "/").concat(type);
};
export var CALL_HISTORY = prefixType('CALL_HISTORY');
export var NOT_FOUND = prefixType('NOT_FOUND');
export var ADD_ROUTES = prefixType('ADD_ROUTES');
export var CHANGE_BASENAME = prefixType('CHANGE_BASENAME');
export var CLEAR_CACHE = prefixType('CLEAR_CACHE');
export var CONFIRM = prefixType('CONFIRM');
export var BLOCK = prefixType('BLOCK', '@@skiprudy'); // these skip middleware pipeline, and are reducer-only

export var UNBLOCK = prefixType('UNBLOCK', '@@skiprudy');
export var SET_FROM = prefixType('SET_FROM', '@@skiprudy');
//# sourceMappingURL=types.js.map