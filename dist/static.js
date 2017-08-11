'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (assetsDir) {
    return function Static(request, response, next) {
        var obj = _url2.default.parse(request.url);
        var pathname = decodeURIComponent(obj.pathname);
        var realPath = _path2.default.join(assetsDir, _path2.default.normalize(pathname.replace(/\.\./g, "")));
        var pathHandle = function pathHandle(realPath) {
            //用fs.stat方法获取文件
            try {
                var stats = _fs2.default.stat(realPath);
                if (stats.isDirectory()) {
                    next();
                } else {
                    var ext = _path2.default.extname(realPath);
                    ext = ext ? ext.slice(1) : 'unknown';

                    var contentType = _mime2.default.lookup(realPath) || "text/plain";
                    response.setHeader("Content-Type", contentType + ";charset=utf-8");

                    var lastModified = stats.mtime.toUTCString();
                    var ifModifiedSince = "If-Modified-Since".toLowerCase();
                    response.setHeader("Last-Modified", lastModified);

                    var Expires = {
                        fileMatch: /^(gif|png|jpg|js|css)$/ig,
                        maxAge: 60 * 60 * 24 * 365
                    };

                    if (ext.match(Expires.fileMatch)) {
                        var expires = new Date();
                        expires.setTime(expires.getTime() + Expires.maxAge * 1000);
                        response.setHeader("Expires", expires.toUTCString());
                        response.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
                    }

                    if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                        response.writeHead(304, "Not Modified");
                        response.end();
                    } else {
                        var Compress = {
                            match: /css|js|html/ig
                        };
                        var raw = _fs2.default.createReadStream(realPath);
                        var acceptEncoding = request.headers['accept-encoding'] || "";
                        var matched = ext.match(Compress.match);

                        if (matched && acceptEncoding.match(/\bgzip\b/)) {
                            response.writeHead(200, "Ok", { 'Content-Encoding': 'gzip' });
                            raw.pipe(_zlib2.default.createGzip()).pipe(response);
                        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                            response.writeHead(200, "Ok", { 'Content-Encoding': 'deflate' });
                            raw.pipe(_zlib2.default.createDeflate()).pipe(response);
                        } else {
                            response.writeHead(200, "Ok");
                            raw.pipe(response);
                        }
                    }
                    console.info(_colors2.default.yellow, '[similar-server][Static][' + new Date().toLocaleString() + '][' + realPath + ']');
                }
            } catch (error) {
                next();
            }
        };
        pathHandle(realPath);
    };
};

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }