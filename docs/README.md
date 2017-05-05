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
    - [4.5. 打印日志](#45-打印日志)
- [5. 常见问题解答](#5-常见问题解答)
    - [5.1. Error: listen EADDRINUSE :::3002](#51-error-listen-eaddrinuse-3002)
    - [5.2. MongoError: failed to connect to server [localhost:27017] on first connect [MongoError: connect ECONNREFUSED 127.0.0.1:27017]](#52-mongoerror-failed-to-connect-to-server-localhost27017-on-first-connect-mongoerror-connect-econnrefused-12700127017)
    - [5.3. 如果我想更换数据库，不想使用mongodb的话怎么处理呐？](#53-如果我想更换数据库不想使用mongodb的话怎么处理呐)

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

- Model 定义数据类和数据库操作Model
- DAO 通过数据库操作Model获取数据
- Service 调取DAO获取数据，以便解耦
- Controller 调取Service获取数据，渲染View/API
- View 待渲染的静态页面，选用ejs模版作为默认模版引擎


## 1.3. 命令行工具快速创建项目

similar-server-cli 初始化创建的项目中默认采用MVC框架。

```cmd
similar-server-cli init AwesomeProject
```

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
app.route('/home/:id', new HomeController());
```

## 1.5. 区分插件和路由定义

Similar Server和Express很大的不同，就在于Similar Server采用的设计，区分插件(`plugin`)和路由(`route`)定义。

1. 插件定义方式如下：

```js
app.plugin((req, res, next)=>{
    /**
    * do something
    */
    /**
    * 必须调用next，否则后续路由将无法调到
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

2. 构建新项目

```cmd
similar-server-cli init AwesomeProject
```

3. 运行server

```cmd
cd AwesomeProject
npm start
```

# 3. 理解Similar Server中的MVC框架

## 3.1. Controller

Controller主要的作用把`数据`渲染到页面或者API上去。

这里以HomeController和UserController中代码为例讲解。

### 3.1.1. HomeController

```js
/** 
* HomeController.js
*/
import Controller from 'similar-server/dist/controller';
import { RenderView } from 'similar-server/dist/view';
import HomeService from '../models/HomeService';

class HomeController extends Controller {
    constructor(props, context) {
        super(props, context);
        this.service = new HomeService();
    }
    
    @RenderView('index.html')
    GET(req, res, next, params) {
        return this.service.getData(params);
    }
}

export default HomeController;
```

首先我们看到的是HomeController中，对于页面的渲染很简单，采用RenderView装饰器即可渲染。

注意：如果需要区分出Service层做解耦，Controller理应调取Service层代码。

```js
@RenderView(path, engine, options)
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
import UserService from '../services/UserService';

class UserController extends Controller {
    constructor() {
        this.services = new UserService();
    }
    @RenderAPI()
    GET(req, res, next, params) {
        const model = this.services.queryUser(params.id);
        return model;
    }
}

export default UserController;
```

UserController GET方法仅仅渲染了一个API，和渲染View不同的是`RenderView`装饰器更换为了`RenderAPI`装饰器。

RenderAPI不用传递任何参数。

当然，GET方法返回的结果仍然没有变化，返回`Model`或者`Promise`。

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

如果是要获取数据库中的数据，则需要和数据库驱动器打交道，当然涉及和数据库驱动器打交道的，我们会放置到DAO层。

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
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    createDate: String, 
    modifyDate: String,
})

export default mongoose.model('User', UserSchema);
/** 
* UserDAO.js
*/
import Model from 'similar-server/dist/model';
import ResultModel from './ResultModel';
import UserModel from '../models/UserModel';

class UserDAO {
    async save(data) {
        const user = new UserModel(data);
        const result = new ResultModel();
        try{
            const response = await user.save();
            result.Data = response;
            result.Status = 'success';
        } catch(e) {
            result.Msg = e.message;
            result.Status = 'error';
        }
        return result;
    }
    async queryUser(id) {
        const result = new ResultModel();
        try{
            const response = await UserModel.findById(id).exec();
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

/** 
* UserService.js
*/
import UserDAO from '../dao/UserDAO';

class UserService {
    constructor() {
        this.dao = new UserDAO();
    }
    queryUser(id) {
        return this.dao.queryUser(id);
    }
    createUser(data) {
        return this.dao.save(data);
    }
}
```

UserDAO中实现了所有需要对外的操作，这里包括save和queryUser，其中queryUser为静态方法，save为实例方法。

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

## 4.5. 打印日志

打印日志操作可以使用log4js模块来实现特定功能：

```js
import log4js from 'log4js';

log4js.configure({
 appenders: [
    {
        type: 'DateFile',
        filename: 'acess',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        category: 'access'
    }]
});

app.plugins(log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO }));
```

关于模块log4js的详细信息，请参考[https://github.com/nomiddlename/log4js-node](https://github.com/nomiddlename/log4js-node)

# 5. 常见问题解答

## 5.1. Error: listen EADDRINUSE :::3002

答：此类情况多半是端口被占用造成的，请查询端口占用情况停掉当前占用端口的进程，或者另外独立启动一个未被占用的端口。

如果你是mac或linux可以参考如下命令查询端口占用情况并停掉占用端口的进程。

```shell
lsof -i tcp:<port>
kill -9 <pid>
```
## 5.2. MongoError: failed to connect to server [localhost:27017] on first connect [MongoError: connect ECONNREFUSED 127.0.0.1:27017]

答：此类错误是你未安装mongodb造成的，请安装mongodb。

## 5.3. 如果我想更换数据库，不想使用mongodb的话怎么处理呐？

答：不选用mongodb，需要修改dao、model和utils/db.js 这几处代码，对上的services层可以起到解耦合作用。
