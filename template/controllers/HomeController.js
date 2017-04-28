import Controller from 'similar-server/dist/controller';
import { RenderView } from 'similar-server/dist/view';
import HomeService from '../models/HomeService';

class HomeController extends Controller {
    constructor(props, context) {
        super(props, context);
        this.service = new HomeService();
    }
    
    @RenderView('index.html')
    GET(req, res, next, params) {
        return this.service.getData(params);
    }
}

export default HomeController;
