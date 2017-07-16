# View

View中包含了很多使用的方法，具体方法列表如下：

## `RenderAPI()`

RenderAPI方法为一个`类方法装饰器`，具体使用方法是给Controller中的方法规定接口渲染方式。

RenderAPI默认返回的数据格式`application/json`。


具体使用方式参照如下：

```js

class ResultModel extends Model {
    constructor(status, msg, data) {
        super();
        this.data = { status, msg, data };
    }
}

class UserController extends Controller {
    @RenderAPI()
    GET(req, res, next, params) {
        return new ResultModel(status, msg, data);
    }
}
```

## `RenderView(view, engine, options = {})`

- `view` 在`views`目录下的html路径。
- `engine` 模版渲染引擎。
- `options` 引擎参数。

RenderView方法为一个类方法装饰器，将特定文件对应到特定Controller，并通过模版引擎渲染。

假设views目录下包含index.html文件。

使用RenderView装饰器的方式如下：


```js
class HomeController extends Controller {
    @RenderView('index.html')
    GET(req, res, next, params) {
        return new ResultModel(status, msg, data);
    }
}
```

## Get(path)

- path 特定路径

`Get`方法为一个类方法装饰器，改写Controller中实现的自定义方法，使其使用get方法能调用到。

```js
class UserController extends Controller {
    @Get('signup')
    @RenderView('user/signup.html')
    SignupView(req, res, next, params) {
        return new ResultModel(status, msg, data);
    }
}
```

假设UserController实例，能被`/user`调取到，则`SignupView`方法能被`/user/signup`调取到，且能渲染页面。

## POST(path)

- path 特定路径

`Post`方法为一个类方法装饰器，改写Controller中实现的自定义方法，使其使用post方法能调用到。

```js
class UserController extends Controller {
    @Post('signup')
    @RenderAPI()
    SignupAPI(req, res, next, params) {
        return new ResultModel(status, msg, data);
    }
}
```

假设UserController实例，能被`/user`调取到，则`SignupAPI`方法能被`/user/signup`调取到，且能渲染API。


## Put(path)

略，同Get和Post。

## Delete(path)

略，同Get和Post。