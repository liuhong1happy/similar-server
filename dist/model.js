"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
    function Model(data) {
        _classCallCheck(this, Model);

        this.data = data || {};
    }

    _createClass(Model, [{
        key: "set",
        value: function set(key, value) {
            this.data[key] = value;
        }
    }, {
        key: "get",
        value: function get(key) {
            return this.data[key];
        }
    }, {
        key: "getData",
        value: function getData() {
            return this.data;
        }
    }, {
        key: "setData",
        value: function setData(data) {
            this.data = data || [];
        }
    }]);

    return Model;
}();

exports.default = Model;