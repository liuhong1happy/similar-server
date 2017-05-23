'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);

        if (this.__proto__.Routes && this.__proto__.Routes.length > 0) {
            this.children = this.__proto__.Routes;
        }
    }

    _createClass(Controller, [{
        key: 'handle',
        value: function handle(req, res, next) {
            switch (req.method.toLowerCase()) {
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
            console.info(_colors2.default.green, '[similar-server][' + req.method.toUpperCase() + '][' + new Date().toLocaleString() + '][' + req.url + ']');
        }
    }, {
        key: 'GET',
        value: function GET(req, res, next) {
            next();
        }
    }, {
        key: 'POST',
        value: function POST(req, res, next) {
            next();
        }
    }, {
        key: 'PUT',
        value: function PUT(req, res, next) {
            next();
        }
    }, {
        key: 'DELETE',
        value: function DELETE(req, res, next) {
            next();
        }
    }]);

    return Controller;
}();

exports.default = Controller;
;