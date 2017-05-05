import Controller from 'similar-server/dist/controller';
import { RenderView } from 'similar-server/dist/view';
import HomeService from '../services/HomeService';

class HomeController extends Controller {
    constructor() {
        super();
        this.service = new HomeService();
    }
    
    @RenderView('index.html')
    GET(req, res, next, params) {
        return this.service.getData(params);
    }
}

export default HomeController;
