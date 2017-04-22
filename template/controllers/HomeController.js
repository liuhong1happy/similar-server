import Controller from 'similar-server/dist/controller';
import { RenderView } from 'similar-server/dist/view';
import HomeModel from '../models/HomeModel';

class HomeController extends Controller {
    @RenderView('index.html')
    GET(req, res, next, params) {
        return new HomeModel(params);
    }
}

module.exports = HomeController;
