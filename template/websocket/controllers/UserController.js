import Controller from 'similar-server/dist/controller';
import { RenderAPI } from 'similar-server/dist/view';
import ResultModel from '../models/ResultModel';

class UserController extends Controller {
    @RenderAPI()
    GET(req, res, next, params) {
        return new ResultModel(ResultModel.Success, '', {
            firstName: 'Holly',
            lastName: 'Liu'
        });
    }
}

export default UserController;