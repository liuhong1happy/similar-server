import Controller from 'similar-server/dist/controller';
import { RenderView } from 'similar-server/dist/view';
import HomeService from '../services/HomeService';

const service = new HomeService();

class HomeController extends Controller {
    @RenderView('index.html')
    GET(req, res, next, params) {
        return service.getData(params);
    }
}

export default HomeController;
