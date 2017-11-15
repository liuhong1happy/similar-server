'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (options) {
    var PathRewrite = function PathRewrite(rewriteRules, path) {
        for (var regex in rewriteRules) {
            var value = rewriteRules[regex];
            path = path.replace(regex, value);
        }
        return path;
    };

    var proxy = _httpProxy2.default.createProxyServer({});
    // 捕获异常
    proxy.on('error', function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
    });

    proxy.on('proxyReq', function (proxyReq, req, res) {
        if (options.pathRewrite) {
            proxyReq.path = PathRewrite(options.pathRewrite, proxyReq.path);
        }
        if (options.proxyReq && typeof options.proxyReq === 'function') {
            options.proxyReq(proxyReq, req, res);
        }
    });

    return function (req, res, next) {
        try {
            proxy.web(req, res, options);
        } catch (error) {
            next();
        }
    };
};

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }