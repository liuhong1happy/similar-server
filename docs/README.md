**目录**

- [Similar Server](#similar-server)
    - [类似Express容易上手](#类似express容易上手)
    - [采用MVC框架](#采用mvc框架)
    - [命令行工具快速创建项目](#命令行工具快速创建项目)
    - [用一种独特的方式书写路由](#用一种独特的方式书写路由)
    - [区分插件和路由定义](#区分插件和路由定义)
    - [关于路由匹配规则](#关于路由匹配规则)

# Similar Server

Node在ES6和ES7时代的Web Server

- [快速开始](SUMMARY.md)

## 类似Express容易上手

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

## 采用MVC框架

Similar Server涉及之初就开始采用MVC框架，以便让开发人员快速开发项目。

- Controller 调用Model渲染View/API
- Model 调用Services获取数据库中数据
- View 选用ejs模版作为默认模版引擎
- Service 调取DBDriver获取数据库中数据

## 命令行工具快速创建项目

similar-server-cli 初始化创建的项目中默认采用MVC框架，数据库对应采用mongodb。

注：如果对创建的模版中的数据库不是很满意的，可以替换掉相应的代码。

相应代码放置如下：

1. 链接数据库 index.js utils/db.js
2. 数据持久化 services/*
3. 调取数据操作 model/*

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
app.Route('/home/:id', new HomeController());
```

## 区分插件和路由定义

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

注意： 路由的书写，不仅仅是这种方式，之前提到的 [用一种独特的方式书写路由](#用一种独特的方式书写路由)

Similar Server一旦有http请求到达，会首先调取`所有插件`,接着调取`匹配到的路由`，执行完放回结果。

如果都没有找到对应的插件和路由，则返回404。

## 关于路由匹配规则

1. 路由暂不支持正则匹配
2. 支持的规则包括：`/home/:id`和`/home/index`
3. 解析的路由参数，会params传递给路由使用，当然Controller的方法也能拿到params。