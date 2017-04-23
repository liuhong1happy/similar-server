import Controller from 'similar-server/dist/controller';
import { RenderAPI } from 'similar-server/dist/view';
import UserModel from '../models/UserModel';

class UserController extends Controller {
    @RenderAPI()
    GET(req, res, next, params) {
        const model = UserModel.queryUser(params.id);
        return model;
    }
}

export default UserController;