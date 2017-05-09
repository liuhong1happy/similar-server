import httpProxy from 'http-proxy';
export default function(options) {
    const proxy = httpProxy.createProxyServer({});
    // 捕获异常
    proxy.on('error', (err, req, res) => {
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
    });
    return function(req, res, next) {
        try {
            proxy.web(req, res, options);
        } catch (error) {
            next();
        }
    }
}