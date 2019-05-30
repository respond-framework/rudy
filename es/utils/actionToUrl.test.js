function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import actionToUrl, { defaultToPath } from './actionToUrl';
describe('Serializes params', function () {
  var _routes;

  var NOT_FOUND = 'NOT_FOUND';
  var ROOT = 'ROOT';
  var STATIC = 'STATIC';
  var UNNAMED_PARAM = 'UNNAMED_PARAM';
  var SINGLE_PARAM = 'SINGLE_PARAM';
  var OPTIONAL_PARAM = 'OPTIONAL_PARAM';
  var MULTIPLE_PARAMS = 'MULTIPLE_PARAMS';
  var OPTIONAL_PATH_PARAM = 'OPTIONAL_PATH_PARAM';
  var COMPULSORY_PATH_PARAM = 'COMPULSORY_PATH_PARAM';
  var MULTI_MULTI_PARAM = 'MULTI_MULTI_PARAM';
  var routes = (_routes = {}, _defineProperty(_routes, NOT_FOUND, {
    path: '/404'
  }), _defineProperty(_routes, ROOT, {
    path: '/'
  }), _defineProperty(_routes, STATIC, {
    path: '/static'
  }), _defineProperty(_routes, UNNAMED_PARAM, {
    path: '/unnamed(.*)'
  }), _defineProperty(_routes, SINGLE_PARAM, {
    path: '/compulsory/:param'
  }), _defineProperty(_routes, OPTIONAL_PARAM, {
    path: '/optional/:param?'
  }), _defineProperty(_routes, MULTIPLE_PARAMS, {
    path: '/multiple/:p1/:p2'
  }), _defineProperty(_routes, OPTIONAL_PATH_PARAM, {
    path: '/multistar/:p*'
  }), _defineProperty(_routes, COMPULSORY_PATH_PARAM, {
    path: '/multiplus/:p+'
  }), _defineProperty(_routes, MULTI_MULTI_PARAM, {
    path: '/multimulti/:p1*/separator/:p2+'
  }), _routes);
  var api = {
    routes: routes,
    options: {
      toPath: function toPath(val) {
        return val;
      },
      fromPath: function fromPath(val) {
        return val;
      }
    }
  };

  var assertUrlForAction = function assertUrlForAction(action, url) {
    return expect(actionToUrl(action, api)).toEqual({
      url: url,
      state: {}
    });
  };

  var assertErrorForAction = function assertErrorForAction(action) {
    return expect(function () {
      return actionToUrl(action, api);
    }).toThrow();
  };

  it('Static path', function () {
    assertUrlForAction({
      type: ROOT
    }, '/');
    assertUrlForAction({
      type: STATIC
    }, '/static');
  });
  it('Single compulsory unnamed parameter', function () {
    assertUrlForAction({
      type: UNNAMED_PARAM
    }, '/404');
    assertErrorForAction({
      type: UNNAMED_PARAM,
      params: {
        '0': null
      }
    });
    assertErrorForAction({
      type: UNNAMED_PARAM,
      params: {
        '0': undefined
      }
    });
    assertUrlForAction({
      type: UNNAMED_PARAM,
      params: {
        '0': ''
      }
    }, '/unnamed');
    assertUrlForAction({
      type: UNNAMED_PARAM,
      params: {
        '0': 'apple'
      }
    }, '/unnamedapple');
  });
  it('Single compulsory parameter', function () {
    assertUrlForAction({
      type: SINGLE_PARAM
    }, '/404');
    assertErrorForAction({
      type: SINGLE_PARAM,
      params: {
        param: null
      }
    });
    assertErrorForAction({
      type: SINGLE_PARAM,
      params: {
        param: undefined
      }
    });
    assertUrlForAction({
      type: SINGLE_PARAM,
      params: {
        param: ''
      }
    }, '/404');
    assertUrlForAction({
      type: SINGLE_PARAM,
      params: {
        param: 'apple'
      }
    }, '/compulsory/apple');
  });
  it('Single optional parameter', function () {
    assertUrlForAction({
      type: OPTIONAL_PARAM
    }, '/optional');
    assertErrorForAction({
      type: OPTIONAL_PARAM,
      params: {
        param: null
      }
    });
    assertUrlForAction({
      type: OPTIONAL_PARAM,
      params: {
        param: undefined
      }
    }, '/optional');
    assertUrlForAction({
      type: OPTIONAL_PARAM,
      params: {
        param: 'test'
      }
    }, '/optional/test');
  });
  it('Multiple parameters', function () {
    assertUrlForAction({
      type: MULTIPLE_PARAMS,
      params: {}
    }, '/404');
    assertUrlForAction({
      type: MULTIPLE_PARAMS,
      params: {
        p1: '1'
      }
    }, '/404');
    assertUrlForAction({
      type: MULTIPLE_PARAMS,
      params: {
        p1: '1',
        p2: '2'
      }
    }, '/multiple/1/2');
  });
  it('Multi segment optional parameter', function () {
    assertUrlForAction({
      type: OPTIONAL_PATH_PARAM
    }, '/multistar');
    assertErrorForAction({
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: undefined
      }
    });
    assertErrorForAction({
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: null
      }
    });
    assertErrorForAction({
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: ''
      }
    });
    assertUrlForAction({
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: []
      }
    }, '/multistar');
    assertUrlForAction({
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: ['single']
      }
    }, '/multistar/single');
    assertUrlForAction({
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: ['one', 'two', 'three']
      }
    }, '/multistar/one/two/three');
  });
  it('Multi segment compulsory parameter', function () {
    assertErrorForAction({
      type: COMPULSORY_PATH_PARAM,
      params: {
        p: undefined
      }
    });
    assertErrorForAction({
      type: COMPULSORY_PATH_PARAM,
      params: {
        p: null
      }
    });
    assertErrorForAction({
      type: COMPULSORY_PATH_PARAM,
      params: {
        p: []
      }
    });
    assertUrlForAction({
      type: COMPULSORY_PATH_PARAM,
      params: {
        p: ['one']
      }
    }, '/multiplus/one');
    assertUrlForAction({
      type: COMPULSORY_PATH_PARAM,
      params: {
        p: ['one', 'two']
      }
    }, '/multiplus/one/two');
  });
  it('Multiple multi segment params', function () {
    assertUrlForAction({
      type: MULTI_MULTI_PARAM,
      params: {}
    }, '/404');
    assertErrorForAction({
      type: MULTI_MULTI_PARAM,
      params: {
        p1: 'one'
      }
    });
    assertUrlForAction({
      type: MULTI_MULTI_PARAM,
      params: {
        p2: ['one']
      }
    }, '/multimulti/separator/one');
    assertUrlForAction({
      type: MULTI_MULTI_PARAM,
      params: {
        p2: ['one', 'two']
      }
    }, '/multimulti/separator/one/two');
    assertUrlForAction({
      type: MULTI_MULTI_PARAM,
      params: {
        p1: ['one', 'two'],
        p2: ['three', 'four']
      }
    }, '/multimulti/one/two/separator/three/four');
  });
});
describe('defaultToPath', function () {
  var checkToPath = function checkToPath() {
    var succeed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var value = arguments.length > 1 ? arguments[1] : undefined;

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        repeat = _ref.repeat,
        optional = _ref.optional,
        convertNumbers = _ref.convertNumbers,
        capitalizedWords = _ref.capitalizedWords;

    var result = arguments.length > 3 ? arguments[3] : undefined;
    var label;

    if (value === undefined) {
      label = 'undefined';
    } else if (value === null) {
      label = 'null';
    } else if (Array.isArray(value)) {
      label = '[Array]';
    } else if (_typeof(value) === 'object') {
      label = '{Object}';
    } else if (typeof value === 'string') {
      label = "'".concat(value, "'");
    } else if (typeof value === 'number') {
      label = value.toString();
    } else {
      label = '<unknown>';
    }

    var repeatValues = [true, false].filter(function (val) {
      return !val !== repeat;
    });
    var optionalValues = [true, false].filter(function (val) {
      return !val !== optional;
    });
    var convertNumbersValues = [true, false].filter(function (val) {
      return !val !== convertNumbers;
    });
    var capitalizeWordsValues = [true, false].filter(function (val) {
      return !val !== capitalizedWords;
    });
    repeatValues.forEach(function (r) {
      optionalValues.forEach(function (o) {
        capitalizeWordsValues.forEach(function (w) {
          convertNumbersValues.forEach(function (n) {
            return it("defaultToPath(".concat(label, ", { name: 'test', repeat: ").concat(repeat ? 'true' : 'false', ", optional: ").concat(optional ? 'true' : 'false', " }, { convertNumbers: ").concat(n ? 'true' : 'false', ", capitalizedWords: ").concat(w ? 'true' : 'false', " })"), function () {
              return succeed ? expect(defaultToPath(value, {
                name: 'test',
                optional: o,
                repeat: r
              }, {
                convertNumbers: n,
                capitalizedWords: w
              }, {})).toEqual(result) : expect(function () {
                return defaultToPath(value, {
                  name: 'test',
                  optional: o,
                  repeat: r
                }, {
                  convertNumbers: n,
                  capitalizedWords: w
                }, {});
              }).toThrow();
            });
          });
        });
      });
    });
  }; // undefined allowed for optional params


  checkToPath(true, undefined, {
    optional: true,
    repeat: true
  }, []);
  checkToPath(true, undefined, {
    optional: true,
    repeat: false
  }, undefined);
  checkToPath(false, undefined, {
    optional: false
  }); // Values never allowed (they would break the symmetry of fromPath/toPath)

  checkToPath(false, '', {
    repeat: true
  });
  checkToPath(false, '', {
    repeat: false,
    optional: true
  });
  checkToPath(false, null);
  checkToPath(false, true);
  checkToPath(false, false);
  checkToPath(false, []);
  checkToPath(false, {}); // convertNumbers

  checkToPath(false, 0, {
    repeat: true
  });
  checkToPath(false, 0, {
    convertNumbers: false
  });
  checkToPath(true, 0, {
    repeat: false,
    convertNumbers: true
  }, '0');
  checkToPath(true, 1, {
    repeat: false,
    convertNumbers: true
  }, '1');
  checkToPath(true, 3.141, {
    repeat: false,
    convertNumbers: true
  }, '3.141'); // Strings

  checkToPath(true, 'simple', {
    repeat: false
  }, 'simple');
  checkToPath(true, 'simple', {
    repeat: true
  }, ['simple']);
  checkToPath(true, 'path/param', {
    repeat: false
  }, 'path/param');
  checkToPath(true, 'path/param', {
    repeat: true
  }, ['path', 'param']);
  checkToPath(true, 'path%2fparam', {
    repeat: false
  }, 'path%2fparam');
  checkToPath(true, 'path%2fparam', {
    repeat: true
  }, ['path%2fparam']); // capitalizedWords

  checkToPath(true, 'Daniel Playfair Cal', {
    capitalizedWords: true,
    repeat: false
  }, 'daniel-playfair-cal');
  checkToPath(true, 'Daniel Playfair Cal', {
    capitalizedWords: false,
    repeat: false
  }, 'Daniel Playfair Cal');
  checkToPath(true, 'Daniel Playfair Cal', {
    repeat: true
  }, ['Daniel Playfair Cal']);
});
//# sourceMappingURL=actionToUrl.test.js.map