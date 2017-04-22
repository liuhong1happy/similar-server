module.exports  = class Controller {
    handle(req, res, next) {
        switch(req.method.toLowerCase()) {
            case 'get':
                this.GET ? this.GET(req, res, next, this.params) : next();
                break;
            case 'post':
                this.POST ? this.POST(req, res, next, this.params) : next();
                break;
            case 'delete':
                this.DELETE ? this.DELETE(req, res, next, this.params) : next();
                break;
            case 'put':
                this.PUT ? PUT(req, res, next, this.params) : next();
                break;
        }
        console.info('['+req.method.toUpperCase()+']', new Date().toString(), req.url);
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