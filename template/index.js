const { Application, Route, Router } = require('similar-server');
const HomeController = require('./controllers/HomeController');

const app = Application();
app.router(Router('/',[
    Route('home', new HomeController())   
]));
app.static('assets');
app.init();
app.listen(3002);

