(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReduxFirstRouter"] = factory();
	else
		root["ReduxFirstRouter"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * Default configs.
 */
var DEFAULT_DELIMITER = '/'
var DEFAULT_DELIMITERS = './'

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined]
  '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER
  var delimiters = (options && options.delimiters) || DEFAULT_DELIMITERS
  var pathEscaped = false
  var res

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      pathEscaped = true
      continue
    }

    var prev = ''
    var next = str[index]
    var name = res[2]
    var capture = res[3]
    var group = res[4]
    var modifier = res[5]

    if (!pathEscaped && path.length) {
      var k = path.length - 1

      if (delimiters.indexOf(path[k]) > -1) {
        prev = path[k]
        path = path.slice(0, k)
      }
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
      pathEscaped = false
    }

    var partial = prev !== '' && next !== undefined && next !== prev
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = prev || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prev,
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
    })
  }

  // Push any remaining characters.
  if (path || index < str.length) {
    tokens.push(path + str.substr(index))
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (data, options) {
    var path = ''
    var encode = (options && options.encode) || encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token
        continue
      }

      var value = data ? data[token.name] : undefined
      var segment

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
        }

        if (value.length === 0) {
          if (token.optional) continue

          throw new TypeError('Expected "' + token.name + '" to not be empty')
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j], token)

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        segment = encode(String(value), token)

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
        }

        path += token.prefix + segment
        continue
      }

      if (token.optional) {
        // Prepend partial segment prefixes.
        if (token.partial) path += token.prefix

        continue
      }

      throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  if (!keys) return path

  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        pattern: null
      })
    }
  }

  return path
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER)
  var delimiters = options.delimiters || DEFAULT_DELIMITERS
  var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|')
  var route = ''
  var isEndDelimited = tokens.length === 0

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
      isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.repeat
        ? '(?:' + token.pattern + ')(?:' + prefix + '(?:' + token.pattern + '))*'
        : token.pattern

      if (keys) keys.push(token)

      if (token.optional) {
        if (token.partial) {
          route += prefix + '(' + capture + ')?'
        } else {
          route += '(?:' + prefix + '(' + capture + '))?'
        }
      } else {
        route += prefix + '(' + capture + ')'
      }
    }
  }

  if (end) {
    if (!strict) route += '(?:' + delimiter + ')?'

    route += endsWith === '$' ? '$' : '(?=' + endsWith + ')'
  } else {
    if (!strict) route += '(?:' + delimiter + '(?=' + endsWith + '))?'
    if (!isEndDelimited) route += '(?=' + delimiter + '|' + endsWith + ')'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys)
  }

  if (Array.isArray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
  }

  return stringToRegexp(/** @type {string} */ (path), keys, options)
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(5);
var parse = __webpack_require__(6);
var formats = __webpack_require__(4);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return onError; });
/* eslint-disable no-console */
var logError = function logError(type, error) {
  if (false) {} else if (false) {}
};

/* harmony default export */ __webpack_exports__["a"] = (logError);

var logCleanTestError = function logCleanTestError(args, error) {
  var shorten = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var isLog = !error;
  error = error || new Error();
  var stack = error.stack.split('\n');

  if (stack[1].indexOf('src/utils/logError.js') > -1) {
    stack.shift();
    stack.shift();
    if (shorten) stack.shift();
  }

  if (shorten) {
    var i = stack.findIndex(function (line) {
      return line.indexOf('compose.js') > -1;
    });
    stack = stack.slice(0, i);
  }

  var index = __dirname.indexOf('/src/');

  if (index === -1) {
    index = __dirname.indexOf('__tests__');
  }

  if (index === -1) {
    index = __dirname.indexOf('__helpers__');
  }

  if (index === -1) {
    index = __dirname.indexOf('__tests-helpers__');
  }

  var dir = __dirname.substr(0, index);

  var reg = new RegExp(dir, 'g');
  var trace = "\n".concat(stack.join('\n').replace(reg, ''));
  var message = isLog ? '' : 'RUDY ERROR:\n';

  if (args[0] && args[0].action) {
    console.log(message, args[0].action, trace);
  } else if (args.length === 1) {
    console.log(message, args[0], trace);
  } else if (args.length === 2) {
    console.log(message, args[0], args[1], trace);
  } else {
    console.log(message, args, trace);
  }
};

var onError = function onError(_ref) {
  var type = _ref.errorType,
      error = _ref.error,
      dispatch = _ref.dispatch;
  logError(type, error);
  return dispatch({
    type: type,
    error: error
  });
};

if (false) {}
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
        var item = queue.pop();
        obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }

    return obj;
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

var encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    return compactQueue(queue);
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);
var formats = __webpack_require__(4);

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder);
            val = options.decoder(part.slice(pos + 1), defaults.decoder);
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]') {
            obj = [];
            obj = obj.concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var supports_namespaceObject = {};
__webpack_require__.r(supports_namespaceObject);
__webpack_require__.d(supports_namespaceObject, "supportsHistory", function() { return supportsHistory; });
__webpack_require__.d(supports_namespaceObject, "supportsSession", function() { return supportsSession; });
__webpack_require__.d(supports_namespaceObject, "supportsDom", function() { return supportsDom; });
var popListener_namespaceObject = {};
__webpack_require__.r(popListener_namespaceObject);
__webpack_require__.d(popListener_namespaceObject, "addPopListener", function() { return addPopListener; });
__webpack_require__.d(popListener_namespaceObject, "removePopListener", function() { return removePopListener; });
__webpack_require__.d(popListener_namespaceObject, "isExtraneousPopEvent", function() { return isExtraneousPopEvent; });
var sessionStorage_namespaceObject = {};
__webpack_require__.r(sessionStorage_namespaceObject);
__webpack_require__.d(sessionStorage_namespaceObject, "saveHistory", function() { return saveHistory; });
__webpack_require__.d(sessionStorage_namespaceObject, "restoreHistory", function() { return restoreHistory; });
__webpack_require__.d(sessionStorage_namespaceObject, "clear", function() { return sessionStorage_clear; });
__webpack_require__.d(sessionStorage_namespaceObject, "set", function() { return sessionStorage_set; });
__webpack_require__.d(sessionStorage_namespaceObject, "get", function() { return sessionStorage_get; });
__webpack_require__.d(sessionStorage_namespaceObject, "pushState", function() { return pushState; });
__webpack_require__.d(sessionStorage_namespaceObject, "replaceState", function() { return replaceState; });

// CONCATENATED MODULE: ./src/history/utils/supports.js
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
var supportsDom = function supportsDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
};
// CONCATENATED MODULE: ./src/history/utils/popListener.js
/* eslint-env browser */
var addPopListener = function addPopListener(onPop, onHash) {
  var useHash = !supportsPopStateOnHashChange();
  addEventListener(window, 'popstate', onPop);
  if (useHash) addEventListener(window, 'hashchange', onHash);
};
var removePopListener = function removePopListener(onPop, onHash) {
  var useHash = !supportsPopStateOnHashChange();
  removeEventListener(window, 'popstate', onPop);
  if (useHash) removeEventListener(window, 'hashchange', onHash);
};

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
// CONCATENATED MODULE: ./src/history/utils/index.js



// CONCATENATED MODULE: ../utils/es/isServer.js
/* global window */
/* harmony default export */ var es_isServer = (function () {
  return !(typeof window !== 'undefined' && window.document && window.document.createElement);
});
// CONCATENATED MODULE: ../utils/es/createSelector.js
// TODO: Assess and add better flow annotations
/* harmony default export */ var es_createSelector = (function (name, selector) {
  if (typeof selector === 'function') {
    return selector;
  }

  if (selector) {
    return function (state) {
      return state ? state[selector] : undefined;
    };
  }

  return function (state) {
    return state ? state[name] : undefined;
  };
});
// CONCATENATED MODULE: ../utils/es/index.js


// CONCATENATED MODULE: ./src/utils/isHydrate.js

/* harmony default export */ var isHydrate = (function (req) {
  var _req$getLocation = req.getLocation(),
      universal = _req$getLocation.universal;

  return universal && !es_isServer() && req.getKind() === 'load';
});
// CONCATENATED MODULE: ./src/utils/isAction.js
/* harmony default export */ var isAction = (function (a) {
  return a && (a.type || // History uses actions with undefined states
  a.hasOwnProperty('state') || // eslint-disable-line no-prototype-builtins
  a.params || a.query || a.hash !== undefined || a.basename !== undefined || a.payload || a.meta);
});
// CONCATENATED MODULE: ./src/utils/isNotFound.js
/* harmony default export */ var isNotFound = (function (action) {
  var type = typeof action === 'string' ? action : action.type || '';
  return type.indexOf('NOT_FOUND') > -1 && type.indexOf('NOT_FOUND_') === -1; // don't include types like `NOT_FOUND_COMPLETE`
});
// CONCATENATED MODULE: ./src/utils/isRedirect.js
/* harmony default export */ var isRedirect = (function (action) {
  return !!(action && action.location && (action.location.kind === 'replace' || action.location.from));
}); // sometimes the kind will be back/next when automatic back/next detection is in play
// EXTERNAL MODULE: /home/daniel/oss/js/rudy/node_modules/path-to-regexp/index.js
var path_to_regexp = __webpack_require__(0);
var path_to_regexp_default = /*#__PURE__*/__webpack_require__.n(path_to_regexp);

// CONCATENATED MODULE: ./src/utils/applyDefaults.js
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var applyObjectDefault = function applyObjectDefault(defaultValue) {
  return defaultValue ? typeof defaultValue === 'function' ? defaultValue : function (provided) {
    return _objectSpread({}, defaultValue, provided);
  } : function (provided) {
    return provided;
  };
};
var applyStringDefault = function applyStringDefault(defaultValue) {
  return defaultValue ? typeof defaultValue === 'function' ? defaultValue : function (provided) {
    return provided || defaultValue;
  } : function (provided) {
    return provided;
  };
};
// CONCATENATED MODULE: ./src/utils/actionToUrl.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }




/* harmony default export */ var actionToUrl = (function (action, api, prevRoute) {
  var routes = api.routes,
      opts = api.options;
  var type = action.type,
      params = action.params,
      query = action.query,
      state = action.state,
      hash = action.hash,
      basename = action.basename;
  var route = routes[type] || {};
  var path = _typeof(route) === 'object' ? route.path : route;
  var p = actionToUrl_formatParams(params, route, opts) || {};
  var q = actionToUrl_formatQuery(query, route, opts);
  var s = actionToUrl_formatState(state, route, opts) || {};
  var h = actionToUrl_formatHash(hash || '', route, opts);
  var bn = cleanBasename(basename);
  var isWrongBasename = bn && !opts.basenames.includes(bn);
  if (basename === '') s._emptyBn = true; // not cool kyle

  try {
    if (isWrongBasename) {
      throw new Error("[rudy] basename \"".concat(bn, "\" not in options.basenames"));
    } // path-to-regexp throws for failed compilations


    var pathname = compileUrl(path, p, q, h, route, opts) || '/';
    var url = bn + pathname;
    return {
      url: url,
      state: s
    };
  } catch (e) {
    if (false) {} else if (false) {}

    var base = isWrongBasename ? '' : bn;

    var _url = base + notFoundUrl(action, routes, opts, q, h, prevRoute);

    return {
      url: _url,
      state: s
    };
  }
});

var actionToUrl_formatParams = function formatParams(params, route, opts) {
  params = applyObjectDefault(route.defaultParams || opts.defaultParams)(params, route, opts);

  if (params) {
    var keys = [];
    path_to_regexp_default()(typeof route === 'string' ? route : route.path, keys);
    var newParams = {};
    var toPath = route.toPath || opts.toPath || defaultToPath;
    keys.forEach(function (_ref) {
      var name = _ref.name,
          repeat = _ref.repeat,
          optional = _ref.optional;

      if (!Object.prototype.hasOwnProperty.call(params, name)) {
        return;
      } // $FlowFixMe


      var val = params[name];
      var urlVal = toPath(val, {
        name: name.toString(),
        repeat: repeat,
        optional: optional
      }, route, opts);

      if (repeat) {
        if (!Array.isArray(urlVal)) {
          throw Error('toPath failed');
        }

        if (!optional && !urlVal.length) {
          throw Error('toPath failed');
        }

        urlVal.forEach(function (segment) {
          if (typeof segment !== 'string' || !segment) {
            throw Error('toPath failed');
          }
        });
      } else if (typeof urlVal !== 'string' && (!optional || urlVal !== undefined)) {
        throw Error('toPath failed');
      }

      newParams[name.toString()] = urlVal;
    });
    return newParams;
  }

  return undefined;
};

var toSegment = function toSegment(val, convertNum, capitalize, optional) {
  if (typeof val === 'number' && convertNum) {
    return val.toString();
  }

  if (typeof val !== 'string' || optional && !val) {
    throw TypeError('[rudy]: defaultToPath::toSegment received unknown type');
  }

  if (capitalize) {
    return val.replace(/ /g, '-').toLowerCase();
  }

  return val;
};

var defaultToPath = function defaultToPath(val, _ref2, route, opts) {
  var repeat = _ref2.repeat,
      optional = _ref2.optional;
  var convertNum = route.convertNumbers || opts.convertNumbers && route.convertNumbers !== false;
  var capitalize = route.capitalizedWords || opts.capitalizedWords && route.capitalizedWords !== false;

  if (repeat) {
    if (optional && val === undefined) {
      return [];
    }

    if (!val) {
      throw Error('defaultToPath received incorrect value');
    }

    return val.split('/');
  }

  if (optional && val === undefined) {
    return undefined;
  }

  return toSegment(val, convertNum, capitalize, optional);
};
var actionToUrl_formatQuery = function formatQuery(query, route, opts) {
  query = applyObjectDefault(route.defaultQuery || opts.defaultQuery)(query, route, opts);
  var to = route.toSearch || opts.toSearch;

  if (to && query) {
    var newQuery = {};
    Object.keys(query).forEach(function (key) {
      // $FlowFixMe
      newQuery[key] = to(query[key], key, route, opts);
    });
    return newQuery;
  }

  return query;
};
var actionToUrl_formatHash = function formatHash(hash, route, opts) {
  hash = applyStringDefault(route.defaultHash || opts.defaultHash)(hash, route, opts);
  var to = route.toHash || opts.toHash;
  return to ? to(hash, route, opts) : hash;
};

var actionToUrl_formatState = function formatState(state, route, opts) {
  return applyObjectDefault(route.defaultState || opts.defaultState)(state, route, opts);
}; // state has no string counter part in the address bar, so there is no `toState`


var notFoundUrl = function notFoundUrl(action, routes, opts, query, hash) {
  var prevRoute = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var type = action.type || '';
  var route = routes[type] || {};
  var hasScene = type.indexOf('/NOT_FOUND') > -1; // TODO: Look into scene stuff
  // $FlowFixMe

  var scene = route.scene || prevRoute.scene || '';
  var t = hasScene ? type : routes["".concat(scene, "/NOT_FOUND")] // try to interpret scene-level NOT_FOUND if available (note: links create plain NOT_FOUND actions)
  ? "".concat(scene, "/NOT_FOUND") : 'NOT_FOUND';
  var p = routes[t].path || routes.NOT_FOUND.path || ''; // preserve these (why? because we can)

  var s = query && opts.stringifyQuery ? "?".concat(opts.stringifyQuery(query)) : '';
  var h = hash ? "#".concat(hash) : '';
  return p + s + h;
};
// CONCATENATED MODULE: /home/daniel/oss/js/rudy/node_modules/resolve-pathname/index.js
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) {
    fromParts.unshift('..');
  }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ var resolve_pathname = (resolvePathname);
// CONCATENATED MODULE: ./src/actions/redirect.js
function redirect_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { redirect_defineProperty(target, key, source[key]); }); } return target; }

function redirect_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* harmony default export */ var actions_redirect = (function (action) {
  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 302;
  return redirect_objectSpread({}, action, {
    location: redirect_objectSpread({}, action.location, {
      status: status,
      kind: 'replace'
    })
  });
});
// CONCATENATED MODULE: ./src/actions/notFound.js
/* harmony default export */ var notFound = (function (state, type) {
  return {
    type: type || 'NOT_FOUND',
    // type not meant for user to supply; it's passed by generated action creators
    state: state
  };
});
// CONCATENATED MODULE: ./src/types.js
var PREFIX = '@@rudy';
var prefixType = function prefixType(type, prefix) {
  return "".concat(prefix || PREFIX, "/").concat(type);
};
var CALL_HISTORY = prefixType('CALL_HISTORY');
var NOT_FOUND = prefixType('NOT_FOUND');
var ADD_ROUTES = prefixType('ADD_ROUTES');
var CHANGE_BASENAME = prefixType('CHANGE_BASENAME');
var CLEAR_CACHE = prefixType('CLEAR_CACHE');
var CONFIRM = prefixType('CONFIRM');
var BLOCK = prefixType('BLOCK', '@@skiprudy'); // these skip middleware pipeline, and are reducer-only

var UNBLOCK = prefixType('UNBLOCK', '@@skiprudy');
var SET_FROM = prefixType('SET_FROM', '@@skiprudy');
// CONCATENATED MODULE: ./src/actions/addRoutes.js

/* harmony default export */ var addRoutes = (function (routes, formatRoute) {
  return {
    type: ADD_ROUTES,
    payload: {
      routes: routes,
      formatRoute: formatRoute
    }
  };
}); // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
// CONCATENATED MODULE: ./src/actions/changeBasename.js
function changeBasename_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { changeBasename_defineProperty(target, key, source[key]); }); } return target; }

function changeBasename_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/* harmony default export */ var changeBasename = (function (basename, action) {
  if (!action) {
    return {
      type: CHANGE_BASENAME,
      payload: {
        basename: basename
      }
    };
  }

  return changeBasename_objectSpread({}, action, {
    basename: basename
  });
}); // NOTE: the first form with type `CHANGE_BASENAME` will trigger the pathlessRoute middleware
// see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
// CONCATENATED MODULE: ./src/actions/clearCache.js

/* harmony default export */ var clearCache = (function (invalidator, options) {
  return {
    type: CLEAR_CACHE,
    payload: {
      invalidator: invalidator,
      options: options
    }
  };
}); // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
// CONCATENATED MODULE: ./src/actions/confirm.js

/* harmony default export */ var actions_confirm = (function () {
  var canLeave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return {
    type: CONFIRM,
    payload: {
      canLeave: canLeave
    }
  };
}); // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
// CONCATENATED MODULE: ./src/actions/history.js

var history_push = function push(path, state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'push',
      args: [path, state]
    }
  };
};
var history_replace = function replace(path, state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'replace',
      args: [path, state]
    }
  };
};
var history_jump = function jump(delta, state, byIndex, n) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'jump',
      args: [delta, state, byIndex, n]
    }
  };
};
var history_reset = function reset(entries, index, n) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'reset',
      args: [entries, index, n]
    }
  };
};
var history_back = function back(state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'back',
      args: [state]
    }
  };
};
var history_next = function next(state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'next',
      args: [state]
    }
  };
};
var history_set = function set(action, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [action, n, byIndex]
    }
  };
};
var history_setParams = function setParams(params, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        params: params
      }, n, byIndex]
    }
  };
};
var history_setQuery = function setQuery(query, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        query: query
      }, n, byIndex]
    }
  };
};
var history_setState = function setState(state, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        state: state
      }, n, byIndex]
    }
  };
};
var history_setHash = function setHash(hash, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        hash: hash
      }, n, byIndex]
    }
  };
};
var history_setBasename = function setBasename(basename, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        basename: basename
      }, n, byIndex]
    }
  };
}; // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
// CONCATENATED MODULE: ./src/actions/index.js







// CONCATENATED MODULE: ./src/utils/urlToAction.js
function urlToAction_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { urlToAction_defineProperty(target, key, source[key]); }); } return target; }

function urlToAction_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/* harmony default export */ var urlToAction = (function (api, url) {
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : createKey();
  var getLocation = api.getLocation,
      routes = api.routes,
      opts = api.options;
  var curr = getLocation ? getLocation() : {};

  var _resolveBasename = urlToAction_resolveBasename(url, opts, state, curr),
      basename = _resolveBasename.basename,
      slashBasename = _resolveBasename.slashBasename;

  var location = urlToAction_createLocation(url, opts, slashBasename, curr);
  var action = urlToAction_createAction(location, routes, opts, state, curr);
  return urlToAction_objectSpread({}, action, {
    // { type, params, query, state, hash }
    basename: basename,
    location: {
      key: key,
      scene: routes[action.type].scene || '',
      url: slashBasename + locationToUrl(location),
      pathname: location.pathname,
      search: location.search
    }
  });
});

var urlToAction_createLocation = function createLocation(url, opts, bn, curr) {
  if (!url) {
    url = curr.pathname || '/';
  } else if (curr.pathname && url.charAt(0) !== '/') {
    url = resolve_pathname(url, curr.pathname); // resolve pathname relative to current location
  } else {
    url = stripBasename(url, bn); // eg: /base/foo?a=b#bar -> /foo?a=b#bar
  }

  return urlToLocation(url); // gets us: { pathname, search, hash } properly formatted
};

var urlToAction_createAction = function createAction(loc, routes, opts) {
  var st = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var curr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var types = Object.keys(routes).filter(function (type) {
    return routes[type].path;
  });

  for (var i = 0; i < types.length; i++) {
    var _type = types[i];
    var route = routes[_type];
    var transformers = {
      formatParams: urlToAction_formatParams,
      formatQuery: urlToAction_formatQuery,
      formatHash: urlToAction_formatHash
    };
    var match = matchUrl(loc, route, transformers, route, opts);

    if (match) {
      var params = match.params,
          query = match.query,
          hash = match.hash;
      var state = urlToAction_formatState(st, route, opts);
      return {
        type: _type,
        params: params,
        query: query,
        hash: hash,
        state: state
      };
    }
  }

  var _ref = routes[curr.type] || {},
      scene = _ref.scene; // TODO: Need some clairfication on scene stuff
  // $FlowFixMe


  var type = routes["".concat(scene, "/NOT_FOUND")] && "".concat(scene, "/NOT_FOUND"); // try to interpret scene-level NOT_FOUND if available (note: links create plain NOT_FOUND actions)

  return urlToAction_objectSpread({}, notFound(st, type), {
    params: {},
    // we can't know these in this case
    query: loc.search ? parseSearch(loc.search, routes, opts) : {},
    // keep this info
    hash: loc.hash || ''
  });
}; // EVERYTHING BELOW IS RELATED TO THE TRANSFORMERS PASSED TO `matchUrl`:


var urlToAction_formatParams = function formatParams(params, route, keys, opts) {
  var fromPath = route.fromPath || opts.fromPath || defaultFromPath;
  keys.forEach(function (_ref2) {
    var name = _ref2.name,
        repeat = _ref2.repeat,
        optional = _ref2.optional;

    if (!Object.prototype.hasOwnProperty.call(params, name)) {
      return;
    }

    var val = params[name]; // don't decode undefined values from optional params

    params[name] = fromPath(val, {
      name: name.toString(),
      repeat: repeat,
      optional: optional
    }, route, opts);

    if (params[name] === undefined) {
      // allow optional params to be overriden by defaultParams
      delete params[name];
    }
  });
  var def = route.defaultParams || opts.defaultParams;
  return def ? typeof def === 'function' ? def(params, route, opts) : urlToAction_objectSpread({}, def, params) : params;
};

var fromSegment = function fromSegment(val, convertNum, capitalize) {
  if (typeof val !== 'string') {
    // defensive
    throw TypeError('[rudy]: received invalid type from URL');
  }

  if (convertNum && isNumber(val)) {
    return Number.parseFloat(val);
  }

  if (capitalize) {
    // 'my-category' -> 'My Category'
    return val.replace(/-/g, ' ').replace(/\b\w/g, function (ltr) {
      return ltr.toUpperCase();
    });
  }

  return val;
};

var defaultFromPath = function defaultFromPath(val, _ref3, route, opts) {
  var repeat = _ref3.repeat,
      optional = _ref3.optional;
  var convertNum = route.convertNumbers || opts.convertNumbers && route.convertNumbers !== false;
  var capitalize = route.capitalizedWords || opts.capitalizedWords && route.capitalizedWords !== false;

  if (repeat && (Array.isArray(val) || val === undefined)) {
    return val && val.length ? val.join('/') : undefined;
  }

  if (!repeat && optional && val === undefined) {
    return undefined;
  }

  if (typeof val === 'string') {
    return fromSegment(val, convertNum, capitalize);
  } // defensive


  throw TypeError("[rudy]: Received invalid param from URL");
};

var urlToAction_formatQuery = function formatQuery(query, route, opts) {
  // TODO: Is this fromPath ? its got the same props going into it?
  // $FlowFixMe
  var from = route.fromSearch || opts.fromSearch;

  if (from) {
    Object.keys(query).forEach(function (key) {
      query[key] = from(query[key], key, route, opts);

      if (query[key] === undefined) {
        // allow undefined values to be overridden by defaultQuery
        delete query[key];
      }
    });
  }

  var def = route.defaultQuery || opts.defaultQuery;
  return def ? typeof def === 'function' ? def(query, route, opts) : urlToAction_objectSpread({}, def, query) : query;
};

var urlToAction_formatHash = function formatHash(hash, route, opts) {
  // TODO: is this toHash?
  // $FlowFixMe
  var from = route.fromHash || opts.fromHash; // $FlowFixMe

  hash = from ? from(hash, route, opts) : hash;
  var def = route.defaultHash || opts.defaultHash;
  return def ? typeof def === 'function' ? def(hash, route, opts) : hash || def : hash;
};

var urlToAction_formatState = function formatState(state, route, opts) {
  var def = route.defaultState || opts.defaultState;
  return def ? typeof def === 'function' ? def(state, route, opts) : urlToAction_objectSpread({}, def, state) : state;
}; // state has no string counter part in the address bar, so there is no `fromState`


var isNumber = function isNumber(str) {
  return !Number.isNaN(Number.parseFloat(str));
};

var parseSearch = function parseSearch(search, routes, opts) {
  return (routes.NOT_FOUND.parseSearch || opts.parseSearch)(search);
}; // BASENAME HANDLING:


var urlToAction_resolveBasename = function resolveBasename(url, opts, state, curr) {
  // TODO: Whats going on with this huge option type?
  // $FlowFixMe
  var bn = state._emptyBn ? '' : findBasename(url, opts.basenames) || curr.basename;
  var slashBasename = cleanBasename(bn);
  var basename = slashBasename.replace(/^\//, ''); // eg: '/base' -> 'base'

  delete state._emptyBn; // not cool kyle

  return {
    basename: basename,
    slashBasename: slashBasename // { 'base', '/base' }

  };
};

var stripBasename = function stripBasename(path, bn) {
  return path.indexOf(bn) === 0 ? path.substr(bn.length) : path;
};
var findBasename = function findBasename(path) {
  var bns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return bns.find(function (bn) {
    return path.indexOf(bn) === 0;
  });
}; // MISC

var createKey = function createKey() {
  if (false) {}

  return Math.random().toString(36).substr(2, 6);
};
// CONCATENATED MODULE: ./src/utils/toAction.js
function toAction_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { toAction_typeof = function _typeof(obj) { return typeof obj; }; } else { toAction_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return toAction_typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


// This will take anything you throw at it (a url string, action, or array: [url, state, key?])
// and convert it to a complete Rudy FSRA ("flux standard routing action").
// Standard Rudy practice is to convert incoming actions to their full URL form (url + state)
// and then convert that to a FSRA. THIS DOES BOTH STEPS IN ONE WHEN NECESSSARY (i.e. for actions).
/* harmony default export */ var toAction = (function (api, entry, st, k) {
  if (Array.isArray(entry)) {
    // entry as array of [url, state, key?]
    var _entry = _slicedToArray(entry, 3),
        url = _entry[0],
        state = _entry[1],
        key = _entry[2];

    return urlToAction(api, url, state, key);
  }

  if (toAction_typeof(entry) === 'object') {
    // entry as action object
    var _key = entry.location && entry.location.key; // preserve existing key if existing FSRA


    var _actionToUrl = actionToUrl(entry, api),
        _url = _actionToUrl.url,
        _state = _actionToUrl.state;

    return urlToAction(api, _url, _state, _key);
  }

  return urlToAction(api, entry, st, k); // entry as url string
});
// CONCATENATED MODULE: ./src/utils/locationToUrl.js
/* harmony default export */ var locationToUrl = (function (location) {
  if (typeof location === 'string') return location;
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';

  if (search && search !== '?') {
    path += search.charAt(0) === '?' ? search : "?".concat(search);
  }

  if (hash && hash !== '#') {
    path += hash.charAt(0) === '#' ? hash : "#".concat(hash);
  }

  return path;
});
// CONCATENATED MODULE: ./src/utils/urlToLocation.js
function urlToLocation_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { urlToLocation_typeof = function _typeof(obj) { return typeof obj; }; } else { urlToLocation_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return urlToLocation_typeof(obj); }

var createLocationObject = function createLocationObject(url) {
  var pathname = url || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex + 1); // remove # from hash

    pathname = pathname.substr(0, hashIndex); // remove hash value from pathname
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex + 1); // remove ? from search

    pathname = pathname.substr(0, searchIndex); // remove search value from pathname
  }

  pathname = pathname || '/'; // could be empty on URLs that like: '?foo=bar#hash

  return {
    pathname: pathname,
    search: search,
    hash: hash
  };
};

/* harmony default export */ var urlToLocation = (function (url) {
  if (urlToLocation_typeof(url) === 'object' && url.pathname !== undefined) return url;
  return createLocationObject(url);
});
// CONCATENATED MODULE: ./src/utils/doesRedirect.js

/* harmony default export */ var doesRedirect = (function (action, redirectFunc) {
  if (isRedirect(action)) {
    var url = action.location.url;
    var status = action.location.status || 302;

    if (typeof redirectFunc === 'function') {
      redirectFunc(status, url, action);
    } else if (redirectFunc && typeof redirectFunc.redirect === 'function') {
      redirectFunc.redirect(status, url);
    }

    return true;
  }

  return false;
});
// CONCATENATED MODULE: ./src/utils/shouldTransition.js

/* harmony default export */ var shouldTransition = (function (action, _ref) {
  var routes = _ref.routes;
  var _action$type = action.type,
      type = _action$type === void 0 ? '' : _action$type;
  var route = routes[type];
  return route || type.indexOf(PREFIX) > -1;
});
// CONCATENATED MODULE: ./src/utils/matchUrl.js
function matchUrl_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { matchUrl_typeof = function _typeof(obj) { return typeof obj; }; } else { matchUrl_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return matchUrl_typeof(obj); }

function _toArray(arr) { return matchUrl_arrayWithHoles(arr) || _iterableToArray(arr) || matchUrl_nonIterableRest(); }

function matchUrl_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function matchUrl_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



/* harmony default export */ var matchUrl = (function (loc, matchers) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var route = arguments.length > 3 ? arguments[3] : undefined;
  var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var _urlToLocation = urlToLocation(loc),
      pathname = _urlToLocation.pathname,
      search = _urlToLocation.search,
      h = _urlToLocation.hash;

  var _matchPath = matchPath(pathname, matchers.path, options),
      match = _matchPath.match,
      keys = _matchPath.keys;

  if (!match) return null;
  var query = matchQuery(search, matchers.query, route, opts);
  if (!query) return null;
  var hash = matchHash(h, matchers.hash, route, opts);
  if (hash === null) return null;

  var _match = _toArray(match),
      path = _match[0],
      values = _match.slice(1);

  var params = keys.reduce(function (_params, key, index) {
    if (key.repeat) {
      // Multi segment params come out as arrays of decoded segments
      // If optional multi segment params are not provided, an empty array
      _params[key.name] = values[index] ? values[index].split('/').map(decodeURIComponent) : [];
    } else {
      _params[key.name] = typeof values[index] === 'string' ? decodeURIComponent(values[index]) : undefined;
    }

    return _params;
  }, {});
  var formatParams = options.formatParams,
      formatQuery = options.formatQuery,
      formatHash = options.formatHash;
  return {
    params: formatParams ? formatParams(params, route, keys, opts) : params,
    query: formatQuery ? formatQuery(query, route, opts) : query,
    hash: formatHash ? formatHash(hash || '', route, opts) : hash || '',
    matchedPath: matchers.path === '/' && path === '' ? '/' : path,
    // the matched portion of the URL/path
    matchers: matchers,
    partial: !!options.partial // const url = matchers.path === '/' && path === '' ? '/' : path // the matched portion of the path
    // return {
    //   path: matchers.path,
    //   url, // called `url` instead of `path` for compatibility with React Router
    //   isExact: pathname === path,
    //   params: fromPath ? fromPath(params, route, opts) : params,
    //   query: fromSearch ? fromSearch(query, route, opts) : query,
    //   hash: fromHash ? fromHash(hash || '', route, opts) : (hash || '')
    // }

  };
});

var matchPath = function matchPath(pathname, matcher) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _compilePath = matchUrl_compilePath(matcher, options),
      re = _compilePath.re,
      keys = _compilePath.keys;

  var match = re.exec(pathname);
  if (!match || options.exact && match[0] !== pathname) return {};
  return {
    match: match,
    keys: keys
  };
};

var matchQuery = function matchQuery(search, matcher, route, opts) {
  var query = search ? matchUrl_parseSearch(search, route, opts) : {};
  if (!matcher) return query;

  var matchFails = function matchFails(key) {
    return !matchVal(query[key], matcher[key], key, route, opts);
  };

  if (Object.keys(matcher).some(matchFails)) return null;
  return query;
};
var matchHash = function matchHash() {
  var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var expected = arguments.length > 1 ? arguments[1] : undefined;
  var route = arguments.length > 2 ? arguments[2] : undefined;
  var opts = arguments.length > 3 ? arguments[3] : undefined;
  if (expected === undefined) return hash;
  return matchVal(hash, expected, 'hash', route, opts) ? hash : null;
};
var matchVal = function matchVal(val, // TODO: What flow-type is best for expected
// $FlowFixMe
expected, key, route, opts) {
  var type = matchUrl_typeof(expected);

  if (type === 'boolean') {
    if (expected === true) {
      return val !== '' && val !== undefined;
    }

    return val === undefined || val === '';
  }

  if (type === 'string') {
    return expected === val;
  }

  if (type === 'function') {
    return key === 'hash' ? // $FlowFixMe
    expected(val, route, opts) : // $FlowFixMe
    expected(val, key, route, opts);
  }

  if (expected instanceof RegExp) {
    return expected.test(val);
  }

  return true;
};

var matchUrl_parseSearch = function parseSearch(search, route, opts) {
  if (queries[search]) return queries[search];
  var parse = route.parseSearch || opts.parseSearch;
  queries[search] = parse(search);
  return queries[search];
};

var queries = {};
var patternCache = {};
var cacheLimit = 10000;
var cacheCount = 0;

var matchUrl_compilePath = function compilePath(pattern) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$partial = options.partial,
      partial = _options$partial === void 0 ? false : _options$partial,
      _options$strict = options.strict,
      strict = _options$strict === void 0 ? false : _options$strict;
  var cacheKey = "".concat(partial ? 't' : 'f').concat(strict ? 't' : 'f');
  var cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});
  if (cache[pattern]) return cache[pattern];
  var keys = [];
  var re = path_to_regexp_default()(pattern, keys, {
    end: !partial,
    strict: strict
  });
  var compiledPattern = {
    re: re,
    keys: keys
  };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount += 1;
  } // TODO: Not sure the best way to construct this one
  // $FlowFixMe


  return compiledPattern;
};
// CONCATENATED MODULE: ./src/utils/compileUrl.js


var toPathCache = {};
/* harmony default export */ var compileUrl = (function (path) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var query = arguments.length > 2 ? arguments[2] : undefined;
  var hash = arguments.length > 3 ? arguments[3] : undefined;
  var route = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var opts = arguments.length > 5 ? arguments[5] : undefined;
  var search = query ? stringify(query, route, opts) : '';

  if (route.query && !matchQuery(search, route.query, route, opts)) {
    throw new Error('[rudy] invalid query object');
  }

  if (route.hash !== undefined && matchHash(hash, route.hash, route, opts) == null) {
    throw new Error('[rudy] invalid hash value');
  }

  toPathCache[path] = toPathCache[path] || Object(path_to_regexp["compile"])(path);
  var toPath = toPathCache[path];
  var p = toPath(params);
  var s = search ? "?".concat(search) : '';
  var h = hash ? "#".concat(hash) : '';
  return p + s + h;
});

var stringify = function stringify(query, route, opts) {
  var search = (route.stringifyQuery || opts.stringifyQuery)(query);

  if (false) {}

  return search;
};
// CONCATENATED MODULE: ./src/middleware/call/utils/enhanceRoutes.js
/* harmony default export */ var enhanceRoutes = (function (name, routes, options) {
  for (var type in routes) {
    var route = routes[type];
    var cb = route[name];
    var callback = findCallback(name, routes, cb, route, options);
    if (callback) route[name] = callback;
  }

  return routes;
});

var findCallback = function findCallback(name, routes, callback, route, options) {
  if (typeof callback === 'function') {
    return callback;
  }

  if (Array.isArray(callback)) {
    var callbacks = callback;
    var pipeline = callbacks.map(function (cb) {
      return function (req, next) {
        cb = findCallback(name, routes, cb, route);
        var prom = Promise.resolve(cb(req));
        return prom.then(complete(next));
      };
    });
    var killOnRedirect = !!route.path;
    return options.compose(pipeline, null, killOnRedirect);
  }

  if (typeof callback === 'string') {
    var type = callback;
    var inheritedRoute = routes["".concat(route.scene, "/").concat(type)] || routes[type];
    var cb = inheritedRoute[name];
    return findCallback(name, routes, cb, inheritedRoute);
  }

  if (typeof route.inherit === 'string') {
    var _type = route.inherit;

    var _inheritedRoute = routes["".concat(route.scene, "/").concat(_type)] || routes[_type];

    var _cb = _inheritedRoute[name];
    return findCallback(name, routes, _cb, _inheritedRoute);
  }
};

var complete = function complete(next) {
  return function (res) {
    return next().then(function () {
      return res;
    });
  };
};
// CONCATENATED MODULE: ./src/middleware/call/utils/shouldCall.js


/* harmony default export */ var shouldCall = (function (name, route, req, _ref) {
  var runOnServer = _ref.runOnServer,
      runOnHydrate = _ref.runOnHydrate;
  if (!route[name] && !req.options[name]) return false;
  if (isHydrate(req) && !runOnHydrate) return false;
  if (es_isServer() && !runOnServer) return false;
  return allowBoth;
});
var allowBoth = {
  route: true,
  options: true // If for instance, you wanted to allow each route to decide
  // whether to skip options callbacks, here's a simple way to do it:
  //
  // return {
  //   options: !route.skipOpts, // if true, don't make those calls
  //   route: true
  // }
  //
  // You also could choose to automatically trigger option callbacks only as a fallback:
  //
  // return {
  //   options: !route[name],
  //   route: !!route[name]
  // }

};
// CONCATENATED MODULE: ./src/middleware/call/utils/createCache.js



var defaultCreateCacheKey = function defaultCreateCacheKey(action, name) {
  var type = action.type,
      basename = action.basename,
      location = action.location;
  var pathname = location.pathname,
      search = location.search;
  return "".concat(name, "|").concat(type, "|").concat(basename, "|").concat(pathname, "|").concat(search); // don't cache using URL hash, as in 99.999% of all apps its the same route
};

var createCache_callbacks = [];
/* harmony default export */ var createCache = (function (api, name, config) {
  if (config.prev) {
    throw new Error("[rudy] call('".concat(name, "') middleware 'cache' option cannot be used with 'prev' option"));
  }

  createCache_callbacks.push(name);
  if (api.cache) return api.cache;
  var _api$options$createCa = api.options.createCacheKey,
      createCacheKey = _api$options$createCa === void 0 ? defaultCreateCacheKey : _api$options$createCa;
  var cache = config.cacheStorage = config.cacheStorage || {};

  var isCached = function isCached(name, route, req) {
    if (es_isServer()) return false;
    var options = req.options,
        action = req.action;
    if (!route.path || route.cache === false) return false;
    if (options.cache === false && route.cache === undefined) return false;
    var key = createCacheKey(action, name);

    if (req.getKind() === 'load' && req.isUniversal()) {
      cache[key] = true;
    }

    if (cache[key]) return true;
    return false;
  };

  var cacheAction = function cacheAction(name, action) {
    var key = createCacheKey(action, name);
    cache[key] = true;
    return key;
  };

  var clear = function clear(invalidator) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!invalidator) {
      for (var k in cache) {
        delete cache[k];
      }
    } else if (typeof invalidator === 'function') {
      // allow user to customize cache clearing algo
      var newCache = invalidator(cache, api, opts); // invalidators should mutably operate on the cache hash

      if (newCache) {
        // but if they don't we'll merge into the same object reference
        for (var _k in cache) {
          delete cache[_k];
        }

        Object.assign(cache, newCache);
      }
    } else if (typeof invalidator === 'string') {
      // delete all cached items for TYPE or other string
      for (var _k2 in cache) {
        if (_k2.indexOf(invalidator) > -1) delete cache[_k2];
      }
    } else {
      // delete all/some callbacks for precise item (default)
      var action = invalidator;
      var act = toAction(api, action);
      var names = opts.name === undefined ? createCache_callbacks : [].concat(opts.name);
      names.forEach(function (name) {
        var key = createCacheKey(act, name);
        delete cache[key];
      });
    }
  };

  return {
    isCached: isCached,
    cacheAction: cacheAction,
    clear: clear
  };
});
// CONCATENATED MODULE: ./src/middleware/call/utils/autoDispatch.js
/* harmony default export */ var autoDispatch = (function (req, callback, route, name, isOptCb) {
  return Promise.resolve(callback(req)).then(function (res) {
    return tryDispatch(req, res, route, name, isOptCb);
  });
});

var tryDispatch = function tryDispatch(req, res, route, name, isOptCb) {
  if (res === false) return false;
  var hasReturn = res === null || res && !res._dispatched; // `res._dispatched` indicates it was manually dispatched

  if (hasReturn && isAutoDispatch(route, req.options, isOptCb)) {
    // if no dispatch was detected, and a result was returned, dispatch it automatically
    return Promise.resolve(req.dispatch(res));
  }

  return res;
};

var isAutoDispatch = function isAutoDispatch(route, options, isOptCb) {
  return isOptCb ? options.autoDispatch === undefined ? true : options.autoDispatch : route.autoDispatch !== undefined ? route.autoDispatch : options.autoDispatch === undefined ? true : options.autoDispatch;
};
// CONCATENATED MODULE: ./src/middleware/call/utils/index.js




// CONCATENATED MODULE: ./src/pathlessRoutes/addRoutes.js
 // unfortunate coupling (to potentially optional middleware)


/* harmony default export */ var pathlessRoutes_addRoutes = (function (req) {
  var action = req.action,
      options = req.options,
      allRoutes = req.routes,
      has = req.has;
  var env = "production";

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use "addRoutes" action creator.');
  }

  var _action$payload = action.payload,
      routes = _action$payload.routes,
      formatRoute = _action$payload.formatRoute;
  var formatter = formatRoute || options.formatRoute;
  var newRoutes = formatRoutes(routes, formatter, true);
  var callbacks = options.callbacks || [];
  callbacks.forEach(function (name) {
    return enhanceRoutes(name, newRoutes, options);
  });
  Object.assign(allRoutes, newRoutes);
  action.payload.routes = newRoutes;
  action.payload.routesAdded = Object.keys(routes).length; // we need something to triggering updating of Link components when routes added

  req.commitDispatch(action);
});
// CONCATENATED MODULE: ./src/pathlessRoutes/changeBasename.js
/* harmony default export */ var pathlessRoutes_changeBasename = (function (_ref) {
  var getLocation = _ref.getLocation,
      has = _ref.has,
      action = _ref.action,
      dispatch = _ref.dispatch;
  var env = "production";

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use "changeBasename" action creator without passing an action.');
  }

  var _getLocation = getLocation(),
      type = _getLocation.type,
      params = _getLocation.params,
      query = _getLocation.query,
      state = _getLocation.state,
      hash = _getLocation.hash;

  var basename = action.payload.basename;
  return dispatch({
    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename
  });
});
// CONCATENATED MODULE: ./src/pathlessRoutes/clearCache.js
/* harmony default export */ var pathlessRoutes_clearCache = (function (_ref) {
  var cache = _ref.cache,
      action = _ref.action,
      has = _ref.has;
  var env = "production";

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use "clearCache" action creator.');
  }

  var _action$payload = action.payload,
      invalidator = _action$payload.invalidator,
      options = _action$payload.options;
  cache.clear(invalidator, options);
});
// CONCATENATED MODULE: ./src/pathlessRoutes/confirm.js
/* harmony default export */ var pathlessRoutes_confirm = (function (req) {
  var ctx = req.ctx,
      action = req.action,
      has = req.has;
  var env = "production";

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use "confirm" action creator.');
  }

  req._dispatched = true;
  var canLeave = action.payload.canLeave;
  return ctx.confirm(canLeave);
});
// CONCATENATED MODULE: ./src/pathlessRoutes/callHistory.js
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || callHistory_iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function callHistory_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var callHistory_env = "production";
/* harmony default export */ var callHistory = (function (req) {
  var history = req.history,
      has = req.has,
      dispatch = req.dispatch,
      payload = req.action.payload;

  if (callHistory_env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use history action creators.');
  }

  var method = payload.method,
      args = payload.args;
  if (method === 'set') return handleEdgeCaseForSet(req, args);
  var action = history[method].apply(history, _toConsumableArray(args).concat([false]));
  return dispatch(action);
}); // only state can be set before route change is committed,
// as otherwise the prev URL would change and break BrowserHistory entries tracking
// NOTE: we could greatly change the implementation to support this small thing, but its not worth the complexity;
// even just supporting setState on a previous route (while in the pipeline) is frill, but we'll soon see if people
// get use out of it.

var handleEdgeCaseForSet = function handleEdgeCaseForSet(_ref, args) {
  var ctx = _ref.ctx,
      tmp = _ref.tmp,
      commitDispatch = _ref.commitDispatch,
      history = _ref.history;

  if (ctx.pending && !tmp.committed) {
    if (!isOnlySetState(args[0])) {
      throw new Error('[rudy] you can only set state on a previous url before enter');
    } // mutable workaround to insure state is applied to ongoing action


    var prevState = ctx.pending.action.location.prev.state;
    Object.assign(prevState, args[0].state);
  }

  var _history$set = history.set.apply(history, _toConsumableArray(args).concat([false])),
      commit = _history$set.commit,
      action = _objectWithoutProperties(_history$set, ["commit"]); // unlike other actions, sets go straight to reducer (and browser history) and skip pipeline.
  // i.e. it's purpose is to be a "hard" set


  commitDispatch(action);
  action._dispatched = true; // insure autoDispatch is prevented since its dispatched already here (similar to the implementation of `request.dispatch`)

  return commit(action).then(function () {
    return action;
  });
};

var isOnlySetState = function isOnlySetState(action) {
  return action.state && Object.keys(action).length === 1;
};
// CONCATENATED MODULE: ./src/pathlessRoutes/index.js





// CONCATENATED MODULE: ./src/utils/formatRoutes.js


/* harmony default export */ var formatRoutes = (function (input, formatter) {
  var isAddRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var routes = isAddRoutes ? input : {};

  if (!isAddRoutes) {
    routes.NOT_FOUND = input.NOT_FOUND || {
      path: '/not-found'
    };
    Object.assign(routes, input); // insure '/not-found' matches over '/:param?' -- yes, browsers respect order assigned for non-numeric keys

    routes[ADD_ROUTES] = input[ADD_ROUTES] || {
      thunk: pathlessRoutes_addRoutes,
      dispatch: false
    };
    routes[CHANGE_BASENAME] = input[CHANGE_BASENAME] || {
      thunk: pathlessRoutes_changeBasename,
      dispatch: false
    };
    routes[CLEAR_CACHE] = input[CLEAR_CACHE] || {
      thunk: pathlessRoutes_clearCache
    };
    routes[CONFIRM] = input[CONFIRM] || {
      thunk: pathlessRoutes_confirm,
      dispatch: false
    };
    routes[CALL_HISTORY] = input[CALL_HISTORY] || {
      thunk: callHistory,
      dispatch: false
    };
  }

  var types = Object.keys(routes);
  types.forEach(function (type) {
    var route = formatRoutes_formatRoute(routes[type], type, routes, formatter, isAddRoutes);
    route.type = type;
    routes[type] = route;
  });
  return routes;
});
var formatRoutes_formatRoute = function formatRoute(r, type, routes, formatter) {
  var isAddRoutes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var route = typeof r === 'string' ? {
    path: r
  } : r;

  if (formatter) {
    return formatter(route, type, routes, isAddRoutes);
  }

  if (typeof route === 'function') {
    return {
      thunk: route
    };
  }

  return route;
};
// CONCATENATED MODULE: ./src/utils/typeToScene.js
/* harmony default export */ var typeToScene = (function (type) {
  var i = type.lastIndexOf('/');
  return type.substr(0, i);
});
// CONCATENATED MODULE: ./src/utils/redirectShortcut.js
function redirectShortcut_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { redirectShortcut_defineProperty(target, key, source[key]); }); } return target; }

function redirectShortcut_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/* harmony default export */ var redirectShortcut = (function (_ref) {
  var route = _ref.route,
      routes = _ref.routes,
      action = _ref.action,
      dispatch = _ref.dispatch;
  var t = route.redirect; // $FlowFixMe

  var scenicType = "".concat(route.scene, "/").concat(t);
  var type = routes[scenicType] ? scenicType : t; // $FlowFixMe

  return dispatch(actions_redirect(redirectShortcut_objectSpread({}, action, {
    type: type
  }), 301));
});
// CONCATENATED MODULE: ./src/utils/callRoute.js
function callRoute_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { callRoute_typeof = function _typeof(obj) { return typeof obj; }; } else { callRoute_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return callRoute_typeof(obj); }

/* harmony default export */ var callRoute = (function (routes) {
  return function (action, key) {
    var type = typeof action === 'string' ? action : action.type;
    var route = routes[type];
    if (!route) return null;
    if (!key) return route;
    if (typeof route[key] !== 'function') return route[key];
    action = callRoute_typeof(action) === 'object' ? action : {
      type: type
    };

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return route[key].apply(route, [action].concat(args));
  };
}); // usage:
// callRoute(routes)(action, key, ...args)
// CONCATENATED MODULE: ./src/utils/noOp.js
/* harmony default export */ var noOp = (function () {
  return Promise.resolve();
});
// CONCATENATED MODULE: ./src/utils/nestAction.js
function nestAction_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { nestAction_defineProperty(target, key, source[key]); }); } return target; }

function nestAction_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function nestAction_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = nestAction_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function nestAction_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }


/* harmony default export */ var nestAction = (function (action, prevState, fromAction, statusCode) {
  var tmp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var location = action.location,
      type = action.type,
      basename = action.basename,
      params = action.params,
      query = action.query,
      state = action.state,
      hash = action.hash;
  var entries = location.entries,
      index = location.index,
      length = location.length,
      pathname = location.pathname,
      search = location.search,
      url = location.url,
      key = location.key,
      scene = location.scene,
      n = location.n;
  var prev = createActionRef(prevState);
  var from = createActionRef(fromAction);
  var kind = resolveKind(location.kind, tmp.load, from);
  var direction = n === -1 ? 'backward' : 'forward';
  var pop = !!tmp.revertPop;
  var status = from ? statusCode || 302 : isNotFound(type) ? 404 : 200;
  return {
    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename,
    location: {
      kind: kind,
      direction: direction,
      n: n,
      url: url,
      pathname: pathname,
      search: search,
      key: key,
      scene: scene,
      prev: prev,
      from: from,
      blocked: null,
      entries: entries,
      index: index,
      length: length,
      pop: pop,
      status: status
    }
  };
});
var createActionRef = function createActionRef(actionOrState) {
  if (!actionOrState) return null; // if `prev` or redirect action from outside of pipeline, we receive the state instead (see ./formatAction.js)

  if (!actionOrState.location) {
    var type = actionOrState.type,
        params = actionOrState.params,
        query = actionOrState.query,
        state = actionOrState.state,
        hash = actionOrState.hash,
        basename = actionOrState.basename,
        rest = nestAction_objectWithoutProperties(actionOrState, ["type", "params", "query", "state", "hash", "basename"]);

    var location = createLocationRef(rest);
    var action = {
      type: type,
      params: params,
      query: query,
      state: state,
      hash: hash,
      basename: basename,
      location: location
    };
    return action;
  } // if redirect occurred during pipeline, we receive an action representing the previous state


  return nestAction_objectSpread({}, actionOrState, {
    location: createLocationRef(nestAction_objectSpread({}, actionOrState.location))
  });
};

var createLocationRef = function createLocationRef(loc) {
  delete loc.prev;
  delete loc.from;
  delete loc.blocked;
  delete loc.universal;
  delete loc.length;
  delete loc.kind;
  delete loc.entries;
  delete loc.pop;
  delete loc.status;
  delete loc.direction;
  delete loc.n;
  delete loc.universal;
  delete loc.ready;
  return loc;
};

var resolveKind = function resolveKind(kind, isLoad, from) {
  if (isLoad) return 'load'; // insure redirects don't change kind on load

  if (!from) return kind; // PRIMARY USE CASE: preverse the standard kind
  // pipeline redirects before enter are in fact pushes, but users shouldn't
  // have to think about that -- using `kind.replace` preserves back/next kinds

  return kind.replace('push', 'replace');
};
// EXTERNAL MODULE: ./src/utils/logError.js
var logError = __webpack_require__(2);

// CONCATENATED MODULE: ./src/utils/cleanBasename.js
/* harmony default export */ var cleanBasename = (function () {
  var bn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return !bn ? '' : stripTrailingSlash(addLeadingSlash(bn));
});

var addLeadingSlash = function addLeadingSlash(bn) {
  return bn.charAt(0) === '/' ? bn : "/".concat(bn);
};

var stripTrailingSlash = function stripTrailingSlash(bn) {
  return bn.charAt(bn.length - 1) === '/' ? bn.slice(0, -1) : bn;
};
// EXTERNAL MODULE: ./node_modules/qs/lib/index.js
var lib = __webpack_require__(1);
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);

// CONCATENATED MODULE: ./src/utils/parseSearch.js

/* harmony default export */ var utils_parseSearch = (function (search) {
  return lib_default.a.parse(search, {
    decoder: decoder
  });
});

var decoder = function decoder(str, decode) {
  return parseSearch_isNumber(str) ? Number.parseFloat(str) : decode(str);
};

var parseSearch_isNumber = function isNumber(str) {
  return !Number.isNaN(Number.parseFloat(str));
};
// CONCATENATED MODULE: ./src/utils/toEntries.js
function toEntries_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { toEntries_typeof = function _typeof(obj) { return typeof obj; }; } else { toEntries_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return toEntries_typeof(obj); }


/* harmony default export */ var toEntries = (function (api, entries, index, n) {
  entries = isSingleEntry(entries) ? [entries] : entries;
  entries = entries.length === 0 ? ['/'] : entries;
  entries = entries.map(function (e) {
    return toAction(api, e);
  });
  index = index !== undefined ? index : entries.length - 1; // default to head of array

  index = Math.min(Math.max(index, 0), entries.length - 1); // insure the index is in range

  n = n || findInitialN(index, entries); // initial direction the user is going across the history track

  return {
    n: n,
    index: index,
    entries: entries
  };
}); // When entries are restored on load, the direction is always forward if on an index > 0
// because the corresponding entries are removed (just like a `push`), and you are now at the head.
// Otherwise, if there are multiple entries and you are on the first, you're considered
// to be going back, but if there is one, you're logically going forward.

var findInitialN = function findInitialN(index, entries) {
  return index > 0 ? 1 : entries.length > 1 ? -1 : 1;
};

var isSingleEntry = function isSingleEntry(e) {
  return !Array.isArray(e) || // $FlowFixMe
  typeof e[0] === 'string' && toEntries_typeof(e[1]) === 'object' && !e[1].type;
}; // pattern match: [string, state]
// CONCATENATED MODULE: ./src/utils/index.js























// CONCATENATED MODULE: ./src/history/utils/sessionStorage.js
/* eslint-env browser */

 // API:
// Below is the facade around both `sessionStorage` and our "history as storage" fallback.
//
// - `saveHistory` is  called every time the history entries or index changes
// - `restoreHistory` is called on startup obviously
// Essentially the idea is that if there is no `sessionStorage`, we maintain the entire
// storage object on EACH AND EVERY history entry's `state`. I.e. `history.state` on
// every page will have the `index` and `entries` array. That way when browsers disable
// cookies/sessionStorage, we can still grab the data we need off off of history state :)
//
// It's a bit crazy, but it works very well, and there's plenty of space allowed for storing
// things there to get a lot of mileage out of it. We store the minimum amount of data necessary.
//
// Firefox has the lowest limit of 640kb PER ENTRY. IE has 1mb and chrome has at least 10mb:
// https://stackoverflow.com/questions/6460377/html5-history-api-what-is-the-max-size-the-state-object-can-be

var saveHistory = function saveHistory(_ref, out) {
  var index = _ref.index,
      entries = _ref.entries;
  entries = entries.map(function (e) {
    return [e.location.url, e.state, e.location.key];
  }); // one entry has the url, a state object, and a 6 digit key

  sessionStorage_set({
    index: index,
    entries: entries,
    out: out
  });
};
var restoreHistory = function restoreHistory(api) {
  var history = sessionStorage_get() || initializeHistory();
  return sessionStorage_format(history, api);
};
var sessionStorage_clear = function clear() {
  return supportsSession() ? sessionClear() : historyClear();
};
var sessionStorage_set = function set(v) {
  return supportsSession() ? sessionSet(v) : historySet(v);
};
var sessionStorage_get = function get() {
  return supportsSession() ? sessionGet() : historyGet();
}; // HISTORY FACADE:

var pushState = function pushState(url) {
  return window.history.pushState({
    id: sessionId()
  }, null, url);
}; // insure every entry has the sessionId (called by `BrowserHistory`)

var replaceState = function replaceState(url) {
  return window.history.replaceState({
    id: sessionId()
  }, null, url);
}; // QA: won't the fallback overwrite the `id`? Yes, but the fallback doesn't use the `id` :)

var historyClear = function historyClear() {
  return window.history.replaceState({}, null);
};

var historySet = function historySet(history) {
  return window.history.replaceState(history, null);
}; // set on current entry


var historyGet = function historyGet() {
  var state = getHistoryState();
  return state.entries && state;
}; // SESSION STORAGE FACADE:
// We use `history.state.id` to pick which "session" from `sessionStorage` to use in
// the case that multiple windows containing the app are open at the same time


var _id;

var sessionStorage_PREFIX = '@@rudy/';

var sessionId = function sessionId() {
  return _id = _id || sessionStorage_createSessionId();
};

var sessionStorage_key = function key() {
  return sessionStorage_PREFIX + sessionId();
};

var sessionClear = function sessionClear() {
  return window.sessionStorage.setItem(sessionStorage_key(), '');
};

var sessionSet = function sessionSet(val) {
  return window.sessionStorage.setItem(sessionStorage_key(), JSON.stringify(val));
};

var sessionGet = function sessionGet() {
  try {
    var json = window.sessionStorage.getItem(sessionStorage_key());
    return JSON.parse(json);
  } catch (error) {} // ignore invalid JSON


  return null;
};

var sessionStorage_createSessionId = function createSessionId() {
  if (!supportsHistory() || !supportsSession()) return 'id'; // both are needed for unique IDs to serve their purpose

  var state = getHistoryState();

  if (!state.id) {
    if (false) {} else {
      state.id = Math.random().toString(36).substr(2, 6);
    }

    historySet(state);
  }

  return state.id;
}; // HELPERS:


var initializeHistory = function initializeHistory() {
  var _window$location = window.location,
      pathname = _window$location.pathname,
      search = _window$location.search,
      hash = _window$location.hash;
  var url = pathname + search + hash;
  return {
    n: 1,
    index: 0,
    entries: [url] // default history on first load

  };
}; // We must remove entries after the index in case the user opened a link to
// another site in the middle of the entries stack and then returned via the
// back button, in which case the entries are gone for good, like a `push`.
//
// NOTE: if we did this on the first entry, we would break backing out of the
// site and returning (entries would be unnecessarily removed). So this is only applied to
// "forwarding out." That leaves one hole: if you forward out from the first entry, you will
// return and have problematic entries that should NOT be there. Then because of Rudy's
// automatic back/next detection, which causes the history track to "jump" instead of "push,"
// dispatching an action for the next entry would in fact make you leave the site instead
// of push the new entry! To circumvent that, use Rudy's <Link /> component and it will
// save the `out` flag (just before linking out) that insures this is addressed:


var sessionStorage_format = function format(history, api) {
  var entries = history.entries,
      index = history.index,
      out = history.out;
  var ents = index > 0 || out ? entries.slice(0, index + 1) : entries;
  return toEntries(api, ents, index);
}; // IE11 sometimes throws when accessing `history.state`:
//
// - https://github.com/ReactTraining/history/pull/289
// - https://github.com/ReactTraining/history/pull/230#issuecomment-193555362
//
// The issue occurs:
// A) when you refresh a page that is the only entry and never had state set on it,
// which means it wouldn't have any state to remember in the first place
//
// B) in IE11 on load in iframes, which also won't need to remember state, as iframes
// usually aren't for navigating to other sites (and back). This may just be issue A)
//
// ALSO NOTE: this would only matter when using our history state fallback, as we don't use
// `history.state` with `sessionStorage`, with one exception: `state.id`. The `id` is used for
// a single edge case: having multiple windows open (see "Session Storage Facade" above).


var getHistoryState = function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {}

  return {};
};
// CONCATENATED MODULE: ./src/core/createRequest.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createRequest_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/* harmony default export */ var createRequest = (function (action, api, next) {
  return new createRequest_Request(action, api, next);
});
var createRequest_Request = function Request(_action, api, next) {
  var _this = this;

  _classCallCheck(this, Request);

  createRequest_defineProperty(this, "tmp", void 0);

  createRequest_defineProperty(this, "action", void 0);

  createRequest_defineProperty(this, "ctx", void 0);

  createRequest_defineProperty(this, "route", void 0);

  createRequest_defineProperty(this, "prevRoute", void 0);

  createRequest_defineProperty(this, "error", void 0);

  createRequest_defineProperty(this, "scene", void 0);

  createRequest_defineProperty(this, "realDispatch", void 0);

  createRequest_defineProperty(this, "commitDispatch", void 0);

  createRequest_defineProperty(this, "commitHistory", void 0);

  createRequest_defineProperty(this, "history", void 0);

  createRequest_defineProperty(this, "routes", void 0);

  createRequest_defineProperty(this, "redirect", void 0);

  createRequest_defineProperty(this, "getLocation", void 0);

  createRequest_defineProperty(this, "last", void 0);

  createRequest_defineProperty(this, "canceled", void 0);

  createRequest_defineProperty(this, "type", void 0);

  createRequest_defineProperty(this, "enter", function () {
    _this.ctx.pending = false;
    _this.tmp.committed = true;
    _this.history.pendingPop = null;
    return Promise.resolve(_this.commitDispatch(_this.action)) // syncronous 99% percent of the time (state needs to be updated before history updates URL etc)
    .then(function (res) {
      if (!_this.commitHistory) return res;
      return _this.commitHistory(_this.action).then(function () {
        return res;
      });
    });
  });

  createRequest_defineProperty(this, "dispatch", function (action) {
    var dispatch = _this.realDispatch;
    var type = action && action.type; // actions as payloads (which can be `null`) allowed

    var route = _this.routes[type];
    var linkPipelines = route || typeof action === 'function';

    if (linkPipelines) {
      action.tmp = _this.tmp; // keep the same `tmp` object across all redirects (or potential redirects in anonymous thunks)

      if (_this.ctx.busy) {
        // keep track of previous action to properly replace instead of push during back/next redirects
        // while setting to `state.from`. See `middleware/transformAction/utils/formatAction.js`
        action.tmp.from = _this.tmp.from || _this.action;
      }
    }

    if (_this.ctx.busy && route && route.path && // convert actions to redirects only if "busy" in a route changing pipeline
    !(action.location && action.location.kind === 'set') // history `set` actions should not be transformed to redirects
    ) {
        var status = action.location && action.location.status;
        action = actions_redirect(action, status || 302);
      }

    if (typeof action !== 'function') {
      if (!_this._start) {
        action = _this.populateAction(action, _this); // automatically turn payload-only actions into real actions with routeType_COMPLETE|_DONE as type
      } else if (_this._start) {
        // a callback immediately before `enter` has the final action/payload dispatched attached
        // to the payload of the main route action, to limit the # of actions dispatched.
        // NOTE: requires this middleware: `[call('beforeThunk', { start: true }), enter]`
        _this.action.payload = action;
        return Promise.resolve(action);
      }
    }

    var oldUrl = _this.getLocation().url;

    return Promise.resolve(dispatch(action)) // dispatch transformed action
    .then(function (res) {
      var urlChanged = oldUrl !== _this.getLocation().url;

      if (_this.ctx.serverRedirect || // short-circuit when a server redirected is detected
      (urlChanged || action.type === CALL_HISTORY) && // short-circuit if the URL changed || or history action creators used
      !(res && res.location && res.location.kind === 'set') // but `set` should not short-circuit ever
      ) {
          _this.redirect = res; // assign action to `this.redirect` so `compose` can properly short-circuit route redirected from and resolve to the new action (NOTE: will capture nested pathlessRoutes + anonymousThunks)
        }

      if (res) res._dispatched = true; // tell `middleware/call/index.js` to NOT automatically dispatch callback returns

      return res;
    });
  });

  createRequest_defineProperty(this, "confirm", function () {
    var canLeave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    delete _this.ctx.confirm;

    if (!canLeave) {
      return _this.realDispatch({
        type: UNBLOCK
      });
    } // When `false` is returned from a `call` middleware, you can use `req.confirm()` or the corresponding action
    // creator to run the action successfully through the pipeline again, as in a confirmation modal.
    // All we do is temporarily delete the blocking callback and replace it after the action
    // is successfully dispatched.
    //
    // See `middleware/call/index.js` for where the below assignments are made.


    var _this$last = _this.last,
        name = _this$last.name,
        prev = _this$last.prev;
    var route = prev ? _this.prevRoute : _this.route;
    var callback = route[name];
    delete route[name];
    return _this.realDispatch(_this.action).then(function (res) {
      route[name] = callback; // put callback back

      if (res) res._dispatched = true;
      return res;
    });
  });

  createRequest_defineProperty(this, "block", function () {
    _this.ctx.confirm = _this.confirm;
    var ref = createActionRef(_this.action);
    return _this.realDispatch({
      type: BLOCK,
      payload: {
        ref: ref
      }
    });
  });

  createRequest_defineProperty(this, "getKind", function () {
    if (_this.tmp.load) return 'load';
    return _this.action.location && _this.action.location.kind;
  });

  createRequest_defineProperty(this, "isUniversal", function () {
    return _this.getLocation().universal;
  });

  createRequest_defineProperty(this, "isDoubleDispatch", function () {
    return _this.action.location.url === _this.getLocation().url && !/load|reset|jump/.test(_this.getKind());
  });

  createRequest_defineProperty(this, "handleDoubleDispatch", function () {
    _this.ctx.pending = false;
    _this.history.pendingPop = null;
    if (!_this.tmp.from) return _this.action; // primary use case
    // below is code related to occuring during a redirect (i.e. because `this.tmp.from` exists)

    _this.ctx.doubleDispatchRedirect = _this.action; // if it happens to be within a route-changing pipline that redirects, insure the parent pipeline short-circuits while setting `state.from` (see below + `call/index.js`)

    if (_this.tmp.revertPop) _this.tmp.revertPop();
    return _this.action;
  });

  createRequest_defineProperty(this, "handleDoubleDispatchRedirect", function (res) {
    var attemptedAction = _this.ctx.doubleDispatchRedirect;
    delete _this.ctx.doubleDispatchRedirect;
    _this.canceled = true;
    var ref = _this.action.type === CALL_HISTORY ? createActionRef(attemptedAction.location.from) // when history action creators are used in pipeline, we have to address this from the perspective of the `callHistory` middleware
    : createActionRef(_this.action);

    _this.realDispatch({
      type: SET_FROM,
      payload: {
        ref: ref
      }
    });

    return res !== undefined ? res : attemptedAction;
  });

  createRequest_defineProperty(this, "populateAction", function (act) {
    var type;
    var action = isAction(act) ? act : typeof act === 'string' && (type = _this.isActionType(act)) ? {
      type: type
    } : {
      payload: act
    };
    action.type = action.type || (_this.tmp.committed ? "".concat(_this.type, "_COMPLETE") : "".concat(_this.type, "_DONE"));
    return action;
  });

  createRequest_defineProperty(this, "isActionType", function (str) {
    if (_this.routes[str]) return str;
    if (_this.routes["".concat(_this.scene, "/").concat(str)]) return str;
    if (/^[A-Z0-9_/]+$/.test(str)) return str;
    if (str.indexOf('@@') === 0) return str;
  });

  var routes = api.routes,
      options = api.options,
      getLocation = api.getLocation,
      ctx = api.ctx;
  var isNewPipeline = !_action.tmp;
  var pendingRequest = ctx.pending;

  var _getLocation = getLocation(),
      kind = _getLocation.kind,
      _type = _getLocation.type,
      _prev = _getLocation.prev;

  var _route = routes[_action.type] || {};

  var isRouteAction = !!_route.path;
  var prevRoute = kind === 'init' ? routes[_prev.type] || {} : routes[_type]; // the `tmp` context is passed along by all route-changing actions in the same primary parent
  // pipeline to keep track of things like `committed` status, but we don't want the
  // resulting action that leaves Rudy to have this, so we delete it.

  var tmp = this.tmp = _action.tmp || {};
  delete _action.tmp; // delete it so it's never seen outside of pipeline

  tmp.load = tmp.load || _action.location && _action.location.kind === 'load';
  ctx.busy = ctx.busy || isRouteAction; // maintain `busy` status throughout a primary parent route changing pipeline even if there are pathlessRoutes, anonymousThunks (which don't have paths) called by them
  // cancel pending not committed requests if new ones quickly come in

  if (isRouteAction) {
    if (pendingRequest && isNewPipeline) {
      pendingRequest.tmp.canceled = true; // `compose` will return early on pending requests, effectively cancelling them

      pendingRequest.tmp.revertPop && pendingRequest.tmp.revertPop(); // cancel any actions triggered by browser pops
    }

    ctx.pending = this;
  }

  Object.assign(this, options.extra);
  Object.assign(this, _action); // destructure action into request for convenience in callbacks

  Object.assign(this, api, {
    dispatch: this.dispatch
  });
  this.action = _action;
  this.ctx = ctx;
  this.route = _route;
  this.prevRoute = prevRoute;
  this.error = null;
  this.scene = _route.scene || '';
  this.realDispatch = api.dispatch;
  this.commitDispatch = next; // standard redux next dispatch from our redux middleware

  this.commitHistory = _action.commit; // commitHistory is supplied by history-generated actions. Otherwise it will be added soon by the `transformAction` middleware
  // available when browser back/next buttons used. It's used in 3 cases:
  // 1) when you return `false` from a route triggered by the browser back/next buttons (See `core/compose.js`)
  // 2) in `transformAction/index.js` when popping to a route that redirects to the current URL (yes, we're on top of edge cases!)
  // 3) when a pop-triggered action is canceled (see above)

  this.tmp.revertPop = this.tmp.revertPop || _action.revertPop;
};
// CONCATENATED MODULE: ./src/core/createReducer.js
function createReducer_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { createReducer_defineProperty(target, key, source[key]); }); } return target; }

function createReducer_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createReducer_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = createReducer_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function createReducer_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




/* harmony default export */ var createReducer = (function (initialState, routes) {
  return function () {
    var st = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var r = routes[action.type];
    var l = action.location;

    if (l && l.kind === 'set') {
      var commit = action.commit,
          _action$location = action.location,
          kind = _action$location.kind,
          location = createReducer_objectWithoutProperties(_action$location, ["kind"]),
          act = createReducer_objectWithoutProperties(action, ["commit", "location"]);

      return createReducer_objectSpread({}, st, act, location);
    }

    if (r && r.path && (l.url !== st.url || /load|reset/.test(l.kind))) {
      var type = action.type,
          params = action.params,
          query = action.query,
          state = action.state,
          hash = action.hash,
          basename = action.basename;
      var universal = st.universal;

      var s = createReducer_objectSpread({
        type: type,
        params: params,
        query: query,
        state: state,
        hash: hash,
        basename: basename,
        universal: universal
      }, l);

      if (st.ready === false) s.ready = true;
      return s;
    }

    if (action.type === ADD_ROUTES) {
      var routesAdded = action.payload.routesAdded;
      return createReducer_objectSpread({}, st, {
        routesAdded: routesAdded
      });
    }

    if (action.type === SET_FROM) {
      var ref = action.payload.ref;
      return createReducer_objectSpread({}, st, {
        from: ref
      });
    }

    if (action.type === BLOCK) {
      var _ref = action.payload.ref;
      return createReducer_objectSpread({}, st, {
        blocked: _ref
      });
    }

    if (action.type === UNBLOCK) {
      return createReducer_objectSpread({}, st, {
        blocked: null
      });
    }

    if (action.type.indexOf('_ERROR') > -1) {
      var error = action.error,
          errorType = action.type;
      return createReducer_objectSpread({}, st, {
        error: error,
        errorType: errorType
      });
    }

    if (action.type.indexOf('_COMPLETE') > -1) {
      return createReducer_objectSpread({}, st, {
        ready: true
      });
    }

    if (action.type.indexOf('_START') > -1) {
      return createReducer_objectSpread({}, st, {
        ready: false
      });
    }

    return st;
  };
});
var createReducer_createInitialState = function createInitialState(action) {
  var location = action.location,
      type = action.type,
      basename = action.basename,
      params = action.params,
      query = action.query,
      state = action.state,
      hash = action.hash;
  var entries = location.entries,
      index = location.index,
      length = location.length,
      pathname = location.pathname,
      search = location.search,
      url = location.url,
      key = location.key,
      scene = location.scene,
      n = location.n;
  var direction = n === -1 ? 'backward' : 'forward';
  var prev = createPrev(location);
  var universal = es_isServer();
  var status = isNotFound(type) ? 404 : 200;
  return {
    kind: 'init',
    direction: direction,
    n: n,
    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename,
    url: url,
    pathname: pathname,
    search: search,
    key: key,
    scene: scene,
    prev: prev,
    from: null,
    blocked: null,
    entries: entries,
    index: index,
    length: length,
    universal: universal,
    pop: false,
    status: status
  };
};
var createPrev = function createPrev(location) {
  var n = location.n,
      i = location.index,
      entries = location.entries; // needs to use real lastIndex instead of -1

  var index = i + n * -1; // the entry action we want is the opposite of the direction the user is going

  var prevAction = entries[index];
  if (!prevAction) return createPrevEmpty();
  return createReducer_objectSpread({}, prevAction, {
    location: createReducer_objectSpread({}, prevAction.location, {
      index: index
    })
  });
};
var createPrevEmpty = function createPrevEmpty() {
  return {
    type: '',
    params: {},
    query: {},
    state: {},
    hash: '',
    basename: '',
    location: {
      url: '',
      pathname: '',
      search: '',
      key: '',
      scene: '',
      index: -1
    }
  };
};
// CONCATENATED MODULE: ./src/history/History.js
function History_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { History_typeof = function _typeof(obj) { return typeof obj; }; } else { History_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return History_typeof(obj); }

function History_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { History_defineProperty(target, key, source[key]); }); } return target; }

function History_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function History_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var History_History =
/*#__PURE__*/
function () {
  function History(routes) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    History_classCallCheck(this, History);

    this.routes = routes;
    this.options = options;
    options.basenames = (options.basenames || []).map(function (bn) {
      return cleanBasename(bn);
    });
    var kind = 'load';

    var _this$_restore = this._restore(),
        n = _this$_restore.n,
        index = _this$_restore.index,
        entries = _this$_restore.entries; // delegate to child classes to restore


    var action = entries[index];
    var info = {
      kind: kind,
      n: n,
      index: index,
      entries: entries
    };

    var commit = function commit() {}; // action already committed, by virtue of browser loading the URL


    this.firstAction = this._notify(action, info, commit, false);
  } // CORE:


  _createClass(History, [{
    key: "listen",
    value: function listen(dispatch, getLocation) {
      var _this = this;

      this.dispatch = dispatch;
      this.getLocation = getLocation;
      return function () {
        return _this.unlisten();
      };
    }
  }, {
    key: "unlisten",
    value: function unlisten() {
      this.dispatch = null;
    }
  }, {
    key: "_notify",
    value: function _notify(action, info, commit) {
      var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var extras = arguments.length > 4 ? arguments[4] : undefined;
      var index = info.index,
          entries = info.entries,
          n = info.n;
      var n2 = n || (index > this.index ? 1 : index === this.index ? this.n : -1);
      var length = entries.length;
      action = History_objectSpread({}, action, extras, {
        commit: this._once(commit),
        location: History_objectSpread({}, action.location, info, {
          length: length,
          n: n2
        })
      });
      if (notify && this.dispatch) return this.dispatch(action);
      return action;
    } // LOCATION STATE GETTERS (single source of truth, unidirectional):

  }, {
    key: "push",
    // API:
    value: function push(path) {
      var _this2 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : path.state || {};
      var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var action = toAction(this, path, state);

      var n = this._findAdjacentN(action); // automatically determine if the user is just going back or next to a URL already visited


      if (n) return this.jump(n, false, undefined, {
        state: state
      }, notify);
      var kind = n === -1 ? 'back' : n === 1 ? 'next' : 'push';
      var index = n === -1 ? this.index - 1 : this.index + 1;

      var entries = this._pushToFront(action, this.entries, index, kind);

      var info = {
        kind: kind,
        index: index,
        entries: entries
      };
      var awaitUrl = this.url;

      var commit = function commit(action) {
        return _this2._push(action, awaitUrl);
      };

      return this._notify(action, info, commit, notify);
    }
  }, {
    key: "replace",
    value: function replace(path) {
      var _this3 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : path.state || {};
      var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var action = toAction(this, path, state);

      var n = this._findAdjacentN(action); // automatically determine if the user is just going back or next to a URL already visited


      if (n) return this.jump(n, false, undefined, {
        state: state
      }, notify);
      var kind = n === -1 ? 'back' : n === 1 ? 'next' : 'replace';
      var index = this.index;
      var entries = this.entries.slice(0);
      var info = {
        kind: kind,
        entries: entries,
        index: index
      };
      var currUrl = this.url;

      var commit = function commit(action) {
        return _this3._replace(action, currUrl);
      };

      entries[index] = action;
      return this._notify(action, info, commit, notify);
    }
  }, {
    key: "jump",
    value: function jump(delta) {
      var _this4 = this;

      var byIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var n = arguments.length > 2 ? arguments[2] : undefined;
      var act = arguments.length > 3 ? arguments[3] : undefined;
      var notify = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var revertPop = arguments.length > 5 ? arguments[5] : undefined;
      delta = this._resolveDelta(delta, byIndex);
      n = n || (delta < 0 ? -1 : 1); // users can choose what direction to make the `jump` look like it came from

      var kind = delta === -1 ? 'back' : delta === 1 ? 'next' : 'jump'; // back/next kinds are just more specifically named jumps

      var isMovingAdjacently = kind !== 'jump';
      var isPop = !!revertPop; // passed by BrowserHistory's `handlePop`

      var index = this.index + delta;
      var entries = this.entries.slice(0);

      if (!this.entries[index]) {
        throw new Error("[rudy] jump() - no entry at index: ".concat(index, "."));
      }

      var action = entries[index] = this._transformEntry(this.entries[index], act);

      var info = {
        kind: kind,
        index: index,
        entries: entries,
        n: n
      };
      var currentEntry = isMovingAdjacently && this.entries[this.index]; // for `replace` to adjacent entries we need to override `prev` to be the current entry; `push` doesn't have this issue, but their `prev` value is the same

      var prev = this._createPrev(info, currentEntry); // jumps can fake the value of `prev` state


      var currUrl = this.url;
      var oldUrl = this.entries[index].location.url;

      var commit = function commit(action) {
        return _this4._jump(action, currUrl, oldUrl, delta, isPop);
      };

      return this._notify(action, info, commit, notify, {
        prev: prev,
        revertPop: revertPop
      });
    }
  }, {
    key: "back",
    value: function back(state) {
      var notify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this.jump(-1, false, -1, {
        state: state
      }, notify);
    }
  }, {
    key: "next",
    value: function next(state) {
      var notify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this.jump(1, false, 1, {
        state: state
      }, notify);
    }
  }, {
    key: "set",
    value: function set(act, delta) {
      var _this5 = this;

      var byIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      delta = this._resolveDelta(delta, byIndex);
      var kind = 'set';
      var index = this.index;
      var i = this.index + delta;
      var entries = this.entries.slice(0);

      if (!this.entries[i]) {
        throw new Error("[rudy] set() - no entry at index: ".concat(i));
      }

      var entry = entries[i] = this._transformEntry(this.entries[i], act);

      var action = delta === 0 ? entry : createActionRef(this.location); // action dispatched must ALWAYS be current one, but insure it receives changes if delta === 0, not just entry in entries

      var info = {
        kind: kind,
        index: index,
        entries: entries
      };
      var oldUrl = delta === 0 ? this.url : this.entries[i].location.url; // this must be the current URL for the target so that `BrowserHistory` url awaiting works, as the target's URL may change in `this._transformEntry`

      var commit = function commit(action) {
        return _this5._set(action, oldUrl, delta);
      };

      if (i === this.location.prev.location.index) {
        action.prev = History_objectSpread({}, entry, {
          location: History_objectSpread({}, entry.location, {
            index: i
          }) // edge case: insure `state.prev` matches changed entry IF CHANGED ENTRY HAPPENS TO ALSO BE THE PREV

        });
      }

      return this._notify(action, info, commit, notify);
    }
  }, {
    key: "replacePop",
    value: function replacePop(path) {
      var _this6 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var info = arguments.length > 3 ? arguments[3] : undefined;
      var action = toAction(this, path, state);
      var index = info.index,
          prevUrl = info.prevUrl,
          n = info.n;
      var entries = info.entries.slice(0);
      var kind = index < this.index ? 'back' : 'next';
      var newInfo = {
        kind: kind,
        entries: entries,
        index: index
      };

      var commit = function commit(action) {
        return _this6._replace(action, prevUrl, n);
      };

      entries[index] = action;
      return this._notify(action, newInfo, commit, notify);
    }
  }, {
    key: "reset",
    value: function reset(ents, i, n) {
      var _this7 = this;

      var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      if (ents.length === 1) {
        var entry = this._findResetFirstAction(ents[0]); // browser must always have at least 2 entries, so one can be pushed, erasing old entries from the stack


        ents.unshift(entry);
      }

      i = i !== undefined ? i : ents.length - 1;
      n = n || (i !== ents.length - 1 ? i > this.index ? 1 : i === this.index ? this.n : -1 // create direction relative to index of current entries
      : 1); // at the front of the array, always use "forward" direction

      var kind = 'reset';

      var _toEntries = toEntries(this, ents, i, n),
          index = _toEntries.index,
          entries = _toEntries.entries;

      var action = History_objectSpread({}, entries[index]);

      var info = {
        kind: kind,
        index: index,
        entries: entries,
        n: n
      };
      var oldUrl = this.url;
      var oldFirstUrl = this.entries[0].location.url;
      var reverseN = -this.index;

      var commit = function commit(action) {
        return _this7._reset(action, oldUrl, oldFirstUrl, reverseN);
      };

      if (!entries[index]) throw new Error("[rudy] no entry at index: ".concat(index, "."));

      var prev = this._createPrev(info);

      var from = index === this.index && createActionRef(this.location); // if index stays the same, treat as "replace"

      return this._notify(action, info, commit, notify, {
        prev: prev,
        from: from
      });
    }
  }, {
    key: "canJump",
    value: function canJump(delta, byIndex) {
      delta = this._resolveDelta(delta, byIndex);
      return !!this.entries[this.index + delta];
    } // UTILS:

  }, {
    key: "_transformEntry",
    value: function _transformEntry(entry, action) {
      entry = History_objectSpread({}, entry);

      if (typeof action === 'function') {
        return toAction(this, action(entry));
      }

      action = isAction(action) ? action : {
        state: action
      };
      var _action = action,
          params = _action.params,
          query = _action.query,
          state = _action.state,
          hash = _action.hash,
          bn = _action.basename;

      if (params) {
        params = typeof params === 'function' ? params(entry.query) : params;
        entry.params = History_objectSpread({}, entry.params, params);
      }

      if (query) {
        query = typeof query === 'function' ? query(entry.query) : query;
        entry.query = History_objectSpread({}, entry.query, query);
      }

      if (state) {
        state = typeof state === 'function' ? state(entry.state) : state;
        entry.state = History_objectSpread({}, entry.state, state);
      }

      if (hash) {
        hash = typeof hash === 'function' ? hash(entry.hash) : hash;
        entry.hash = hash;
      }

      if (bn) {
        bn = typeof bn === 'function' ? bn(entry.basename) : bn;
        entry.basename = bn;
      }

      return toAction(this, entry);
    }
  }, {
    key: "_createPrev",
    value: function _createPrev(_ref, currentEntry) {
      var n = _ref.n,
          i = _ref.index,
          entries = _ref.entries;
      var index = i - n; // reverse of n direction to get prev

      var entry = currentEntry || entries[index];
      if (!entry) return createPrevEmpty();
      var scene = this.routes[entry.type].scene || '';

      var action = History_objectSpread({}, entry, {
        location: History_objectSpread({}, entry.location, {
          index: index,
          scene: scene
        })
      });

      return createActionRef(action); // build the action for that entry, and create what the resulting state shape would have looked like
    }
  }, {
    key: "_findResetFirstAction",
    value: function _findResetFirstAction(entry) {
      var routes = this.routes,
          options = this.options; // the user can configure what the default first entry is

      if (options.resetFirstEntry) {
        return typeof options.resetFirstEntry === 'function' ? options.resetFirstEntry(entry) : options.resetFirstEntry;
      } // if not, we have little choice but to put a HOME or NOT_FOUND action at the front of the entries


      if (History_typeof(entry) === 'object' && entry.type) {
        var action = entry;

        if (routes[action.type].path !== '/') {
          var homeType = Object.keys(routes).find(function (type) {
            return routes[type].path === '/';
          });
          return homeType ? {
            type: homeType
          } : {
            type: 'NOT_FOUND'
          };
        }

        return {
          type: 'NOT_FOUND'
        };
      } // entries may also be supplied as paths or arrays also containing state, eg:  [[path, state], [path, state]]


      var path = Array.isArray(entry) ? entry[0] : entry;
      var notFoundPath = routes.NOT_FOUND.path;

      if (path !== '/') {
        var homeRoute = Object.keys(routes).find(function (type) {
          return routes[type].path === '/';
        });
        return homeRoute ? '/' : notFoundPath;
      }

      return notFoundPath;
    }
  }, {
    key: "_once",
    value: function _once(commit) {
      var _this8 = this;

      var committed = false;
      return function (action) {
        if (committed) return Promise.resolve();
        committed = true;
        return Promise.resolve(commit(action)).then(function () {
          if (!_this8.options.save) return;

          _this8.options.save(_this8.location); // will retreive these from redux state, which ALWAYS updates first

        });
      };
    }
  }, {
    key: "_findAdjacentN",
    value: function _findAdjacentN(action) {
      return this._findBackN(action) || this._findNextN(action);
    }
  }, {
    key: "_findBackN",
    value: function _findBackN(action) {
      var e = this.entries[this.index - 1];
      return e && e.location.url === action.location.url && -1;
    }
  }, {
    key: "_findNextN",
    value: function _findNextN(action) {
      var e = this.entries[this.index + 1];
      return e && e.location.url === action.location.url && 1;
    }
  }, {
    key: "_pushToFront",
    value: function _pushToFront(action, prevEntries, index) {
      var entries = prevEntries.slice(0);
      var isBehindHead = entries.length > index;

      if (isBehindHead) {
        var entriesToDelete = entries.length - index;
        entries.splice(index, entriesToDelete, action);
      } else {
        entries.push(action);
      }

      return entries;
    }
  }, {
    key: "_resolveDelta",
    value: function _resolveDelta(delta, byIndex) {
      if (typeof delta === 'string') {
        var index = this.entries.findIndex(function (e) {
          return e.location.key === delta;
        });
        return index - this.index;
      }

      if (byIndex) {
        return delta - this.index;
      }

      return delta || 0;
    } // All child classes *should* implement this:

  }, {
    key: "_restore",
    value: function _restore() {
      return toEntries(this); // by default creates action array for a single entry: ['/']
    } // BrowseHistory (or 3rd party implementations) override these to provide sideFX

  }, {
    key: "_push",
    value: function _push() {}
  }, {
    key: "_replace",
    value: function _replace() {}
  }, {
    key: "_jump",
    value: function _jump() {}
  }, {
    key: "_set",
    value: function _set() {}
  }, {
    key: "_reset",
    value: function _reset() {}
  }, {
    key: "location",
    get: function get() {
      return this.getLocation();
    }
  }, {
    key: "entries",
    get: function get() {
      return this.location.entries;
    }
  }, {
    key: "index",
    get: function get() {
      return this.location.index;
    }
  }, {
    key: "url",
    get: function get() {
      return this.location.url;
    }
  }, {
    key: "n",
    get: function get() {
      return this.location.n;
    }
  }, {
    key: "prevUrl",
    get: function get() {
      return this.location.prev.location.url;
    }
  }]);

  return History;
}();


// CONCATENATED MODULE: ./src/history/BrowserHistory.js
function BrowserHistory_slicedToArray(arr, i) { return BrowserHistory_arrayWithHoles(arr) || BrowserHistory_iterableToArrayLimit(arr, i) || BrowserHistory_nonIterableRest(); }

function BrowserHistory_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function BrowserHistory_iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function BrowserHistory_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function BrowserHistory_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { BrowserHistory_typeof = function _typeof(obj) { return typeof obj; }; } else { BrowserHistory_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return BrowserHistory_typeof(obj); }

function BrowserHistory_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function BrowserHistory_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function BrowserHistory_createClass(Constructor, protoProps, staticProps) { if (protoProps) BrowserHistory_defineProperties(Constructor.prototype, protoProps); if (staticProps) BrowserHistory_defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (BrowserHistory_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* eslint-env browser */




// 1) HISTORY RESTORATION:
// * FROM SESSION_STORAGE (WITH A FALLBACK TO OUR "HISTORY_STORAGE" SOLUTION)
// The `id` below is very important, as it's used to identify unique `sessionStorage` sessions lol.
// Essentially, you can have multiple tabs open, or even in the same tab multiple sessions if you
// enter another URL at the same site manually. Each need their history entries independently tracked.
// So we:
// - create an `id` for each when first encountered
// - store it in `this.state.id`
// - and prefix their `sessionStorage` key with it to uniquely identify the different histories :)
// - then we restore the history using the id
// - and for all subsequent history saving, we save to the correct storage with that `id`
// NOTE: As far as the "HISTORY_STORAGE" fallback goes, please `sessionStorage.js`.
// Essentially we save the entire sessionStorage in every entry of `window.history` :)
// 2) POP HANDLING -- THE MOST IMPORTANT THING HERE:
// A) REVERT POP: `forceGo(currentIndex - index)`
// The first executed `forceGo` automatically undos the pop event, putting the browser history
// back to where it was. Since the `jump` function takes relative numbers, we must calculate
// that number by subtracting the current index from the next index
// B) COMMIT POP: `forceGo(index - currentIndex)`
// similarly the `commit` function performed in client code performs the reverse operation
// EXAMPLE:
// User presses back from index 5 to 4
// revert: 5 - 4 === jump(1)
// commit: 4 - 5 === jump(-1)
// :)
// WHY?
// so client code can control when the URL actually changes, and possibly deny it
var BrowserHistory_BrowserHistory =
/*#__PURE__*/
function (_History) {
  _inherits(BrowserHistory, _History);

  function BrowserHistory() {
    BrowserHistory_classCallCheck(this, BrowserHistory);

    return _possibleConstructorReturn(this, _getPrototypeOf(BrowserHistory).apply(this, arguments));
  }

  BrowserHistory_createClass(BrowserHistory, [{
    key: "_restore",
    value: function _restore() {
      this.options.restore = this.options.restore || restoreHistory;
      this.options.save = this.options.save || saveHistory;

      this._setupPopHandling();

      return this.options.restore(this);
    }
  }, {
    key: "listen",
    value: function listen(dispatch, getLocation) {
      var _this = this;

      if (!this.dispatch) {
        // we don't allow/need multiple listeners currently
        _get(_getPrototypeOf(BrowserHistory.prototype), "listen", this).call(this, dispatch, getLocation);

        this._addPopListener();
      }

      return function () {
        return _this.unlisten();
      };
    }
  }, {
    key: "unlisten",
    value: function unlisten() {
      this._removePopListener();

      _get(_getPrototypeOf(BrowserHistory.prototype), "unlisten", this).call(this);
    }
  }, {
    key: "_didPopForward",
    value: function _didPopForward(url) {
      var e = this.entries[this.index + 1];
      return e && e.location.url === url;
    }
  }, {
    key: "_setupPopHandling",
    value: function _setupPopHandling() {
      var _this2 = this;

      var handlePop = function handlePop() {
        if (_this2._popForced) return _this2._popForced = false;
        var _window$location = window.location,
            pathname = _window$location.pathname,
            search = _window$location.search,
            hash = _window$location.hash;
        var url = pathname + search + hash;
        var n;

        if (!_this2.pendingPop) {
          n = _this2._didPopForward(url) ? 1 : -1;
          _this2.pendingPop = n;
        } else if (url === _this2.url) {
          n = _this2.pendingPop * -1; // switch directions

          return _this2._forceGo(n * -1);
        } else {
          n = _this2.pendingPop;
          return _this2._forceGo(n * -1);
        }

        var reverted = false;

        var revertPop = function revertPop() {
          if (!reverted) _this2._forceGo(n * -1);
          reverted = true;
        }; // revertPop will be called if route change blocked by `core/compose.js` or used as
        // a flag by `this._jump` below to do nothing in the browser, since the user already
        // did it via browser back/next buttons


        _this2.currentPop = _this2.jump(n, false, n, null, true, revertPop); // `currentPop` used only by tests to await browser-initiated pops
      };

      var onPopState = function onPopState(e) {
        return !isExtraneousPopEvent(e) && handlePop();
      }; // ignore extraneous popstate events in WebKit


      var onHashChange = handlePop;

      this._addPopListener = function () {
        return addPopListener(onPopState, onHashChange);
      };

      this._removePopListener = function () {
        return removePopListener(onPopState, onHashChange);
      };
    }
  }, {
    key: "_forceGo",
    value: function _forceGo(n) {
      this._popForced = true;
      window.history.go(n); // revert

      return Promise.resolve();
    }
  }, {
    key: "_push",
    value: function _push(action, awaitUrl) {
      var url = action.location.url;
      return this._awaitUrl(awaitUrl, '_push').then(function () {
        return pushState(url);
      });
    }
  }, {
    key: "_replace",
    value: function _replace(action, awaitUrl, n) {
      var url = action.location.url;

      if (n) {
        this._forceGo(n);

        return this._awaitUrl(awaitUrl, '_replaceBackNext').then(function () {
          return replaceState(url);
        });
      }

      if (this.location.kind === 'load') {
        awaitUrl = locationToUrl(window.location); // special case: redirects on load have no previous URL
      }

      return this._awaitUrl(awaitUrl, '_replace').then(function () {
        return replaceState(url);
      });
    }
  }, {
    key: "_jump",
    value: function _jump(action, currUrl, oldUrl, n, isPop) {
      var _this3 = this;

      if (!n) {
        // possibly the user mathematically calculated a jump of `0`
        return this._replace(action, currUrl);
      }

      if (isPop) return; // pop already handled by browser back/next buttons and real history state is already up to date

      return this._awaitUrl(currUrl, 'jump prev').then(function () {
        return _this3._forceGo(n);
      }).then(function () {
        return _this3._awaitUrl(oldUrl, 'jump loc');
      }).then(function () {
        return _this3._replace(action, oldUrl);
      });
    }
  }, {
    key: "_set",
    value: function _set(action, oldUrl, n) {
      var _this4 = this;

      if (!n) {
        return this._replace(action, oldUrl);
      }

      var _action$location = action.location,
          index = _action$location.index,
          entries = _action$location.entries;
      var changedAction = entries[index + n];
      return this._awaitUrl(action, '_setN start').then(function () {
        return _this4._forceGo(n);
      }).then(function () {
        return _this4._awaitUrl(oldUrl, '_setN before replace');
      }).then(function () {
        return _this4._replace(changedAction, oldUrl);
      }).then(function () {
        return _this4._forceGo(-n);
      }).then(function () {
        return _this4._awaitUrl(action, 'setN return');
      });
    }
  }, {
    key: "_reset",
    value: function _reset(action, oldUrl, oldFirstUrl, reverseN) {
      var _this5 = this;

      var _action$location2 = action.location,
          index = _action$location2.index,
          entries = _action$location2.entries;
      var lastIndex = entries.length - 1;
      var reverseDeltaToIndex = index - lastIndex;
      var indexUrl = entries[index].location.url;
      return this._awaitUrl(oldUrl, 'reset oldUrl').then(function () {
        return _this5._forceGo(reverseN);
      }).then(function () {
        return _this5._awaitUrl(oldFirstUrl, 'reset oldFirstUrl');
      }).then(function () {
        replaceState(entries[0].location.url); // we always insure resets have at least 2 entries, and the first can only operate via `replaceState`

        entries.slice(1).forEach(function (e) {
          return pushState(e.location.url);
        }); // we have to push at least one entry to erase the old entries in the real browser history

        if (reverseDeltaToIndex) {
          return _this5._forceGo(reverseDeltaToIndex).then(function () {
            return _this5._awaitUrl(indexUrl, 'resetIndex _forceGo');
          });
        }
      });
    }
  }, {
    key: "_awaitUrl",
    value: function _awaitUrl(actOrUrl, name) {
      var _this6 = this;

      return new Promise(function (resolve) {
        var url = typeof actOrUrl === 'string' ? actOrUrl : actOrUrl.location.url;

        var ready = function ready() {
          console.log('ready', url, locationToUrl(window.location));
          return url === locationToUrl(window.location);
        };

        return tryChange(ready, resolve, name, _this6); // TODO: is the this supposed to be there, its one extra param over
      });
    }
  }]);

  return BrowserHistory;
}(History_History); // CHROME WORKAROUND:
// chrome doesn't like rapid back to back history changes, so we test the first
// change happened first, before executing the next



var tries = 0;
var maxTries = 10;
var queue = [];

var tryChange = function tryChange(ready, complete, name) {
  if (tries === 0) rapidChangeWorkaround(ready, complete, name);else queue.push([ready, complete, name]);
};

var rapidChangeWorkaround = function rapidChangeWorkaround(ready, complete, name) {
  tries++;

  if (!ready() && tries < maxTries) {
    console.log('tries', tries + 1, name);
    setTimeout(function () {
      return rapidChangeWorkaround(ready, complete, name);
    }, 9);
  } else {
    if (false) {}

    complete();
    tries = 0;

    var _ref = queue.shift() || [],
        _ref2 = BrowserHistory_slicedToArray(_ref, 3),
        again = _ref2[0],
        com = _ref2[1],
        _name = _ref2[2]; // try another if queue is full


    if (again) {
      rapidChangeWorkaround(again, com, _name);
    }
  }
};
// CONCATENATED MODULE: ./src/history/MemoryHistory.js
function MemoryHistory_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MemoryHistory_typeof = function _typeof(obj) { return typeof obj; }; } else { MemoryHistory_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MemoryHistory_typeof(obj); }

function MemoryHistory_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MemoryHistory_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MemoryHistory_createClass(Constructor, protoProps, staticProps) { if (protoProps) MemoryHistory_defineProperties(Constructor.prototype, protoProps); if (staticProps) MemoryHistory_defineProperties(Constructor, staticProps); return Constructor; }

function MemoryHistory_possibleConstructorReturn(self, call) { if (call && (MemoryHistory_typeof(call) === "object" || typeof call === "function")) { return call; } return MemoryHistory_assertThisInitialized(self); }

function MemoryHistory_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function MemoryHistory_getPrototypeOf(o) { MemoryHistory_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return MemoryHistory_getPrototypeOf(o); }

function MemoryHistory_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) MemoryHistory_setPrototypeOf(subClass, superClass); }

function MemoryHistory_setPrototypeOf(o, p) { MemoryHistory_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return MemoryHistory_setPrototypeOf(o, p); }



 // Even though this is used primarily in environments without `window` (server + React Native),
// it's also used as a fallback in browsers lacking the `history` API (<=IE9). In that now rare case,
// the URL won't change once you enter the site, however, if you forward or back out of the site
// we restore entries from `sessionStorage`. So essentially the application behavior is identical
// to browsers with `history` except the URL doesn't change.
// `initialEntries` can be:
// [path, path, etc] or: path
// [action, action, etc] or: action
// [[path, state, key?], [path, state, key?], etc] or: [path, state, key?]
// or any combination of different kinds

var MemoryHistory_MemoryHistory =
/*#__PURE__*/
function (_History) {
  MemoryHistory_inherits(MemoryHistory, _History);

  function MemoryHistory() {
    MemoryHistory_classCallCheck(this, MemoryHistory);

    return MemoryHistory_possibleConstructorReturn(this, MemoryHistory_getPrototypeOf(MemoryHistory).apply(this, arguments));
  }

  MemoryHistory_createClass(MemoryHistory, [{
    key: "_restore",
    value: function _restore() {
      var opts = this.options;
      var i = opts.initialIndex,
          ents = opts.initialEntries,
          n = opts.initialN;
      var useSession = supportsSession() && opts.testBrowser !== false;
      opts.restore = opts.restore || useSession && restoreHistory;
      opts.save = opts.save || useSession && saveHistory;
      return opts.restore ? opts.restore(this) : toEntries(this, ents, i, n); // when used as a browser fallback, we restore from sessionStorage
    }
  }]);

  return MemoryHistory;
}(History_History);


// CONCATENATED MODULE: ./src/core/createHistory.js



/* harmony default export */ var createHistory = (function (routes) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return supportsDom() && supportsHistory() && opts.testBrowser !== false ? new BrowserHistory_BrowserHistory(routes, opts) : new MemoryHistory_MemoryHistory(routes, opts);
});
// CONCATENATED MODULE: ./src/core/compose.js
/* harmony default export */ var compose = (function (middlewares, curryArg) {
  var killOnRedirect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (typeof middlewares === 'function') {
    return middlewares(curryArg, killOnRedirect); // accept custom function to do compose work below
  }

  var pipeline = curryArg ? middlewares.map(function (middleware) {
    return middleware(curryArg);
  }) : middlewares;
  return function (req) {
    var index = -1; // last called middleware #

    var result;
    return dispatch(0);

    function dispatch(i) {
      if (req.redirect !== undefined && killOnRedirect) {
        // short-circuit, dont call next middleware
        var ret = i === 0 && result !== undefined ? result : false;
        return Promise.resolve(ret);
      }

      if (req.tmp.canceled) {
        // if a new request comes in before this one commits/enters, cancel it by not calling next middleware
        var _ret = i === 0 && result !== undefined ? result : false;

        req.history.canceled = req.action;
        return Promise.resolve(_ret); // short-circuit, dont call next middleware
      } // start standard work:


      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }

      index = i;
      var fn = pipeline[i];
      if (!fn) return Promise.resolve(result);

      try {
        var next = function next() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return Promise.resolve(dispatch.apply(void 0, [i + 1].concat(args)));
        };

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var prom = Promise.resolve(fn.apply(void 0, [req, next].concat(args))); // insure middleware is a promise

        return prom.then(function (res) {
          if (res) {
            delete res._dispatched; // delete these temporary flags so user doesn't see them (used for `autoDispatch` feature)
          } // return value of redirect (resolution of next pipeline), but if value returned from callback, return that instead


          if (req.redirect !== undefined && killOnRedirect) {
            return result = result !== undefined ? result // as below in the standard use-case, this insures last middleware dictates return
            : res === req.action ? req.redirect // `transformAction` + `enter` middleware return original action dispatched, but we never want to return that value of the action redirected from
            : res !== undefined ? res : req.redirect; // usually the result returned will be the result of the pipeline redirected to, but we honor explicit different returns (`res`)
          } // if a middleware return `false`, the pipeline is terminated and now there is no longer a "pending" route change


          if (res === false && !req.tmp.committed) {
            var newRequestCameIn = req.ctx.pending !== req;
            req.ctx.pending = newRequestCameIn ? req.ctx.pending : false; // preserve potential incoming request that came in during async callback that returned false, otherwise indicate the initial request is no longer pending
            // call window.history.go(-1 | 1) to go back to URL/route whose `beforeLeave` returned `false`
            // NOTE: this is also used by redirects back to the current route (see `middleware/call/index.js`)

            if (req.tmp.revertPop) req.tmp.revertPop();
          }

          result = result !== undefined ? result : res; // insure last middleware return stays the final return of `dispatch` after chain rewinds

          return i === 0 ? result : res; // but allow middleware calls to `next` to be returned regular return of next middleware
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
});
// CONCATENATED MODULE: ./src/core/index.js





// CONCATENATED MODULE: ./src/middleware/transformAction/utils/formatAction.js
function formatAction_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = formatAction_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function formatAction_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



/* harmony default export */ var formatAction = (function (req) {
  var action = req.action,
      history = req.history,
      prevRoute = req.prevRoute,
      getLocation = req.getLocation,
      tmp = req.tmp;

  var _ref = !req.commitHistory ? actionToUrl(action, req, prevRoute) : {
    url: action.location.url,
    state: action.state
  },
      url = _ref.url,
      state = _ref.state;

  var redirect = isRedirect(action);
  var redirectCommitted = redirect && (tmp.committed || !tmp.from || tmp.load); // committed after `enter`, or if a redirect triggered from outside the pipeline, or on load where it must always be treated as a `replace` since the URL is already settled

  var status = action.location && action.location.status;
  var curr = getLocation();
  var method = redirectCommitted ? 'replace' : 'push'; // redirects before committing are just pushes (since the original route was never pushed)

  var info;
  var n;

  if (!tmp.committed && tmp.from && (n = findNeighboringN(tmp.from, curr))) {
    method = 'replacePop';
    info = replacePopAction(n, url, curr, tmp);
  }

  if (!req.commitHistory || method === 'replacePop') {
    var _history$method = history[method](url, state, false, info),
        commit = _history$method.commit,
        _action = formatAction_objectWithoutProperties(_history$method, ["commit"]); // get returned the same action as functions passed to `history.listen`


    req.commitHistory = commit; // put this here so `enter` middleware can commit the history, etc

    req.action = _action;
  } // reset + jump actions provide custom `prev/from`


  var prev = req.action.prev || (tmp.load || redirectCommitted ? curr.prev : curr); // `init` comes before initial `load` action, but they share the same `prev` state, as they are essentially the same, except the former is the initial state before any actions are dispatched; -- about `prev` vs `from`: `prev` maintains proper entries array, notwithstanding any redirects, whereas `from` honors where the user tried to go, but never became the location state

  var from = req.action.from || (redirect ? tmp.from || curr : undefined); // `from` represents the route the user would have gone to had there been no redirect; `curr` used when redirect comes from outside of pipeline via `redirect` action creator

  return nestAction(req.action, prev, from, status, tmp);
});
// CONCATENATED MODULE: ./src/middleware/transformAction/utils/replacePopAction.js
// handle redirects from back/next actions, where we want to replace in place
// instead of pushing a new entry to preserve proper movement along history track
/* harmony default export */ var replacePopAction = (function (n, url, curr, tmp) {
  var _tmp$from$location = tmp.from.location,
      entries = _tmp$from$location.entries,
      index = _tmp$from$location.index;

  if (!isNAdjacentToSameUrl(url, curr, n)) {
    var _prevUrl = tmp.from.location.url;
    n = tmp.revertPop ? null : n; // if this back/next movement is due to a user-triggered pop (browser back/next buttons), we don't need to shift the browser history by n, since it's already been done

    return {
      n: n,
      entries: entries,
      index: index,
      prevUrl: _prevUrl
    };
  }

  var newIndex = index + n;
  var prevUrl = entries[newIndex].location.url;
  n = tmp.revertPop ? n : n * 2;
  return {
    n: n,
    entries: entries,
    index: newIndex,
    prevUrl: prevUrl
  };
});

var isNAdjacentToSameUrl = function isNAdjacentToSameUrl(url, curr, n) {
  var entries = curr.entries,
      index = curr.index;
  var loc = entries[index + n * 2];
  return loc && loc.location.url === url;
};

var findNeighboringN = function findNeighboringN(from, curr) {
  var entries = curr.entries,
      index = curr.index;
  var prev = entries[index - 1];
  if (prev && prev.location.url === from.location.url) return -1;
  var next = entries[index + 1];
  if (next && next.location.url === from.location.url) return 1;
};
// CONCATENATED MODULE: ./src/middleware/transformAction/utils/index.js


// CONCATENATED MODULE: ./src/middleware/transformAction/index.js

/* harmony default export */ var transformAction = (function () {
  return function (req, next) {
    if (!req.route.path) return next();
    req.action = formatAction(req);
    if (req.isDoubleDispatch()) return req.handleDoubleDispatch(); // don't dispatch the same action twice

    var _req$action = req.action,
        type = _req$action.type,
        params = _req$action.params,
        query = _req$action.query,
        state = _req$action.state,
        hash = _req$action.hash,
        basename = _req$action.basename,
        location = _req$action.location;
    Object.assign(req, {
      type: type,
      params: params,
      query: query,
      state: state,
      hash: hash,
      basename: basename,
      location: location
    }); // assign to `req` for conevenience (less destructuring in callbacks)

    return next().then(function () {
      return req.action;
    });
  };
});
// CONCATENATED MODULE: ./src/middleware/enter.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



/* harmony default export */ var enter = (function (api) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, next) {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!req.route.redirect) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", redirectShortcut(req));

              case 2:
                res = req.enter(); // commit history + action to state
                // return early on `load` so rendering can happen ASAP
                // i.e. before `thunk` is called but after potentially async auth in `beforeEnter`

                if (!(req.getKind() === 'load' && !es_isServer() && api.resolveFirstRouteOnEnter)) {
                  _context.next = 7;
                  break;
                }

                setTimeout(function () {
                  next().then(function () {
                    req.ctx.busy = false;
                  });
                }, 0); // insure callbacks like `onEnter` are called after `ReactDOM.render`, which should immediately be called after dispatching `firstRoute()`
                // in `createRouter.js` this flag will indicate to keep the pipeline still "busy" so
                // that dispatches in `thunk` and other callbacks after `enter` are treated as redirects,
                // as automatically happens throughout the pipeline. It becomes unbusy in the timeout above.

                req.clientLoadBusy = true;
                return _context.abrupt("return", res);

              case 7:
                return _context.abrupt("return", res.then(next).then(function () {
                  return res;
                }));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
});
// CONCATENATED MODULE: ./src/middleware/call/index.js
function call_slicedToArray(arr, i) { return call_arrayWithHoles(arr) || call_iterableToArrayLimit(arr, i) || call_nonIterableRest(); }

function call_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function call_iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function call_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function call_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { call_defineProperty(target, key, source[key]); }); } return target; }

function call_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ var call = (function (name) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (api) {
    var _config$cache = config.cache,
        cache = _config$cache === void 0 ? false : _config$cache,
        _config$prev = config.prev,
        prev = _config$prev === void 0 ? false : _config$prev,
        _config$skipOpts = config.skipOpts,
        skipOpts = _config$skipOpts === void 0 ? false : _config$skipOpts,
        _config$start = config.start,
        start = _config$start === void 0 ? false : _config$start;
    enhanceRoutes(name, api.routes, api.options);
    api.options.callbacks = api.options.callbacks || [];
    api.options.callbacks.push(name);
    api.options.shouldCall = api.options.shouldCall || shouldCall;

    if (cache) {
      api.cache = createCache(api, name, config);
    }

    return function (req) {
      var next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noOp;
      var route = prev ? req.prevRoute : req.route;
      var isCached = cache && api.cache.isCached(name, route, req);
      if (isCached) return next();
      var calls = req.options.shouldCall(name, route, req, config);
      if (!calls) return next();
      var r = calls.route && route[name] || noOp;
      var o = calls.options && !skipOpts && req.options[name] || noOp;

      if (start) {
        var action = call_objectSpread({}, req.action, {
          type: "".concat(req.type, "_START")
        });

        req.commitDispatch(action);
        req._start = true;
      }

      return Promise.all([autoDispatch(req, r, route, name), autoDispatch(req, o, route, name, true)]).then(function (_ref) {
        var _ref2 = call_slicedToArray(_ref, 2),
            r = _ref2[0],
            o = _ref2[1];

        req._start = false;

        if (isFalse(r, o)) {
          // set the current callback name and whether its on the previous route (beforeLeave) or current
          // so that `req.confirm()` can temporarily delete it and pass through the pipeline successfully
          // in a confirmation modal or similar
          req.last = {
            name: name,
            prev: prev
          };

          if (!req.tmp.committed) {
            req.block(); // update state.blocked === actionBlockedFrom
          }

          return false;
        }

        if (req.ctx.doubleDispatchRedirect) {
          // dispatches to current location during redirects blocked, see `transformAction/index.js`
          var _res = r !== undefined ? r : o;

          return req.handleDoubleDispatchRedirect(_res);
        } // `_dispatched` is a flag used to find whether actions were already dispatched in order
        // to determine whether to automatically dispatch it. The goal is not to dispatch twice.
        //
        // We delete these keys so they don't show up in responses returned from `store.dispatch`
        // NOTE: they are only applied to responses, which often are actions, but only AFTER they
        // are dispatched. This way reducers never see this key. See `core/createRequest.js`


        if (r) delete r._dispatched;
        if (o) delete o._dispatched;
        if (cache) req.cache.cacheAction(name, req.action);
        var res = r !== undefined ? r : o;
        return next().then(function () {
          return res;
        });
      });
    };
  };
});

var isFalse = function isFalse(r, o) {
  return r === false || o === false;
};
// CONCATENATED MODULE: ./src/middleware/pathlessRoute.js

/* harmony default export */ var pathlessRoute = (function () {
  for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
    names[_key] = arguments[_key];
  }

  return function (api) {
    names[0] = names[0] || 'thunk';
    names[1] = names[1] || 'onComplete';
    var middlewares = names.map(function (name) {
      return call(name, {
        runOnServer: true,
        skipOpts: true
      });
    });
    var pipeline = api.options.compose(middlewares, api); // Registering is currently only used when core features (like the
    // `addRoutes` action creator) depend on the middleware being available.
    // See `utils/formatRoutes.js` for how `has` is used to throw
    // errors when not available.

    api.register('pathlessRoute');
    return function (req, next) {
      var route = req.route;
      var isPathless = route && !route.path;

      if (isPathless && hasCallback(route, names)) {
        if (route.dispatch !== false) {
          req.action = req.commitDispatch(req.action);
        }

        return pipeline(req).then(function (res) {
          return res || req.action;
        });
      }

      return next();
    };
  };
});

var hasCallback = function hasCallback(route, names) {
  return names.find(function (name) {
    return typeof route[name] === 'function';
  });
};
// CONCATENATED MODULE: ./src/middleware/anonymousThunk.js
/* harmony default export */ var anonymousThunk = (function (_ref) {
  var options = _ref.options;
  var shouldTransition = options.shouldTransition;

  options.shouldTransition = function (action, api) {
    if (typeof action === 'function') return true;
    return shouldTransition(action, api);
  };

  return function (req, next) {
    if (typeof req.action !== 'function') return next();
    var thunk = req.action;
    var thunkResult = Promise.resolve(thunk(req));
    return thunkResult.then(function (action) {
      return action && !action._dispatched ? req.dispatch(action) : action;
    });
  };
});
// CONCATENATED MODULE: ./src/middleware/serverRedirect.js


/* harmony default export */ var serverRedirect = (function (api) {
  return function (req, next) {
    if (es_isServer() && isRedirect(req.action)) {
      var action = req.action;

      var _actionToUrl = actionToUrl(action, api),
          url = _actionToUrl.url;

      action.url = action.location.url = url;
      action.status = action.location.status || 302; // account for anonymous thunks potentially redirecting without returning itself
      // and not able to be discovered by regular means in `utils/createRequest.js`

      req.ctx.serverRedirect = true;
      return action;
    }

    return next();
  };
});
// CONCATENATED MODULE: ../middleware-change-page-title/es/index.js
function es_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function es_asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        es_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        es_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}


/* harmony default export */ var es = (function (options) {
  var _ref = options || {},
      keyOrSelector = _ref.title,
      _ref$isServer = _ref.isServer,
      isServer = _ref$isServer === void 0 ? es_isServer : _ref$isServer,
      _ref$createSelector = _ref.createSelector,
      createSelector = _ref$createSelector === void 0 ? es_createSelector : _ref$createSelector,
      _ref$setTitle = _ref.setTitle,
      setTitle = _ref$setTitle === void 0 ? function (title) {
    // eslint-disable-next-line no-undef
    window.document.title = title;
  } : _ref$setTitle;

  var selectTitleState = createSelector('title', keyOrSelector);
  return function (api) {
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = es_asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(req, next) {
          var title;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  title = selectTitleState(api.getState());

                  if (!isServer() && typeof title === 'string') {
                    // eslint-disable-next-line no-undef
                    setTitle(title);
                  }

                  return _context.abrupt("return", next());

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }()
    );
  };
});
// CONCATENATED MODULE: ./src/middleware/index.js







// CONCATENATED MODULE: ./src/core/createRouter.js
function createRouter_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { createRouter_defineProperty(target, key, source[key]); }); } return target; }

function createRouter_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






/* harmony default export */ var createRouter = (function () {
  var routesInput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var middlewares = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [serverRedirect, // short-circuiting middleware
  anonymousThunk, pathlessRoute('thunk'), transformAction, // pipeline starts here
  // Hydrate: skip callbacks called on server to produce initialState (beforeEnter, thunk, etc)
  // Server: don't allow client-centric callbacks (onEnter, onLeave, beforeLeave)
  call('beforeLeave', {
    prev: true
  }), call('beforeEnter', {
    runOnServer: true
  }), enter, es({
    title: options.title
  }), call('onLeave', {
    prev: true
  }), call('onEnter', {
    runOnHydrate: true
  }), call('thunk', {
    cache: true,
    runOnServer: true
  }), call('onComplete', {
    runOnServer: true
  })];
  var location = options.location,
      title = options.title,
      formatRoute = options.formatRoute,
      _options$createHistor = options.createHistory,
      createSmartHistory = _options$createHistor === void 0 ? createHistory : _options$createHistor,
      _options$createReduce = options.createReducer,
      createLocationReducer = _options$createReduce === void 0 ? createReducer : _options$createReduce,
      _options$createInitia = options.createInitialState,
      createState = _options$createInitia === void 0 ? createReducer_createInitialState : _options$createInitia,
      onErr = options.onError; // assign to options so middleware can override them in 1st pass if necessary

  options.shouldTransition = options.shouldTransition || shouldTransition;
  options.createRequest = options.createRequest || createRequest;
  options.compose = options.compose || compose;
  options.onError = typeof onErr !== 'undefined' ? onErr : logError["b" /* onError */];
  options.parseSearch = options.parseSearch || utils_parseSearch;
  options.stringifyQuery = options.stringifyQuery || lib_default.a.stringify;
  var routes = formatRoutes(routesInput, formatRoute);
  var selectLocationState = es_createSelector('location', location);
  var history = createSmartHistory(routes, options);
  var firstAction = history.firstAction;
  var initialState = createState(firstAction);
  var reducer = createLocationReducer(initialState, routes);
  var wares = {};

  var register = function register(name) {
    var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return wares[name] = val;
  };

  var has = function has(name) {
    return wares[name];
  };

  var ctx = {
    busy: false
  };
  var api = {
    routes: routes,
    history: history,
    options: options,
    register: register,
    has: has,
    ctx: ctx
  };
  var onError = call('onError', {
    runOnServer: true,
    runOnHydrate: true
  })(api);
  var nextPromise = options.compose(middlewares, api, true);

  var middleware = function middleware(_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;

    var getLocation = function getLocation(s) {
      return selectLocationState(s || getState() || {});
    };

    var shouldTransition = options.shouldTransition,
        createRequest = options.createRequest; // middlewares may mutably monkey-patch these in above call to `compose`
    // TODO: Fix these annotations

    Object.assign(api, {
      getLocation: getLocation,
      dispatch: dispatch,
      getState: getState
    });
    getState.rudy = api; // make rudy available via `context` with no extra Providers, (see <Link />)

    history.listen(dispatch, getLocation); // dispatch actions in response to pops, use redux location state as single source of truth

    return function (dispatch) {
      return function (action) {
        if (!shouldTransition(action, api)) return dispatch(action); // short-circuit and pass through Redux middleware normally

        if (action.tmp && action.tmp.canceled) return Promise.resolve(action);
        var req = createRequest(action, api, dispatch); // the `Request` arg passed to all middleware

        var mw = req.route.middleware;
        var next = mw ? options.compose(mw, api, !!req.route.path) : nextPromise;
        return next(req) // start middleware pipeline
        .catch(function (error) {
          if (options.wallabyErrors) throw error; // wallaby UI is linkable if we don't re-throw errors (we'll see errors for the few tests of errors outside of wallaby)

          req.error = error;
          req.errorType = "".concat(req.action.type, "_ERROR");
          return onError(req);
        }).then(function (res) {
          var route = req.route,
              tmp = req.tmp,
              ctx = req.ctx,
              clientLoadBusy = req.clientLoadBusy;
          var isRoutePipeline = route.path && !tmp.canceled && !clientLoadBusy;
          ctx.busy = isRoutePipeline ? false : ctx.busy;
          return res;
        });
      };
    };
  };

  return createRouter_objectSpread({}, api, {
    middleware: middleware,
    reducer: reducer,
    firstRoute: function firstRoute() {
      var resolveOnEnter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      api.resolveFirstRouteOnEnter = resolveOnEnter;
      return firstAction;
    }
  });
});
// CONCATENATED MODULE: ./src/createScene/utils/camelCase.js
/* harmony default export */ var camelCase = (function (type) {
  var matches = type.match(wordPattern);
  if (!Array.isArray(matches)) throw new Error("[rudy] invalid action type: ".concat(type));
  return matches.reduce(function (camelCased, word, index) {
    return camelCased + (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.substring(1).toLowerCase());
  }, '');
});
var wordPattern = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:(?:1ST|2ND|3RD|(?![123])\dTH)\b)|\d*(?:(?:1st|2nd|3rd|(?![123])\dth)\b)|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;
// CONCATENATED MODULE: ./src/createScene/utils/handleError.js
function handleError_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { handleError_defineProperty(target, key, source[key]); }); } return target; }

function handleError_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* harmony default export */ var handleError = (function (o, type, basename) {
  return o && o.error ? handleError_objectSpread({
    type: type,
    basename: basename
  }, o) : {
    type: type,
    basename: basename,
    error: o
  };
});
// CONCATENATED MODULE: ./src/createScene/utils/logExports.js
function logExports_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { logExports_defineProperty(target, key, source[key]); }); } return target; }

function logExports_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/* harmony default export */ var logExports = (function (types, actions, routes, options) {
  var opts = logExports_objectSpread({}, options);

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
  if (true) console.log(exports);
  return exports;
});
// CONCATENATED MODULE: ./src/createScene/utils/makeActionCreator.js
function makeActionCreator_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { makeActionCreator_defineProperty(target, key, source[key]); }); } return target; }

function makeActionCreator_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/* harmony default export */ var makeActionCreator = (function (route, type, key, basename) {
  var subtypes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var ac = typeof route[key] === 'function' ? route[key] : null; // look for action creators on route
  // `info` arg contains 'isThunk' or optional `path` for `notFound` action creators

  var defaultCreator = function defaultCreator(arg, info) {
    var _ref;

    // optionally handle action creators that return functions (aka `thunk`)
    if (typeof arg === 'function') {
      var thunk = arg;
      return function () {
        return defaultCreator(thunk.apply(void 0, arguments), 'isThunk');
      };
    } // do nothing if a `thunk` returned nothing (i.e. manually used `dispatch`)


    if (info === 'isThunk' && arg === undefined) return; // for good measure honor promises (`dispatch` will have manually been used)

    if (info === 'isThunk' && arg && arg.then) return arg; // use built-in `notFound` action creator if `NOT_FOUND` type

    if (isNotFound(type)) {
      var state = arg;
      var act = notFound(state, type);
      if (basename) act.basename = basename;
      return act;
    } // handle error action creator


    var t = arg && arg.type || type;
    if (key === 'error') return handleError(arg, t, basename); // the default behavior of transforming an `arg` object into an action with its type

    if (isAction(arg)) return makeActionCreator_objectSpread({
      type: type,
      basename: basename
    }, arg); // if no `payload`, `query`, etc, treat arg as a `params/payload` for convenience

    var name = subtypes.includes(key) || !route.path ? 'payload' : 'params'; // non-route-changing actions (eg: _COMPLETE) or pathless routes use `payload` key

    return _ref = {
      type: type
    }, makeActionCreator_defineProperty(_ref, name, arg || {}), makeActionCreator_defineProperty(_ref, "basename", basename), _ref;
  }; // optionally allow custom action creators


  if (ac) {
    return function () {
      return defaultCreator(ac.apply(void 0, arguments));
    };
  } // primary use case: generate an action creator (will only trigger last lines of `defaultCreator`)


  return defaultCreator;
});
// CONCATENATED MODULE: ./src/createScene/utils/formatRoute.js

/* harmony default export */ var utils_formatRoute = (function (r, type, routes, formatter) {
  var route = formatRoutes_formatRoute(r, type, routes, formatter);
  route.scene = typeToScene(type); // set default path for NOT_FOUND actions if necessary

  if (!route.path && isNotFound(type)) {
    route.path = route.scene ? // $FlowFixMe
    "/".concat(r.scene.toLowerCase(), "/not-found") : '/not-found';
  }

  return route;
});
// CONCATENATED MODULE: ./src/createScene/utils/index.js





// CONCATENATED MODULE: ./src/createScene/index.js
function createScene_toConsumableArray(arr) { return createScene_arrayWithoutHoles(arr) || createScene_iterableToArray(arr) || createScene_nonIterableSpread(); }

function createScene_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function createScene_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function createScene_arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


/* harmony default export */ var createScene = (function (routesMap) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var sc = opts.scene,
      bn = opts.basename,
      formatter = opts.formatRoute,
      _opts$subtypes = opts.subtypes,
      st = _opts$subtypes === void 0 ? [] : _opts$subtypes,
      log = opts.logExports;
  var scene = sc || '';
  var prefix = scene ? "".concat(scene, "/") : '';
  var keys = Object.keys(routesMap);
  var subtypes = [].concat(createScene_toConsumableArray(st), ['start', 'complete', 'error', 'done']);
  var result = keys.reduce(function (result, t) {
    var types = result.types,
        actions = result.actions,
        routes = result.routes;
    var t2 = "".concat(prefix).concat(t);
    var tc = "".concat(prefix).concat(t, "_COMPLETE");
    var te = "".concat(prefix).concat(t, "_ERROR");
    routes[t2] = utils_formatRoute(routesMap[t], t2, routesMap, formatter);
    var route = routes[t2];
    var tClean = route.scene ? t2.replace("".concat(route.scene, "/"), '') : t; // strip the scene so types will be un-prefixed (NOTE: this is normalization for if routes pass through `createScene` twice)

    var action = camelCase(tClean);
    types[tClean] = t2;
    types["".concat(tClean, "_COMPLETE")] = tc;
    types["".concat(tClean, "_ERROR")] = te; // allow for creating custom action creators (whose names are an array assigned to route.action)

    if (Array.isArray(route.action)) {
      var key = route.action[0];
      actions[action] = makeActionCreator(route, t2, key, bn); // the first action in the array becomes the primary action creator
      // all are tacked on like action.complete, action.error

      route.action.forEach(function (key) {
        actions[action][key] = makeActionCreator(route, t2, key, bn);
      });
    } else {
      actions[action] = makeActionCreator(route, t2, 'action', bn);
    }

    subtypes.forEach(function (name) {
      var suffix = "_".concat(name.toUpperCase());
      var cleanType = "".concat(tClean).concat(suffix);
      var realType = "".concat(prefix).concat(t).concat(suffix);
      types[cleanType] = realType;
      actions[action][name] = makeActionCreator(route, realType, name, bn, subtypes);
    });
    return result;
  }, {
    types: {},
    actions: {},
    routes: {}
  });
  var types = result.types,
      actions = result.actions; // $FlowFixMe

  if (log && /^(development|test)$/.test("production")) {
    result.exportString = logExports(types, actions, result.routes, opts);
  }

  return result;
});
// CONCATENATED MODULE: ./src/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utils", function() { return utils; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "createRouter", function() { return createRouter; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "createScene", function() { return createScene; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "createHistory", function() { return createHistory; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "History", function() { return History_History; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "MemoryHistory", function() { return MemoryHistory_MemoryHistory; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BrowserHistory", function() { return BrowserHistory_BrowserHistory; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "PREFIX", function() { return PREFIX; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "prefixType", function() { return prefixType; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CALL_HISTORY", function() { return CALL_HISTORY; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "NOT_FOUND", function() { return NOT_FOUND; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ADD_ROUTES", function() { return ADD_ROUTES; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CHANGE_BASENAME", function() { return CHANGE_BASENAME; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CLEAR_CACHE", function() { return CLEAR_CACHE; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CONFIRM", function() { return CONFIRM; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BLOCK", function() { return BLOCK; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "UNBLOCK", function() { return UNBLOCK; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "SET_FROM", function() { return SET_FROM; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "redirect", function() { return actions_redirect; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "notFound", function() { return notFound; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "addRoutes", function() { return addRoutes; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "changeBasename", function() { return changeBasename; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "clearCache", function() { return clearCache; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "confirm", function() { return actions_confirm; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "push", function() { return history_push; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "replace", function() { return history_replace; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "jump", function() { return history_jump; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "back", function() { return history_back; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "next", function() { return history_next; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "reset", function() { return history_reset; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "set", function() { return history_set; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setParams", function() { return history_setParams; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setQuery", function() { return history_setQuery; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setState", function() { return history_setState; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setHash", function() { return history_setHash; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setBasename", function() { return history_setBasename; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isHydrate", function() { return isHydrate; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isAction", function() { return isAction; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isNotFound", function() { return isNotFound; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isRedirect", function() { return isRedirect; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "actionToUrl", function() { return actionToUrl; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "urlToAction", function() { return urlToAction; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "findBasename", function() { return findBasename; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "stripBasename", function() { return stripBasename; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "toAction", function() { return toAction; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "locationToUrl", function() { return locationToUrl; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "urlToLocation", function() { return urlToLocation; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "doesRedirect", function() { return doesRedirect; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "shouldTransition", function() { return shouldTransition; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "matchUrl", function() { return matchUrl; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "compileUrl", function() { return compileUrl; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "formatRoutes", function() { return formatRoutes; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "formatRoute", function() { return formatRoutes_formatRoute; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "typeToScene", function() { return typeToScene; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "redirectShortcut", function() { return redirectShortcut; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "callRoute", function() { return callRoute; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "noOp", function() { return noOp; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "nestAction", function() { return nestAction; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "createActionRef", function() { return createActionRef; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "logError", function() { return logError["a" /* default */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "onError", function() { return logError["b" /* onError */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "cleanBasename", function() { return cleanBasename; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "parseSearch", function() { return utils_parseSearch; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "toEntries", function() { return toEntries; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "findInitialN", function() { return findInitialN; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "transformAction", function() { return transformAction; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "enter", function() { return enter; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "call", function() { return call; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "pathlessRoute", function() { return pathlessRoute; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "anonymousThunk", function() { return anonymousThunk; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "serverRedirect", function() { return serverRedirect; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "changePageTitle", function() { return es; });









var utils = {
  supports: supports_namespaceObject,
  popListener: popListener_namespaceObject,
  sessionStorage: sessionStorage_namespaceObject
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

/***/ })
/******/ ]);
});