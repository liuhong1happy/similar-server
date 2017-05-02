import UserDAO from '../dao/UserDAO';

class UserService {
    constructor() {
        this.dao = new UserDAO();
    }
    queryUser(id) {
        return this.dao.queryUser(id);
    }
    createUser(data) {
        return this.dao.save(data);
    }
}