<!-- TOC -->

- [关于similar-server](#关于similar-server)
    - [类似Express容易上手](#类似express容易上手)
    - [采用MVC框架](#采用mvc框架)
    - [命令行工具快速创建项目](#命令行工具快速创建项目)
    - [用一种独特的方式书写路由](#用一种独特的方式书写路由)
    - [区分插件和路由定义](#区分插件和路由定义)
    - [路由匹配规则](#路由匹配规则)
    - [Controller支持自定义方法](#controller支持自定义方法)

<!-- /TOC -->

# 关于similar-server

Node在ES6和ES7时代的Web Server。

similar-server是为了更好的吸纳最新ES语法，以便快速开发node项目。

其特点如下：

- [类似Express容易上手](#类似Express容易上手)
- [采用MVC框架](#采用MVC框架)
- [命令行工具快速创建项目](#命令行工具快速创建项目)
- [用一种独特的方式书写路由](#用一种独特的方式书写路由)
- [区分插件和路由定义](#区分插件和路由定义)
- [路由匹配规则](#路由匹配规则)
- [Controller支持自定义方法](#Controller支持自定义方法)

## 类似Express容易上手

和Express相比，它们具有很相似的书写特点，轻松上手，毫不在话下。

通过如下几句，就可以轻松完成一个简单的项目。

当然，其中路由(router)和静态文件路径定义(static)的实现，需要阅读接下来的文档。

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

## 采用MVC框架

`Similar Server的模版`设计之初就开始采用`MVC框架`，以便让开发人员快速开发项目。

- Model 定义数据类和数据库操作Model
- DAO 通过数据库操作Model获取数据
- Service 调取DAO获取数据，以便解耦
- Controller 调取Service获取数据，渲染View/API
- View 待渲染的静态页面，选用ejs模版作为默认模版引擎

## 命令行工具快速创建项目

similar-server-cli 初始化创建的项目中默认采用MVC框架。

```cmd
similar-server-cli init AwesomeProject
```

## 用一种独特的方式书写路由

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

## 区分插件和路由定义

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

## 路由匹配规则

1. 路由支持正则匹配，能匹配类似`/api/(.+)`的路由。
2. 普通路由解析支持的规则包括：`/home/:id`和`/home/index`。
3. 解析的路由参数，会params传递给路由使用，当然Controller的方法也能拿到params。
4. 路由规则解析的路由参数是标准的数组结构(Array)，其数组项是RegExp的exec方法返回的结果。
5. 普通路由规则解析的参数，包含?后解析的参数加上`:<param>`匹配到的参数，其结构类型为对象结构(Object)。
6. 路由匹配顺序是优先匹配普通路由，其次是匹配正则路由。
7. 推荐采用普通路由匹配规则。

## Controller支持自定义方法

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

export default UserController;
```

假设UserController实例对应的路由为`/user`，则带`Get装饰器`和`RenderAPI装饰器`的自定义方法`Login`，对应的路由为`/user/login`。

注意：`Get装饰器`需要在`RenderAPI装饰器`之前定义。