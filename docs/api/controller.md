<!-- TOC -->

- [Controller](#controller)
    - [类方法列表](#类方法列表)
            - [`Controller.GET(req, res, next, params)`](#controllergetreq-res-next-params)
            - [`Controller.POST(req, res, next, params)`](#controllerpostreq-res-next-params)
            - [`Controller.PUT(req, res, next, params)`](#controllerputreq-res-next-params)
            - [`Controller.DELETE(req, res, next, params)`](#controllerdeletereq-res-next-params)

<!-- /TOC -->

# Controller

可供继承的类，已实现加入到路由的处理实例。

继承类书写方式如下：

```js
class HomeController extends Controller {
    GET() {
        return new Model();
    }
}
```

Controller中默认含有`GET`,`POST`,`PUT`,`DELETE`等方法，需要覆盖这些方法，才能访问到（代码中未覆盖实现，则默认调用`next()`忽略）。

具体继承类使用方式如下：

```js
Router('/',[
    Route('home', new HomeController()),
]);
```

可以看到，使用时，需要以实例的方式调用。

## 类方法列表

#### `Controller.GET(req, res, next, params)`

- `req` http request对象
- `res` http response对象
- `next` 进入下一个中间件的方法
- `params` 路由中`?`问号后的参数

#### `Controller.POST(req, res, next, params)`

略，参数同GET。

#### `Controller.PUT(req, res, next, params)`

略，参数同GET。

#### `Controller.DELETE(req, res, next, params)`

略，参数同GET。
