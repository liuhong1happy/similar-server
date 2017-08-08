<!-- TOC -->

- [理解Similar Server中的MVC框架](#理解similar-server中的mvc框架)
    - [1. Controller](#1-controller)
        - [1.1. HomeController](#11-homecontroller)
        - [1.2. UserController](#12-usercontroller)
    - [2. Model](#2-model)
        - [2.1. 自定义数据](#21-自定义数据)
        - [2.2. 数据库中的数据](#22-数据库中的数据)
    - [3. View](#3-view)

<!-- /TOC -->
# 理解Similar Server中的MVC框架

## 1. Controller

Controller主要的作用把`数据`渲染到页面(View)或者接口(Api)上去。

这里以HomeController和UserController中代码为例讲解。

### 1.1. HomeController

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

### 1.2. UserController

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

## 2. Model

Model主要是把`数据库中的数据`，或者`自定义的数据`给Controller层调用。

### 2.1. 自定义数据

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

### 2.2. 数据库中的数据

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

## 3. View

View主要是静态文件集合。

RenderView装饰器中，已经对模版引擎进行了定义，那么，View中静态文件书写规则要依照模版引擎来书写。
