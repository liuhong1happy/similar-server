import Controller from 'similar-server/dist/controller';
import { RenderView } from 'similar-server/dist/view';

class HomeController extends Controller {
    @RenderView('index.html')
    GET(req, res, next) {
        return {};
    }
}

module.exports = HomeController;
