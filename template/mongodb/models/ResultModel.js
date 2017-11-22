import Model from 'similar-server/dist/model';

class ResultModel extends Model {
    constructor(status = 'success', msg = '', data = {}) {
        super(data)
        this.status = status;
        this.msg = msg;
    }
    getData() {
        const { status, msg, data } = this;
        return { status, msg, data };
    }
    static get Success() { return 'success' }
    static get Error(){ return 'error' }
    set Status(status) {
        this.status = status;
    }
    set Msg(msg) {
        this.msg = msg;
    }
    set Data(data) {
        this.data = data;
    }
}

export default ResultModel;