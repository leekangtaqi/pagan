'use strict';

var co = require('co');
var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(fs);

var serve = function serve(url, _ref) {
	var _ref$gzip = _ref.gzip;
	var gzip = _ref$gzip === undefined ? true : _ref$gzip;

	return function (req, res, next) {
		if (!isFile(req)) {
			return next();
		};
		co(regeneratorRuntime.mark(function _callee() {
			var encodings, filePath, file;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.prev = 0;
							encodings = req.acceptsEncodings('gzip');
							filePath = path.join(url, req.originalUrl) + '.gz';
							_context.t0 = encodings === 'gzip' && gzip;

							if (!_context.t0) {
								_context.next = 8;
								break;
							}

							_context.next = 7;
							return fs.statAsync(filePath);

						case 7:
							_context.t0 = _context.sent;

						case 8:
							if (!_context.t0) {
								_context.next = 12;
								break;
							}

							file = getFileName(req) + '.gz';

							res.sendFile(file, {
								root: path.join(url, '/js'),
								headers: {
									'Content-Encoding': 'gzip'
								}
							});
							return _context.abrupt('return');

						case 12:
							_context.next = 18;
							break;

						case 14:
							_context.prev = 14;
							_context.t1 = _context['catch'](0);

							console.error(_context.t1);
							next(_context.t1);

						case 18:
							next();

						case 19:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, this, [[0, 14]]);
		}));
	};
};

var getFileName = function getFileName(req) {
	var parts = req.originalUrl.split('/');
	return parts[parts.length - 1];
};

var isFile = function isFile(req) {
	var uri = getFileName(req);
	if (uri && uri.match('\.js')) {
		return true;
	}
	return false;
};

module.exports = {
	serve: serve
};