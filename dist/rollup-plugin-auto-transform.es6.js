import { coroutine } from 'bluebird';
import { createFilter } from 'rollup-pluginutils';
import { readdir, readFile } from 'fs';
import { dirname, join } from 'path';
import duplexify from 'duplexify';
import { PassThrough } from 'stream';
import _nodeResolve from 'resolve';
import 'babel-polyfill';

var getPackageDir = function () {
  var _ref = coroutine(regeneratorRuntime.mark(function _callee(id, filter, cache) {
    var dir, dirs, out, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _dir;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dir = dirname(id);
            dirs = [dir];

          case 2:
            if (!true) {}

            if (!(!dir || !filter(dir))) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('break', 19);

          case 5:
            if (!cache.has(dir)) {
              _context.next = 9;
              break;
            }

            out = cache.get(dir);
            dirs.pop();
            return _context.abrupt('break', 19);

          case 9:
            _context.next = 11;
            return readdir$1(dir);

          case 11:
            files = _context.sent;

            if (!files.some(function (file) {
              return file === 'package.json';
            })) {
              _context.next = 15;
              break;
            }

            out = dir;
            return _context.abrupt('break', 19);

          case 15:
            dir = dirname(dir);
            dirs.push(dir);
            _context.next = 2;
            break;

          case 19:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 22;

            for (_iterator = dirs[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _dir = _step.value;

              cache.set(_dir, out);
            }
            _context.next = 30;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context['catch'](22);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 30:
            _context.prev = 30;
            _context.prev = 31;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 33:
            _context.prev = 33;

            if (!_didIteratorError) {
              _context.next = 36;
              break;
            }

            throw _iteratorError;

          case 36:
            return _context.finish(33);

          case 37:
            return _context.finish(30);

          case 38:
            return _context.abrupt('return', out);

          case 39:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[22, 26, 30, 38], [31,, 33, 37]]);
  }));

  return function getPackageDir(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var getPackage = function () {
  var _ref2 = coroutine(regeneratorRuntime.mark(function _callee2(dir, cache) {
    var pack, out;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!cache.has(dir)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', cache.get(dir));

          case 2:
            _context2.prev = 2;
            _context2.next = 5;
            return readFile$1(join(dir, 'package.json'));

          case 5:
            pack = _context2.sent;
            out = JSON.parse(pack);

            cache.set(dir, out);
            return _context2.abrupt('return', out);

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](2);

            cache.set(dir, false);
            return _context2.abrupt('return');

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 11]]);
  }));

  return function getPackage(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var loadTransforms = function () {
  var _ref3 = coroutine(regeneratorRuntime.mark(function _callee5(transforms, baseDir) {
    var _this = this;

    var out, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2;

    return regeneratorRuntime.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            out = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context6.prev = 4;
            _loop = regeneratorRuntime.mark(function _loop() {
              var transform;
              return regeneratorRuntime.wrap(function _loop$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      transform = _step2.value;

                      if (!Array.isArray(transform)) {
                        _context5.next = 5;
                        break;
                      }

                      return _context5.delegateYield(regeneratorRuntime.mark(function _callee3() {
                        var filepath, tr;
                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                _context3.next = 2;
                                return nodeResolve(transform[0], baseDir);

                              case 2:
                                filepath = _context3.sent;
                                tr = require(filepath);

                                out.push(function (file) {
                                  return wrapStream(tr(file, transform[1]));
                                });

                              case 5:
                              case 'end':
                                return _context3.stop();
                            }
                          }
                        }, _callee3, _this);
                      })(), 't0', 3);

                    case 3:
                      _context5.next = 6;
                      break;

                    case 5:
                      return _context5.delegateYield(regeneratorRuntime.mark(function _callee4() {
                        var filepath, tr;
                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                          while (1) {
                            switch (_context4.prev = _context4.next) {
                              case 0:
                                _context4.next = 2;
                                return nodeResolve(transform, baseDir);

                              case 2:
                                filepath = _context4.sent;
                                tr = require(filepath);

                                out.push(function (file) {
                                  return wrapStream(tr(file));
                                });

                              case 5:
                              case 'end':
                                return _context4.stop();
                            }
                          }
                        }, _callee4, _this);
                      })(), 't1', 6);

                    case 6:
                    case 'end':
                      return _context5.stop();
                  }
                }
              }, _loop, _this);
            });
            _iterator2 = transforms[Symbol.iterator]();

          case 7:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context6.next = 12;
              break;
            }

            return _context6.delegateYield(_loop(), 't0', 9);

          case 9:
            _iteratorNormalCompletion2 = true;
            _context6.next = 7;
            break;

          case 12:
            _context6.next = 18;
            break;

          case 14:
            _context6.prev = 14;
            _context6.t1 = _context6['catch'](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context6.t1;

          case 18:
            _context6.prev = 18;
            _context6.prev = 19;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 21:
            _context6.prev = 21;

            if (!_didIteratorError2) {
              _context6.next = 24;
              break;
            }

            throw _iteratorError2;

          case 24:
            return _context6.finish(21);

          case 25:
            return _context6.finish(18);

          case 26:
            return _context6.abrupt('return', out);

          case 27:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee5, this, [[4, 14, 18, 26], [19,, 21, 25]]);
  }));

  return function loadTransforms(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

function readdir$1(dir) {
  return new Promise(function (yes, no) {
    return readdir(dir, function (err, resp) {
      if (err) {
        return no(err);
      }
      yes(resp);
    });
  });
}
function nodeResolve(file, basedir) {
  return new Promise(function (yes, no) {
    return _nodeResolve(file, { basedir: basedir }, function (err, resp) {
      if (err) {
        return no(err);
      }
      yes(resp);
    });
  });
}
function readFile$1(path) {
  return new Promise(function (yes, no) {
    return readFile(path, {
      encoding: 'utf8'
    }, function (err, resp) {
      if (err) {
        return no(err);
      }
      yes(resp);
    });
  });
}

function drainStream(makeStream, code, id) {
  return new Promise(function (yes, no) {
    var stream = makeStream(id);
    var out = '';
    stream.on('data', function (d) {
      return out += d.toString();
    });
    stream.on('error', no);
    stream.on('end', function () {
      return yes(out);
    });
    stream.end(code);
  });
}
function wrapStream(tr) {
  if (typeof tr.read === 'function') {
    return tr;
  }
  var input = new PassThrough();
  var output = new PassThrough();
  input.pipe(tr).pipe(output);
  return duplexify(input, output);
}
var index = (function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var basedir = options.basedir || process.cwd();
  options.include = options.include || ['node_modules/**'];
  var filter = createFilter(options.include, options.exclude);
  var packCache = new Map();
  var dirCache = new Map();
  return {
    transform: function () {
      var _ref4 = coroutine(regeneratorRuntime.mark(function _callee6(code, id) {
        var packDir, pack, transforms, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, trans, tempCode;

        return regeneratorRuntime.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (filter(id)) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt('return', null);

              case 2:
                _context7.next = 4;
                return getPackageDir(id, filter, dirCache);

              case 4:
                packDir = _context7.sent;

                if (packDir) {
                  _context7.next = 7;
                  break;
                }

                return _context7.abrupt('return', null);

              case 7:
                _context7.next = 9;
                return getPackage(packDir, packCache);

              case 9:
                pack = _context7.sent;

                if (!(!pack || !pack.browserify || !pack.browserify.transform)) {
                  _context7.next = 12;
                  break;
                }

                return _context7.abrupt('return', null);

              case 12:
                _context7.next = 14;
                return loadTransforms(pack.browserify.transform, packDir);

              case 14:
                transforms = _context7.sent;
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context7.prev = 18;
                _iterator3 = transforms[Symbol.iterator]();

              case 20:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context7.next = 31;
                  break;
                }

                trans = _step3.value;

                if (trans) {
                  _context7.next = 24;
                  break;
                }

                return _context7.abrupt('continue', 28);

              case 24:
                _context7.next = 26;
                return drainStream(trans, code, id);

              case 26:
                tempCode = _context7.sent;

                if (tempCode) {
                  code = tempCode;
                }

              case 28:
                _iteratorNormalCompletion3 = true;
                _context7.next = 20;
                break;

              case 31:
                _context7.next = 37;
                break;

              case 33:
                _context7.prev = 33;
                _context7.t0 = _context7['catch'](18);
                _didIteratorError3 = true;
                _iteratorError3 = _context7.t0;

              case 37:
                _context7.prev = 37;
                _context7.prev = 38;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 40:
                _context7.prev = 40;

                if (!_didIteratorError3) {
                  _context7.next = 43;
                  break;
                }

                throw _iteratorError3;

              case 43:
                return _context7.finish(40);

              case 44:
                return _context7.finish(37);

              case 45:
                return _context7.abrupt('return', code);

              case 46:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee6, this, [[18, 33, 37, 45], [38,, 40, 44]]);
      }));

      function transform(_x9, _x10) {
        return _ref4.apply(this, arguments);
      }

      return transform;
    }()
  };
});

export default index;