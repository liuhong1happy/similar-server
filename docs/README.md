**目录**

<!-- TOC -->

- [1. Similar Server](#1-similar-server)
    - [1.1. 类似Express容易上手](#11-类似express容易上手)
    - [1.2. 采用MVC框架](#12-采用mvc框架)
    - [1.3. 命令行工具快速创建项目](#13-命令行工具快速创建项目)
    - [1.4. 用一种独特的方式书写路由](#14-用一种独特的方式书写路由)
    - [1.5. 区分插件和路由定义](#15-区分插件和路由定义)
    - [1.6. 关于路由匹配规则](#16-关于路由匹配规则)
- [2. 快速开始](#2-快速开始)
- [3. 理解Similar Server中的MVC框架](#3-理解similar-server中的mvc框架)
    - [3.1. Controller](#31-controller)
        - [3.1.1. HomeController](#311-homecontroller)
        - [3.1.2. UserController](#312-usercontroller)
    - [3.2. Model](#32-model)
        - [3.2.1. 自定义数据](#321-自定义数据)
        - [3.2.2. 数据库中的数据](#322-数据库中的数据)
    - [3.3 View](#33-view)
- [4. 常用场景介绍](#4-常用场景介绍)
    - [4.1. Session](#41-session)
    - [4.2. Cookie](#42-cookie)
    - [4.3. 上传下载文件](#43-上传下载文件)
        - [4.3.1 文件下载](#431-文件下载)
        - [4.3.2 文件上传](#432-文件上传)
    - [4.4. 静态文件](#44-静态文件)

<!-- /TOC -->

# 1. Similar Server

Node在ES6和ES7时代的Web Server

## 1.1. 类似Express容易上手

和Express相比，它们具有很相似的书写特点，轻松上手，毫不在话下。

```js
import {Application} from 'similar-server';
import router from './router';
// 创建Application
const app = Application();
// 定义路由
app.router(router);
// 定义静态文件路径
app.static('assets');
// 初始化路由和插件
app.init();
// 监听3002端口
app.listen(3002);
```

## 1.2. 采用MVC框架

Similar Server设计之初就开始采用MVC框架，以便让开发人员快速开发项目。

- Controller 调用Model渲染View/API
- Model 调用Services获取数据库中数据
- View 选用ejs模版作为默认模版引擎
- Service 调取DBDriver获取数据库中数据

## 1.3. 命令行工具快速创建项目

similar-server-cli 初始化创建的项目中默认采用MVC框架，数据库对应采用mongodb。

```cmd
similar-server-cli AwesomeProject
```

注：如果对创建的模版中的数据库不是很满意的，可以替换掉相应的代码。

相应代码放置如下：

1. 链接数据库 index.js utils/db.js
2. 数据持久化 services/*
3. 调取数据操作 model/*

## 1.4. 用一种独特的方式书写路由

以往写路由如果感到憋屈的话，那么采用树形结构书写路由将是一种很棒的方式。

```js
import { Route, Router } from 'similar-server';
import HomeController from './controllers/HomeController';
import UserController from './controllers/UserController';

const router = Router('/',[
    Route('home/:id', new HomeController()),
    Route('user', [
        Route('index', new UserController())
    ])
]);
```

当然，也可以使用旧的方式书写路由。

```js
app.Route('/home/:id', new HomeController());
```

## 1.5. 区分插件和路由定义

Similar Server和Express很大的不同，就在于Similar Server采用的设计区分插件和路由定义。

1. 插件定义方式如下：

```js
app.plugin((req, res, next)=>{
    /**
    * do something
    */
    next();
})
```

2. 路由定义方式

```js
app.route(path,(req, res, next, params)=>{
    /**
    * do something
    */
    /**
    * 如果不转交给下一个路由，则不调用next
    * 如果不调用next，则需要调用res.end()返回结果
    */

    next(); 
})

```

注意： 路由的书写，不仅仅是这种方式，之前提到的 [用一种独特的方式书写路由](#14-用一种独特的方式书写路由)

Similar Server一旦有http请求到达，会首先调取`所有插件`,接着调取`匹配到的路由`，执行完返回结果。

如果都没有找到对应的插件和路由，则返回404。

## 1.6. 关于路由匹配规则

1. 路由暂不支持正则匹配
2. 支持的规则包括：`/home/:id`和`/home/index`
3. 解析的路由参数，会params传递给路由使用，当然Controller的方法也能拿到params。

# 2. 快速开始

1. 全局安装Similar Server

```cmd
npm install -g similar-server 
```

2. 运行server

```cmd
cd AwesomeProject
npm start
```

# 3. 理解Similar Server中的MVC框架

## 3.1. Controller

Controller主要的作用是，调取Model获取数据，并把数据渲染到页面或者API上去。

这里以HomeController和UserController中代码为例讲解。

### 3.1.1. HomeController

```js
/** 
* HomeController.js
*/
import Controller from 'similar-server/dist/controller';
import { RenderView } from 'similar-server/dist/view';
import HomeModel from '../models/HomeModel';

class HomeController extends Controller {
    @RenderView('index.html')
    GET(req, res, next, params) {
        return new HomeModel(params);
    }
}
export default HomeController;
```

首先我们看到的是HomeController中，对于页面的渲染很简单，采用RenderView装饰器即可渲染。

```js
@RenderView(path,engine)
```

RenderView中包含三个参数，第一个参数为`path`，传递的是对应的`views`文件夹下的html文件；第二个参数为engine，传递的是渲染view的模版引擎，engine定义如下：

```js
const engine = (filePath, data, options, callback) => {
    /**
    * 引擎实现
    */
}
```
第三个参数为options，当然这个optiongs就是引擎所需的options。

### 3.1.2. UserController

```js
/** 
* UserController.js
*/
import Controller from 'similar-server/dist/controller';
import { RenderAPI } from 'similar-server/dist/view';
import UserModel from '../models/UserModel';

class UserController extends Controller {
    @RenderAPI()
    GET(req, res, next, params) {
        const model = UserModel.queryUser(params.id);
        return model;
    }
}

export default UserController;
```

UserController GET方法仅仅渲染了一个API，和渲染View不同的是RenderView装饰器更换为了RenderAPI装饰器。

RenderAPI不用传递任何参数。

当然，GET方法返回的结果仍然没有变化，返回model或者promise。

## 3.2. Model

Model主要是把`数据库中的数据`，或者`自定义的数据`给Controller层调用。

### 3.2.1. 自定义数据

自定义的数据，不需要和数据库驱动器进行交互。其代码书写方式如下：

```js
/** 
* HomeModel.js
*/
import Model from 'similar-server/dist/model';

class HomeModel extends Model {
    constructor(data) {
        super(data);
        this.data.title = "home-index";
    }
}

export default HomeModel;
```

### 3.2.2. 数据库中的数据

如果是要获取数据库中的数据，则需要和数据库驱动器打交道，当然涉及和数据库驱动器打交道的，我们会放置到Service层。

```js
/** 
* ResultModel.js
*/
import Model from 'similar-server/dist/model';

class ResultModel extends Model {
    getData() {
        const { status, msg, data } = this;
        return { status, msg, data };
    }
    set Status(status) {
        this.status = status;
    }
    set Msg(msg) {
        this.msg = msg;
    }
    set Data(data) {
        this.data = data;
    }
}

export default ResultModel;
/** 
* UserModel.js
*/
import Model from 'similar-server/dist/model';
import ResultModel from './ResultModel';
import User from '../services/User';

class UserModel {
    constructor(data) {
        this.data = new User(data);
    }
    async save() {
        const result = new ResultModel();
        try{
            const response = await this.data.save();
            result.Data = response;
            result.Status = 'success';
        } catch(e) {
            result.Msg = e.message;
            result.Status = 'error';
        }
        return result;
    }
    static async queryUser(id) {
        const result = new ResultModel();
        try{
            const response = await User.findById(id).exec();
            result.Data = response;
            result.Status = 'success';
            return result;
        } catch(e) {
            result.Msg = e.message;
            result.Status = 'error';
            return result;
        }

    }
}

export default UserModel;
```

UserModel中实现了所有需要对外的操作，这里包括save和queryUser，其中queryUser为静态方法，save为实例方法。

这里细心的同学，还会发现，我们这里利用了async/await实现异步，返回的结果为Promise对象。

当然，你不用操心处理Promise的问题，RenderAPI装饰器中可以对Promise进行处理。

## 3.3 View

View主要是静态文件集合。

RenderView装饰器中，已经对模版引擎进行了定义，那么，View中静态文件书写规则要依照模版引擎来书写。

# 4. 常用场景介绍

## 4.1. Session

用户登录信息等很多需要记录的关键信息，需要放置在服务器上存储，Session就是记录这些关键信息的存储媒介。

通过express-session插件，能很轻松的对session进行操作。

```js
const session = require('express-session')
const Application = require('similar-server/dist/application');
const app = Application();
// session plugin
app.plugin(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.plugin(function (req, res, next) {
  var views = req.session.views
  if (!views) {
    views = req.session.views = {}
  }
  // count the views
  views[req.url] = (views[req.url] || 0) + 1
  // session
  console.log('You viewed this page ' + req.session.views[req.url] + ' times');
  next()
})
app.listen(3002);
```

## 4.2. Cookie

很多时候需要使用Cookie将一些不是很重要的信息，存储在浏览器。

Similar Server借用cookie-parser插件，实现对cookie的解析。

```js
const cookieParser = require('cookie-parser');
const Application = require('similar-server/dist/application');
const app = Application();
// cookie plugin
app.plugin(cookieParser());
app.plugin(function (req, res, next) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  next()
})
app.listen(3002);
```

## 4.3. 上传下载文件

### 4.3.1 文件下载

文件下载需要设置http.response的头, `Content-Type`和`Content-Disposition`。

```js
import path from 'path';
app.route('/files/:fileName', function(req, res, next) {
   // 实现文件下载 
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, fileName);
  const stats = fs.statSync(filePath); 
  if(stats.isFile()){
    res.setHeader('Content-Type': 'application/octet-stream');
    res.setHeader('Content-Disposition': 'attachment; filename='+fileName);
    res.setHeader('Content-Length': stats.size);
    fs.createReadStream(filePath).pipe(res);
  } else {
    next();
  }
});
```

### 4.3.2 文件上传

文件上传需要使用第三方插件`multiparty`实现上传。

```js
import multiparty from 'multiparty';
app.route('/upload', function(req, res, next){
    var form = new multiparty.Form({
        encoding:"utf-8",
        uploadDir:"files",  //文件上传地址
        keepExtensions:true  //保留后缀
    })

    form.parse(req, function(err, fields, files) {
        if(err) {
          res.setHeader('Content-Type','application/json');
          res.write(JSON.stringify({status: 'error', msg: 'upload error'}))
          res.end();
          return;
        }
        var obj ={};
        Object.keys(fields).forEach(function(name) {
            console.log('name:' + name+";filed:"+fields[name]);
            obj[name] = fields[name];
        });

        Object.keys(files).forEach(function(name) {
            console.log('name:' + name+";file:"+files[name]);
            obj[name] = files[name];
        });
        res.setHeader('Content-Type','application/json');
        res.write(JSON.stringify({status: 'sucess', data: obj}));
        res.end();
    });
}
```

## 4.4. 静态文件

Similar Server内置了静态文件处理的插件，优先在路由之前渲染。

```js
app.static('assets');
```

static函数参数只有一个，就是静态文件放置的路径。