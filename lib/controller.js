module.exports  = class Controller {
    handle(res, req, next) {
        switch(res.method.toLowerCase()) {
            case 'get':
                this.GET ? this.GET(req, res, next) : next();
                break;
            case 'post':
                this.POST ? this.POST(req, res, next) : next();
                break;
            case 'delete':
                this.DELETE ? this.DELETE(req, res, next) : next();
                break;
            case 'put':
                this.PUT ? PUT(req, res, next) : next();
                break;
        }
    }
    GET(req, res, next) {
        next()
    }
    POST(req, res, next) {
        next()
    }
    PUT(req, res, next) {
        next()
    }
    DELETE(req, res, next) {
        next()
    }
};