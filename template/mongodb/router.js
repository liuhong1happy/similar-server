import { Route, Router } from 'similar-server';
import HomeController from './controllers/HomeController';
import UserController from './controllers/UserController';

export default Router('/',[
    Route('home/:id', new HomeController()),
    Route('user', new UserController())
]);