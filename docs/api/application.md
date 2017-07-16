# Application

主要控制相关插件和路由的加载，整个项目的启动。

注意：similar-server是区分路由和插件的，其对应express中的中间件，具体详见[区分插件和路由定义](../tutorial/about.md#区分插件和路由定义)。

## 构建项目单例

```js
const app = Application();
```

通过调用`Application()`获取到项目单例，以下讲解所有单例相关的方法。

## 单例方法列表

app 对象拥有以下的方法：

#### `app.router(router)`

- router 定义的根路由

定义由Router声明的路由集合。

#### `app.route(path,handle)`

- path 路由路径
- handle 处理函数

    处理函数，实现如下：

    (req, res, next, params)=>{ /*do something*/ next();}

定义由Route声明的路由集合。

#### `app.use(plugin)`

- plugin 插件函数

    插件函数，类似处理函数：

    (req, res, next, params)=>{ /*do something*/ next();}

添加插件。

#### `app.plugin(plugin)`

- plugin 插件函数

    插件函数，类似处理函数：

    (req, res, next, params)=>{ /*do something*/ next();}

添加插件。

#### `app.proxy(url)`

- url 代理路径

添加代理。

#### `app.static(path)`

- path 静态文件路径

#### `app.init()`

初始化项目，务必在listen之前调用。

#### `app.listen(port)`

- port 端口

监听端口并启动项目。










