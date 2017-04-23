'use strict';

var ejs = require('ejs');
var path = require('path');
var mime = require('mime');

function RenderView(view) {
  var engine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ejs.renderFile;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return function (target, key, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function (req, res, next, params) {
      var model = oldValue.apply(target, [req, res, next, params]);
      // 返回页面
      engine(path.resolve('views', view), model.getData(), options, function (err, data) {
        if (err) next();else {
          // 渲染页面
          console.info('[VIEW]', new Date().toString(), req.url);
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
        console.info('[API]', new Date().toString(), req.url);
        res.setHeader('Content-Type', 'application/json');
        res.write(data);
        res.end();
      };
      if (promise instanceof global.Promise) {
        promise.then(function (model) {
          var data = model.getData();
          res.write(JSON.stringify(data));
          send(data);
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