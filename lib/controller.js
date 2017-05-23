import colors from './colors';

export default class Controller {

    constructor() {
        if(this.__proto__.Routes && this.__proto__.Routes.length>0) {
            this.children = this.__proto__.Routes;
        }
    }

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
        console.info(colors.green, '[similar-server]['+req.method.toUpperCase()+']['+new Date().toLocaleString()+']['+req.url+']');
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