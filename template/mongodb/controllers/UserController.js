import Controller from 'similar-server/dist/controller';
import { RenderAPI } from 'similar-server/dist/view';
import UserService from '../services/UserService';

const services = new UserService();

class UserController extends Controller {
    @RenderAPI()
    GET(req, res, next, params) {
        const model = services.queryUser(params.id);
        return model;
    }
}

export default UserController;