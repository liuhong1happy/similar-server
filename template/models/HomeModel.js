import {Model} from 'similar-server/lib/model';

class HomeModel extends Model {
    constructor(data) {
        super(data);
        this.data.title = "home-index";
    }
}

module.exports = HomeModel;