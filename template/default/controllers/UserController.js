import Controller from 'similar-server/dist/controller';
import { RenderAPI } from 'similar-server/dist/view';
import ResultModel from '../models/ResultModel';

class UserController extends Controller {
    @RenderAPI()
    GET(req, res, next, params) {
        const model = new ResultModel();
        model.Status = 'success';
        model.Data = {
            firstName: 'Holly',
            lastName: 'Liu'
        };
        model.Msg = '';
        return model;
    }
}

export default UserController;