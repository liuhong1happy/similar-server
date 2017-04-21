const { Application, Route, Router } = require('similar-server');
const Controller = require('similar-server/controller');

const app = Application();
app.router(Router('/',[
    Route('home', new HomeController())   
]));
app.static('assets');
app.init();
app.listen(3002);

