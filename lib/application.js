import http from 'http';
import Static from './static';
import colors from './colors';
import Proxy from './proxy';

export default ()=> {
    const app = function(req, res) {
        app.handle(req, res);
    }

    app.routeTable = [];
    app.routePlugins = [];
    app._router = {
        plugins: [],
        children: [],
    }
    /**
     * 匹配路由
     * 1. 普通路由规则 /api/:api
     */
    app.match = function(url) {
        const matchLocation = function(location, url) {
            const locations = location.split("/");
            const hashs = url.split("/");
            const props = { location: url };
            if(locations.length==hashs.length){
                var results = locations.filter(function(ele,pos){
                    var _hash = hashs[pos];
                    if(_hash.indexOf("?")!=-1){
                            var _hashs = _hash.split("?");
                            hashs[pos] = _hashs[0];
                            var eles = _hashs[1].split("&");
                            for(var i=0;i<eles.length;i++){
                                var objs = eles[i].split("=");
                                props[objs[0]] = objs[1];
                            }
                    }
                    if(ele.indexOf(":")!=-1){
                        props[ele.split(":")[1]] = hashs[pos];
                        return true;
                    }else{
                        return ele == hashs[pos];
                    }
                })
                return results.length == locations.length ? props : null;
            }
            return null;
        }
        const matchRegexp = function(location, url) {
            const reg = new RegExp(location, 'gmi');
            const params = [];
            let match = {};
            reg.lastIndex = 0;
            while(match = reg.exec(url)) {
                params.push(match);
            }
            if(params.length===0) return null;
            else return params;
        }
        const parseUrlByRouteTable = function(table = [], url) {
            const stack = [];
            const routes = table.filter((route)=>{
                let flag = matchLocation(route.location, url);
                if(!flag) flag = matchRegexp(route.location, url);
                if(route.hanlder) route.hanlder.params = flag;
                return flag;
            })
            return routes.map(route=> route.hanlder);
        }
        const handlers = parseUrlByRouteTable(app.routeTable, url);
        return app.routePlugins.concat(handlers);
    }
    /**
     * http 请求入口
     */
    app.handle = function(req, res, callback) {
        // 匹配一批出来，组合成 next stack
        const stack = app.match(req.url);
        let idx = 0;
        res.setHeader("Server","SimilarServer");
        const next = function() {
            const done = callback || function(req, res) {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('ok');
            }
            const layer = stack[idx++];
            if(layer==undefined) {
              done(req, res);
            }
            if(typeof layer == 'function') {
              layer(req, res, next);
            }
            if(typeof layer == 'object') {
              layer.handle(req, res, next);
            }
        }
        // 调用第一个匹配项
        next();
    }
    /**
     * 定义路由
     */
    app.router = function(router) {
        app._router = router || app._router;
    }
    /**
     * 添加插件
     */
    app.static = function(dir, engine) {
        app.routePlugins.push(Static(dir, engine));
    }
    /**
     * 添加插件
     */
    app.plugin = function(_plugin) {
        app.routePlugins.push(_plugin);
    }
    // 添加路由
    app.route = function(location, hanlder) {
        app.routeTable.push({location, hanlder});
    }

    app.proxy = function(location, options) {
        if(typeof options !== 'object') throw new Error('param options must be an object');
        if(typeof options.target  !== 'string') throw new Error('options.target must be an proxy server\'s url');
        app.routeTable.push({location, hanlder: Proxy(options)});
    }

    // 添加插件
    app.use = function(_plugin) {
        app.routePlugins.push(_plugin);
    }
    /**
     * 初始化路由和插件
     */
    app.init= function() {
        // 解析路由
        app.routePlugins = app.routePlugins.concat(app._router.plugins || []);
        const createRoute = function(location, hanlder) {
            app.routeTable.push({location, hanlder });
        }
        const createRoutes = function(root) {
            createRoutesByChildren(root.children || [],root);
        }
        const createRoutesByChildren = function(children = [], root) {
            if(['router', 'route'].indexOf(root.type)===-1) return;
            const routes = [];
            if(!Array.isArray(children)) children = [children];
            children.forEach((child, index) => {
                if(Array.isArray(child.children) && !child.path) {
                    createRoutesByChildren(child.children, root);
                    createRoute(root.location, child);
                    return;
                }
                if(Array.isArray(child.children)) {
                    if(root.type=='router') child.location = '/'+child.path;
                    else child.location = root.location+'/'+child.path;
                    createRoutesByChildren(child.children, child);
                } else {
                    createRoute(root.location, child);
                }
            });
        }
        createRoutes(app._router);
        app.routeTable.forEach(route=>{
            console.info(colors.yellow, '[similar-server][ROUTE]['+route.location+']', route.hanlder);
        })
        app.routePlugins.forEach(plugin=>{
            console.info(colors.yellow,  '[similar-server][PLUGINGS]['+plugin.name+']');
        })
    }

    app.listen = function() {
        var server = http.createServer(this);
        return server.listen.apply(server, arguments);
    }

    return app;
}