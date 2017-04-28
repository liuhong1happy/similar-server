import HomeModel from '../models/HomeModel';

class HomeService {
    getData(params) {
        const model = new HomeModel(params);
        return model;
    }
}