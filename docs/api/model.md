# Model

可供继承的模型。

简单的继承方式如下：

```js
class HomeModel extends Model {
    constructor(data) {
        super(data);
        this.data.title = "Similar Server";
    }
}
```

以ResultModel为例，继承方式如下：

```js
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
```

Model类中方法包括 `set`,`get`,`getData`,`setData`,实例变量 `this.data`;

ResultModel则完全改写，不再单纯使用实例变量`this.data`，额外开辟了两个变量`this.status`和`this.msg`，通过`getData`方法去获取这三个方法。

具体详细介绍如下：

## 类方法列表

#### `Model.set(key, value)`

- `key` 键
- `value` 值

具体实现是`this.data[key] = value;`。

修改实例变量this.data下键为key的值为value。

#### `Model.get(key)`

- `key` 键

获取实例变量this.data下键为key的值。

#### `Model.getData()`

获取实例变量this.data

#### `Model.setData(data)`

- `data` 新的data

具体实现是`this.data = data;`。

修改实例变量this.data。

## 实例变量列表

#### `this.data`

模型存放数据的变量。