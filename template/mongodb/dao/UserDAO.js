import Model from 'similar-server/dist/model';
import ResultModel from '../models/ResultModel';
import UserModel from '../models/UserModel';

class UserDAO {
    async save(data) {
        const user = UserModel.build(data)
        const result = new ResultModel();
        try{
            const response = await user.save();
            result.Data = response;
            result.Status = 'success';
        } catch(e) {
            result.Msg = e.message;
            result.Status = 'error';
        }
        return result;
    }
    async queryUser(id) {
        const result = new ResultModel();
        try{
            const response = await UserModel.findById(id);
            result.Data = response;
            result.Status = 'success';
            return result;
        } catch(e) {
            result.Msg = e.message;
            result.Status = 'error';
            return result;
        }

    }
}

export default UserDAO;