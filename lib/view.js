var ejs = require('ejs');
var path = require('path');
var mime = require('mime');

function RenderView(view, engine = ejs.renderFile, options = {}) {
  return function(target, key, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = (req, res, next)=>{
      const model = oldValue.apply(target, req, res, next);
      // 返回页面
      engine(path.resolve('views',view), model.getData(), options, (err, data)=> {
        if(err) next();
        else {
            // 渲染页面
            response.write(data);
            response.end();
        }
      });
    }
    return descriptor;
  }
}

module.exports = {
    RenderView
}
