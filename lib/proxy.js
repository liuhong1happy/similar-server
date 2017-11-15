import httpProxy from 'http-proxy';
export default function(options) {
    const PathRewrite = function(rewriteRules, path) {
        for(var regex in rewriteRules) {
            var value = rewriteRules[regex];
            path = path.replace(regex, value)
        }
        return path;
    }

    const proxy = httpProxy.createProxyServer({});
    // 捕获异常
    proxy.on('error', (err, req, res) => {
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
    });

    proxy.on('proxyReq', function(proxyReq, req, res) {
        if(options.pathRewrite) {
            proxyReq.path = PathRewrite(options.pathRewrite, proxyReq.path);
        }
        if(options.proxyReq && typeof options.proxyReq === 'function') {
            options.proxyReq(proxyReq, req, res);
        }
    });
    
    return function(req, res, next) {
        try {
            proxy.web(req, res, options);
        } catch (error) {
            next();
        }
    }
}