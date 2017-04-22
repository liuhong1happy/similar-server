var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var zlib = require("zlib");
var ejs = require("ejs");

module.exports = function(assetsDir, engine = ejs) {
    return function Static(request, response, next) {
        var obj = url.parse(request.url);
        response.setHeader("Server","Node/V8");
        var pathname=obj.pathname;
        var realPath = path.join(assetsDir, path.normalize(pathname.replace(/\.\./g, "")));
        console.log(realPath) ;
        var pathHandle=function(realPath){
            //用fs.stat方法获取文件
            fs.stat(realPath,function(err,stats){
                if(err){
                    next();
                }else{
                    if(stats.isDirectory()){
                    }else{
                        var contentType = mime.lookup(realPath) || "text/plain";
                        response.setHeader("Content-Type", contentType);

                        var lastModified = stats.mtime.toUTCString();
                        var ifModifiedSince = "If-Modified-Since".toLowerCase();
                        response.setHeader("Last-Modified", lastModified);

                        if (ext.match(config.Expires.fileMatch)) {
                            var expires = new Date();
                            expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                            response.setHeader("Expires", expires.toUTCString());
                            response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                        }

                        if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                            response.writeHead(304, "Not Modified");
                            response.end();
                        } else {
                            var raw = fs.createReadStream(realPath);
                            var acceptEncoding = request.headers['accept-encoding'] || "";
                            var matched = ext.match(config.Compress.match);

                            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                                response.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});
                                raw.pipe(zlib.createGzip()).pipe(response);
                            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                                response.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});
                                raw.pipe(zlib.createDeflate()).pipe(response);
                            } else {
                                response.writeHead(200, "Ok");
                                raw.pipe(response);
                            }
                        }
                    }
                }
            });

        }
        pathHandle(realPath);
    }
}

