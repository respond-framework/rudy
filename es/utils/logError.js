/* eslint-disable no-console */
var logError = function logError(type, error) {
  if (process.env.NODE_ENV === 'development') {
    console.error('[rudy]', "action.type: ".concat(type), error);
  } else if (process.env.NODE_ENV === 'test') {
    logCleanTestError([type], error);
  }
};

export default logError;

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

export var onError = function onError(_ref) {
  var type = _ref.errorType,
      error = _ref.error,
      dispatch = _ref.dispatch;
  logError(type, error);
  return dispatch({
    type: type,
    error: error
  });
};

if (process.env.NODE_ENV === 'test') {
  global.log = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return logCleanTestError(args);
  };

  global.logFull = function (arg) {
    return logCleanTestError([arg], new Error(), false);
  };
}
//# sourceMappingURL=logError.js.map