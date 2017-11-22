<!-- TOC -->

- [常用场景介绍](#常用场景介绍)
    - [1. Session](#1-session)
    - [2. Cookie](#2-cookie)
    - [3. 上传下载文件](#3-上传下载文件)
        - [3.1 文件下载](#31-文件下载)
        - [3.2 文件上传](#32-文件上传)
    - [4. 静态文件](#4-静态文件)
    - [5. 打印日志](#5-打印日志)
    - [6. 代理服务](#6-代理服务)
    - [7. 验证码](#7-验证码)
    - [8. 发送邮件](#8-发送邮件)

<!-- /TOC -->

# 常用场景介绍

## 1. Session

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

## 2. Cookie

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

## 3. 上传下载文件

### 3.1 文件下载

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

### 3.2 文件上传

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

## 4. 静态文件

Similar Server内置了静态文件处理的插件，优先在路由之前渲染。

```js
app.static('assets');
```

static函数参数只有一个，就是静态文件放置的路径。

## 5. 打印日志

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

## 6. 代理服务

默认提供了`http-proxy`代理服务，具体使用方式为：

大部分代理参数参考：https://github.com/nodejitsu/node-http-proxy#options
pathRewrite代理参数参考：https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options

```js
// http proxy
app.proxy('/api/v1/(.+)', {
    target: 'http://api.example.com',
    pathRewrite: {
        '/v1': ''
    },
    changeOrigin: true
})
// https proxy
const privateKey  = fs.readFileSync(path.resolve(process.cwd(), '214343096180428.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(process.cwd(), '214343096180428.pem'), 'utf8');
const credentials = {key: privateKey, cert: certificate};
app.proxy('/api/v2/(.+)', {
    target: 'https://api.v2.example.com',
    ssl: credentials,
    pathRewrite: {
        '/v2': ''
    },
    changeOrigin: true
})
```

以`/api/v1/`打头的路由，都会代理到`http://api.example.com`。
以`/api/v2/`打头的路由，都会代理到`https://api.v2.example.com`。

## 7. 验证码

获取验证码并将文本放置到session中。我们使用到第三方的验证码生产库`svg-captcha`。

实现方式如下：

```js
var svgCaptcha = require('svg-captcha');

app.route('/captcha', function (req, res) {
	var captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;
	
	res.setHeader('Content-Type', 'image/svg+xml');
    res.write(captcha.data);
    res.end();
});
```

注意：当然`session`需要用到之前讲解的方式添加支持，才可以使用。


## 8. 发送邮件

参见[nodemailer](https://nodemailer.com/about/)

```js
'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 25,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'username@example.com',
        pass: 'password'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"username" <username@example.com>', // sender address
    to: 'username2@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
```
