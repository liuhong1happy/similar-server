'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var http = require('http');
var Static = require('./static');
var application = module.exports = function () {
    var app = function app(req, res) {
        app.handle(req, res);
    };

    app.routeTable = [];
    app.routePlugins = [];
    app.match = function (url) {
        var matchLocation = function matchLocation(location, url) {
            var locations = location.split("/");
            var hashs = url.split("/");
            var props = { location: url };
            if (locations.length == hashs.length) {
                var results = locations.filter(function (ele, pos) {
                    var _hash = hashs[pos];
                    if (_hash.indexOf("?") != -1) {
                        var _hashs = _hash.split("?");
                        hashs[pos] = _hashs[0];
                        var eles = _hashs[1].split("&");
                        for (var i = 0; i < eles.length; i++) {
                            var objs = eles[i].split("=");
                            props[objs[0]] = objs[1];
                        }
                    }
                    if (ele.indexOf(":") != -1) {
                        props[ele.split(":")[1]] = hashs[pos];
                        return true;
                    } else {
                        return ele == hashs[pos];
                    }
                });
                return results.length == locations.length ? props : null;
            }
            return null;
        };
        var parseUrlByRouteTable = function parseUrlByRouteTable() {
            var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var url = arguments[1];

            var stack = [];
            var routes = table.filter(function (route) {
                var flag = matchLocation(route.location, url);
                if (route.hanlder) route.hanlder.params = flag;
                return flag;
            });
            return routes.map(function (route) {
                return route.hanlder;
            });
        };
        var handlers = parseUrlByRouteTable(app.routeTable, url);
        return app.routePlugins.concat(handlers);
    };

    app.handle = function (req, res, callback) {
        // 匹配一批出来，组合成 next stack
        var stack = app.match(req.url);
        var idx = 0;
        var next = function next() {
            var done = callback || function (req, res) {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('ok');
            };
            var layer = stack[idx++];
            if (layer == undefined) {
                done(req, res);
            }
            if (typeof layer == 'function') {
                layer(req, res, next);
            }
            if ((typeof layer === 'undefined' ? 'undefined' : _typeof(layer)) == 'object') {
                layer.handle(req, res, next);
            }
        };
        // 调用第一个匹配项
        next();
    };
    /**
     * 定义路由
     */
    app.router = function (router) {
        app._router = router;
    };

    app.static = function (dir, engine) {
        app.routePlugins.push(Static(dir, engine));
    };

    app.plugin = function (_plugin) {
        // 定义插件
        app.routePlugins.push(_plugin);
    };

    app.init = function () {
        // 解析路由
        app.routeTable = [];
        app.routePlugins = app.routePlugins.concat(app._router.plugins || []);
        var createRoute = function createRoute(location, hanlder) {
            app.routeTable.push({ location: location, hanlder: hanlder });
        };
        var createRoutes = function createRoutes(root) {
            createRoutesByChildren(root.children, root);
        };
        var createRoutesByChildren = function createRoutesByChildren() {
            var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var root = arguments[1];

            var routes = [];
            if (!Array.isArray(children)) children = [children];
            children.forEach(function (child, index) {
                if (Array.isArray(child.children)) {
                    if (root.type == 'router') child.location = '/' + child.path;else child.location = root.location + '/' + child.path;
                    createRoutesByChildren(child.children, child);
                } else {
                    createRoute(root.location, child);
                }
            });
        };
        createRoutes(app._router);
        app.routeTable.forEach(function (route) {
            console.info('[ROUTE]', route.location, route.hanlder);
        });
    };

    app.listen = function () {
        var server = http.createServer(this);
        return server.listen.apply(server, arguments);
    };
    return app;
};