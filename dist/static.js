"use strict";

var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var zlib = require("zlib");
var ejs = require("ejs");

module.exports = function (assetsDir) {
    var engine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ejs;

    return function Static(request, response, next) {
        var obj = url.parse(request.url);
        response.setHeader("Server", "Node/V8");
        var pathname = obj.pathname;
        var realPath = path.join(assetsDir, path.normalize(pathname.replace(/\.\./g, "")));
        var pathHandle = function pathHandle(realPath) {
            //用fs.stat方法获取文件
            fs.stat(realPath, function (err, stats) {
                if (err) {
                    next();
                } else {
                    if (stats.isDirectory()) {} else {
                        var contentType = mime.lookup(realPath) || "text/plain";
                        response.setHeader("Content-Type", contentType);

                        var lastModified = stats.mtime.toUTCString();
                        var ifModifiedSince = "If-Modified-Since".toLowerCase();
                        response.setHeader("Last-Modified", lastModified);

                        var Expires = {
                            fileMatch: /^(gif|png|jpg|js|css)$/ig,
                            maxAge: 60 * 60 * 24 * 365
                        };
                        var ext = path.extname(realPath);
                        ext = ext ? ext.slice(1) : 'unknown';
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
                            var raw = fs.createReadStream(realPath);
                            var acceptEncoding = request.headers['accept-encoding'] || "";
                            var matched = ext.match(Compress.match);

                            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                                response.writeHead(200, "Ok", { 'Content-Encoding': 'gzip' });
                                raw.pipe(zlib.createGzip()).pipe(response);
                            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                                response.writeHead(200, "Ok", { 'Content-Encoding': 'deflate' });
                                raw.pipe(zlib.createDeflate()).pipe(response);
                            } else {
                                response.writeHead(200, "Ok");
                                raw.pipe(response);
                            }
                        }
                        console.info('[Static]', new Date().toString(), realPath);
                    }
                }
            });
        };
        pathHandle(realPath);
    };
};