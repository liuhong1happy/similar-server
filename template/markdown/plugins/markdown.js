import url from 'url';
import fs from 'fs';
import path from 'path';
import marked from 'marked';

const MarkdownPlugin = function(assetsDir) {
    return function Markdown(request, response, next) {
        const obj = url.parse(request.url);
        const pathname = obj.pathname;
        const realPath = path.join(assetsDir, path.normalize(pathname.replace(/\.\./g, "")));
        const pathHandle = function(realPath){
            //用fs.stat方法获取文件
            fs.stat(realPath,function(err,stats){
                if(err){
                    next();
                }else{
                    if (stats.isDirectory()) {
                        next();
                    } else {
                        let ext = path.extname(realPath);
                        ext = ext ? ext.slice(1) : 'unknown';
                        if(ext!=='md') next();

                        const { error, str } = fs.readFileSync(path, 'utf8');

                        if(error) next();
                        else response.write(marked.parse(str));
                        response.setHeader("Content-Type", 'text/html');
                        response.end();
                    }
                }
            });
        }
        pathHandle(realPath);
    }
}

export default MarkdownPlugin;