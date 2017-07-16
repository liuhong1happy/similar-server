# 路由

路由由Router和Route共同实现。

具体实现方式如下：

```js

Router('/',[
    Route('home', new HomeController()),
    Route('api',[
        Route('user', new UserController())
    ]),
]);
```

这里定义两个路由 `/home`,`/api/user`。

## Router(path, controllerInstance or array)

- `path` 根路由名称，通常为`/`
- `controllerInstance` Controller类实例
- `array` 与`controllerInstanc`二选一，数组可以继续扩展路由成树形结构，数组中的成员为`Route方法`返回的变量。

## Route(path, controllerInstance or array)

- `path` 路由名称，承上启下的名称，不用再包含`/`符号的前缀或者后缀
- `controllerInstance` Controller类实例
- `array` 与`controllerInstanc`二选一，数组可以继续扩展路由成树形结构，数组中的成员为`Route方法`返回的变量。

