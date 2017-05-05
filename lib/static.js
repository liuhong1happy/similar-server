import url from 'url';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import zlib from 'zlib';
import ejs from 'ejs';
import colors from './colors';

export default function(assetsDir, engine = ejs) {
    return function Static(request, response, next) {
        var obj = url.parse(request.url);
        var pathname=obj.pathname;
        var realPath = path.join(assetsDir, path.normalize(pathname.replace(/\.\./g, "")));
        var pathHandle=function(realPath){
            //用fs.stat方法获取文件
            fs.stat(realPath,function(err,stats){
                if(err){
                    next();
                }else{
                    if (stats.isDirectory()) {
                        next();
                    } else {
                        var contentType = mime.lookup(realPath) || "text/plain";
                        response.setHeader("Content-Type", contentType);

                        var lastModified = stats.mtime.toUTCString();
                        var ifModifiedSince = "If-Modified-Since".toLowerCase();
                        response.setHeader("Last-Modified", lastModified);

                        const Expires = {
                            fileMatch: /^(gif|png|jpg|js|css)$/ig,
                            maxAge: 60*60*24*365
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
                            const Compress = {
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
                        console.info(colors.yellow,'[similar-server][Static]['+new Date().toLocaleString()+']['+realPath+']');
                    }
                }
            });

        }
        pathHandle(realPath);
    }
}

