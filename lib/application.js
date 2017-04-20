const http = require('http');
const application = module.exports = ()=> {
    const app = function(req, res) {
        app.handle(req, res);
    }

    app.routeTable = [];
    app.routePlugins = [];
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

        const parseUrlByRouteTable = function(table = [], url) {
            const stack = [];
            const handlers = table.filter((route)=>{
                var flag = this.matchLocation(route.location, url);
                return flag;
            })
        }
        return app.routePlugins.concat(parseUrlByRouteTable(app.routeTable, url));
    }

    app.handle = function(req, res, callback) {
        // 匹配一批出来，组合成 next stack
        const stack = app.match(req.url);
        const idx = 0;
        const next = function() {
            const done = callback || function(req, res) {
                res.setHeader('Content-Type', 'text/html');
                res.setHeader('X-Foo', 'bar');
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
              layer.handle.apply(layer, req, res, next);
            }
        }
        // 调用第一个匹配项
        next();
    }
    /**
     * 定义路由
     */
    app.router = function(router) {
        app._router = router;
    }

    app.plugin = function() {
        // 定义插件
        
    }

    app.init= function() {
        // 解析路由
        app.routeTable = [];
        app.routePlugins = router.plugins || [];
        const createRoute = function(child) {
            app.routeTable.push({location: child.location, hanlder: child });
        }
        const createRoutes = function(root) {
            root.routes = createRoutesByChildren(root.children,root);
            return root.routes;
        }
        const createRoutesByChildren = function(children = [], root) {
            if(!Array.isArray(children)) children = [children];
            children.forEach((child, index) => {
                child.location = root.path+'/'+child.path;
                if(Array.isArray(child.children)) {
                    createRoutesByChildren(child.children, child);
                } else {
                    createRoute(child);
                }
            });
        }
        app.routeTable = createRoutes(app._router);
    }

    app.listen = function() {
        var server = http.createServer(this);
        return server.listen.apply(server, arguments);
    }
    return app;
}

exports.static = require('serve-static');