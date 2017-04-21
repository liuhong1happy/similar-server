'use strict';

var ejs = require('ejs');
var path = require('path');
var mime = require('mime');

function RenderView(view) {
  var engine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ejs.renderFile;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return function (target, key, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function (req, res, next) {
      var model = oldValue.apply(target, req, res, next);
      // 返回页面
      engine(path.resolve('views', view), model.getData(), options, function (err, data) {
        if (err) next();else {
          // 渲染页面
          response.write(data);
          response.end();
        }
      });
    };
    return descriptor;
  };
}

module.exports = {
  RenderView: RenderView
};