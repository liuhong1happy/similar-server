const SimpleServer = require('similar-server');
const { Application, Route, Router } = SimpleServer;
const app = SimpleServer.Application();

const HomeIndexHandler = (req, res) => {

}

app.router(Router('/',[
    Route('home', [
        Route('index', HomeIndexHandler),
    ])   
]));
app.init();

app.listen(3002);

