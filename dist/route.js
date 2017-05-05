'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (path, handler) {
    if (Array.isArray(handler) && handler.length > 0) {
        return {
            path: path,
            children: handler,
            type: 'route'
        };
    }
    if (typeof handler === 'function') {
        return {
            path: path,
            children: [handler],
            type: 'route'
        };
    }
    if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' && handler.handle) {
        return {
            path: path,
            children: [handler],
            type: 'route'
        };
    }
    return {
        type: 'none'
    };
};