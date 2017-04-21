import Controller from 'similar-server/lib/controller';
import { RenderView } from 'similar-server/lib/view';

class HomeController extends Controller {
    @RenderView('index.html')
    GET(req, res, next) {
        return {};
    }
}

module.exports = HomeController;
