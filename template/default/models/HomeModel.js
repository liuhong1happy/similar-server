import Model from 'similar-server/dist/model';

class HomeModel extends Model {
    constructor(data) {
        super(data);
        this.data.title = "Similar Server";
    }
}

export default HomeModel;