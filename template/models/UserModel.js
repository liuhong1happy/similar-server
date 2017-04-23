import Model from 'similar-server/dist/model';
import ResultModel from './ResultModel';
import User from '../services/User';

class UserModel {
    constructor(data) {
        this.data = new User(data);
    }
    async save() {
        const result = new ResultModel();
        try{
            const response = await this.data.save();
            result.Data = response;
            result.Status = 'success';
        } catch(e) {
            result.Msg = e.message;
            result.Status = 'error';
        }
        return result;
    }
    static async queryUser(id) {
        const result = new ResultModel();
        try{
            const response = await User.findById(id).exec();
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

export default UserModel;