import SimilarServer from 'similar-server';
import HomeController from './controllers/HomeController';
import UserController from './controllers/UserController';

const {Router, Route} = SimilarServer;

export default Router('/',[
    Route('', new HomeController()),
    Route('api',[
        Route('user', new UserController())
    ]),
]);