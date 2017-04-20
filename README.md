# similar-server

## Install

    npm install -g similar-server

## Usage

``` js
    const SimpleServer = require('similar-server');
    const { Application, Route, Router, Controller } = SimpleServer;
    const app = SimpleServer.Application();

    class HomeIndexController extends Controller {
        GET(req, res, next) {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('X-Foo', 'bar');
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('home-index');
        }
    }

    app.router(Router('/',[
        Route('home', [
            Route('index', new HomeIndexController()),
        ])   
    ]));

    app.init();

    app.listen(3002);
```

## CLI

1. Create Template Project

        similar-server-cli AwesomeProject

## Contact

Email: [liuhong1.happy@163.com](mailto:liuhong1.happy@163.com)
