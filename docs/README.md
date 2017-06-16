**目录**

<!-- TOC -->

- [1. Similar Server](#1-similar-server)
    - [1.1. 类似Express容易上手](#11-类似express容易上手)
    - [1.2. 采用MVC框架](#12-采用mvc框架)
    - [1.3. 命令行工具快速创建项目](#13-命令行工具快速创建项目)
    - [1.4. 用一种独特的方式书写路由](#14-用一种独特的方式书写路由)
    - [1.5. 区分插件和路由定义](#15-区分插件和路由定义)
    - [1.6. 关于路由匹配规则](#16-关于路由匹配规则)
    - [1.7 Controller支持自定义方法](#17-controller支持自定义方法)
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
    - [4.6 代理服务](#46-代理服务)
- [5. 常见问题解答](#5-常见问题解答)
    - [5.1. Error: listen EADDRINUSE :::3002](#51-error-listen-eaddrinuse-3002)
    - [5.2. mongodb模版中报错](#52-mongodb模版中报错)
    - [5.3. mongodb模版中，如果我想更换为其它数据库，不想使用mongodb的话怎么处理呐？](#53-mongodb模版中如果我想更换为其它数据库不想使用mongodb的话怎么处理呐)
- [6. 发布项目](#6-发布项目)
    - [手动发布](#手动发布)
    - [命令行发布](#命令行发布)

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

`Similar Server的模版`设计之初就开始采用`MVC框架`，以便让开发人员快速开发项目。

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

3. 其它方法定义归属类别

    1. app.proxy 路由
    2. app.static 插件
    3. app.use 插件 (同app.plugins)
    4. app.router 插件+路由 (会通过app.init方法解析出对应的插件和路由)

## 1.6. 关于路由匹配规则

1. 路由支持正则匹配，能匹配类似`/api/(.+)`的路由。
2. 普通路由解析支持的规则包括：`/home/:id`和`/home/index`。
3. 解析的路由参数，会params传递给路由使用，当然Controller的方法也能拿到params。
4. 路由规则解析的路由参数是标准的数组结构(Array)，其数组项是RegExp的exec方法返回的结果。
5. 普通路由规则解析的参数，包含?后解析的参数加上`:<param>`匹配到的参数，其结构类型为对象结构(Object)。
6. 路由匹配顺序是优先匹配普通路由，其次是匹配正则路由。
7. 推荐采用普通路由匹配规则。

## 1.7 Controller支持自定义方法

Controller中除POST、GET、PUT、DELETE方法外，也可以支持自定义方法的实现，自定义方法对应特定路由和method。具体实现方式如下

```js
//...
class UserController extends Controller {
    //...
    @Get('login')
    @RenderAPI()
    Login(req, res, next, params) {
        const model = services.queryUser(params.id);
        return model;
    }
    //...
}

假设UserController实例对应的路由为`/user`，则带`Get装饰器`和`RenderAPI装饰器`的自定义方法`Login`，对应的路由为`/user/login`。

注意：`Get装饰器`需要在`RenderAPI装饰器`之前定义。

export default UserController;
```


# 2. 快速开始

1. 全局安装Similar Server

```cmd
npm install -g similar-server 
```

2. 构建新项目

```cmd
similar-server-cli init AwesomeProject
```

注意：从0.3.0版本开始，默认初始化`默认模版（default）`，如果需要初始化`mongodb模版（mongodb）`，需要在命令行中加入参数 `-t mongodb`，后续文档讲解以`mongodb模版（mongodb）`为例讲解为主。

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
import HomeService from '../services/HomeService';

const service = new HomeService();

class HomeController extends Controller {
    @RenderView('index.html')
    GET(req, res, next, params) {
        return service.getData(params);
    }
}

export default HomeController;
```

首先我们看到的是HomeController中，对于页面的渲染很简单，采用`RenderView装饰器`即可渲染。

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

const services = new UserService();

class UserController extends Controller {
    @RenderAPI()
    GET(req, res, next, params) {
        const model = services.queryUser(params.id);
        return model;
    }
}

export default UserController;
```

UserController GET方法仅仅渲染了一个API，和渲染View不同的是`RenderView装饰器`更换为了`RenderAPI装饰器`。

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

当然，你不用操心处理Promise的问题，`RenderAPI装饰器`中可以对`Promise`进行处理。

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

## 4.6 代理服务

默认提供了`http-proxy`代理服务，具体使用方式为：

```js
// http proxy
app.proxy('/api/(.+)', {target: 'http://api.example.com'})
```

以`/api/`打头的路由，都会代理到`http://api.example.com`。

# 5. 常见问题解答

## 5.1. Error: listen EADDRINUSE :::3002

答：此类情况多半是端口被占用造成的，请查询端口占用情况停掉当前占用端口的进程，或者另外独立启动一个未被占用的端口。

如果你是mac或linux可以参考如下命令查询端口占用情况并停掉占用端口的进程。

```shell
lsof -i tcp:<port>
kill -9 <pid>
```
## 5.2. mongodb模版中报错

1. MongoError: failed to connect to server [localhost:27017] on first connect [MongoError: connect ECONNREFUSED 127.0.0.1:27017]

答：此类错误是你未安装mongodb造成的，请安装mongodb。

## 5.3. mongodb模版中，如果我想更换为其它数据库，不想使用mongodb的话怎么处理呐？

答：不选用mongodb，需要修改dao、model和utils/db.js 这几处代码，对上的services层可以起到解耦合作用。

# 6. 发布项目

## 手动发布

1. webpack打包发布

开发环境的开发用到了babel，所有我们需要打包部署，这里优先选择的工具为webpack。

你仅仅需要执行`webpack`命令，即可打包。

打包好的文件会自动放置`/bin/www`。

注意：打包之前，你需要对生产环境做相应的配置修改，这里就不在赘述。

2. 执行生产环境

运行 `node /bin/www` 或者`pm2 start /bin/www`，即可运行生产环境下的web应用。

## 命令行发布

1. 发布要求

发布之前，需要全局安装pm2

    npm install -g pm2

2. 执行发布

    similar-server-cli deploy https://github.com/<user-name>/<project-name>.git <deploy-name> -y

注意：自版本0.4.1开始，具有发布功能。
