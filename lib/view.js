import ejs from 'ejs';
import path from 'path';
import mime from 'mime';
import colors from './colors';

function RenderView(view, engine = ejs.renderFile, options = {}) {
  return function(target, key, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = (req, res, next, params)=>{
      const model = oldValue.apply(target, [req, res, next, params]);
      // 返回页面
      engine(path.resolve('views',view), model.getData(), options, (err, data)=> {
        if(err) next();
        else {
            // 渲染页面
            console.info(colors.green, '[similar-server][VIEW]['+req.method.toUpperCase()+']['+new Date().toLocaleString()+']['+req.url+']');
            res.write(data);
            res.end();
        }
      });
    }
    return descriptor;
  }
}

function RenderAPI() {
  return function(target, key, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = (req, res, next, params)=>{
      const promise = oldValue.apply(target, [req, res, next, params]);
      const send = (data)=>{
          // 返回页面
          console.info(colors.green, '[similar-server][API]['+req.method.toUpperCase()+']['+new Date().toLocaleString()+']['+req.url+']');
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(data));
          res.end();
      }
      if(promise instanceof global.Promise) {
        promise.then(model=>{
          send(model.getData());
        })
      } else {
        send(promise.getData());
      }
    }
    return descriptor;
  }
}

function Method(path, method) {
  return function(target, key, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = (req, res, next, params)=>{
      if(req.method.toUpperCase() !== method.toUpperCase()) {
        next();
        return;
      }
      oldValue.apply(target, [req, res, next, descriptor.value.params]);
    }

    target.Routes = target.Routes || [];
    target.Routes.push({ path, children: [descriptor.value], type: 'route', plugins: [] });

    return descriptor;
  }
} 

function Post(path) {
  return Method(path, 'post')
}

function Get(path) {
  return Method(path, 'get')
}

function Put(path) {
  return Method(path, 'put')
}

function Delete(path) {
  return Method(path, 'delete')
}

module.exports = {
    RenderView,
    RenderAPI,
    Method,
    Post,
    Get,
    Delete,
    Put,
}
