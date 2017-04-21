'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    var handler = arguments[1];
    var plugings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (Array.isArray(handler) && handler.length > 0) {
        return {
            path: path,
            children: handler,
            type: 'router',
            plugings: plugings
        };
    }
    if (typeof handler === 'function') {
        return {
            path: path,
            children: [handler],
            type: 'router',
            plugings: plugings
        };
    }
    if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' && handler.handle) {
        return {
            path: path,
            children: [handler],
            type: 'router',
            plugings: plugings
        };
    }
    throw new Error('Router必须有handler参数，且参数类型为Route数组或者http request处理函数!');
};