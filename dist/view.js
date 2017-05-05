'use strict';

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RenderView(view) {
  var engine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _ejs2.default.renderFile;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return function (target, key, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function (req, res, next, params) {
      var model = oldValue.apply(target, [req, res, next, params]);
      // 返回页面
      engine(_path2.default.resolve('views', view), model.getData(), options, function (err, data) {
        if (err) next();else {
          // 渲染页面
          console.info(_colors2.default.green, '[similar-server][VIEW][' + req.method.toUpperCase() + '][' + new Date().toLocaleString() + '][' + req.url + ']');
          res.write(data);
          res.end();
        }
      });
    };
    return descriptor;
  };
}

function RenderAPI() {
  return function (target, key, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function (req, res, next, params) {
      var promise = oldValue.apply(target, [req, res, next, params]);
      var send = function send(data) {
        // 返回页面
        console.info(_colors2.default.green, '[similar-server][API][' + req.method.toUpperCase() + '][' + new Date().toLocaleString() + '][' + req.url + ']');
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data));
        res.end();
      };
      if (promise instanceof global.Promise) {
        promise.then(function (model) {
          send(model.getData());
        });
      } else {
        send(promise.getData());
      }
    };
    return descriptor;
  };
}

module.exports = {
  RenderView: RenderView,
  RenderAPI: RenderAPI
};