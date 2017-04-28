import Controller from 'similar-server/dist/controller';
import { RenderAPI } from 'similar-server/dist/view';
import UserService from '../services/UserService';

class UserController extends Controller {
    constructor() {
        this.services = new UserService();
    }
    @RenderAPI()
    GET(req, res, next, params) {
        const model = this.services.queryUser(params.id);
        return model;
    }
}

export default UserController;