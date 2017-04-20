const http = require('http');
module.exports = ()=> {
    const app = function(req, res) {
        app.handle(req, res);
    }

    app.handle = function(req, res) {
        console.log(req);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('X-Foo', 'bar');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('ok');
    }

    app.router = function(router) {
        // 定义路由
        // console.log(router);
    }

    app.plugin = function() {
        // 定义插件

    }

    app.init= function() {
        // 解析路由

    }

    app.listen = function() {
        var server = http.createServer(this);
        return server.listen.apply(server, arguments);
    }
    return app;
}