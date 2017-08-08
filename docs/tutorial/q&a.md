<!-- TOC -->

- [常见问题解答](#常见问题解答)
    - [1. Error: listen EADDRINUSE :::3002](#1-error-listen-eaddrinuse-3002)
    - [2. mongodb模版中报错](#2-mongodb模版中报错)
    - [3. mongodb模版中，如果我想更换为其它数据库，不想使用mongodb的话怎么处理呐？](#3-mongodb模版中如果我想更换为其它数据库不想使用mongodb的话怎么处理呐)

<!-- /TOC -->
# 常见问题解答

## 1. Error: listen EADDRINUSE :::3002

答：此类情况多半是端口被占用造成的，请查询端口占用情况停掉当前占用端口的进程，或者另外独立启动一个未被占用的端口。

如果你是mac或linux可以参考如下命令查询端口占用情况并停掉占用端口的进程。

```shell
lsof -i tcp:<port>
kill -9 <pid>
```
## 2. mongodb模版中报错

1. MongoError: failed to connect to server [localhost:27017] on first connect [MongoError: connect ECONNREFUSED 127.0.0.1:27017]

答：此类错误是你未安装mongodb造成的，请安装mongodb。

## 3. mongodb模版中，如果我想更换为其它数据库，不想使用mongodb的话怎么处理呐？

答：不选用mongodb，需要修改dao、model和utils/db.js 这几处代码，对上的services层可以起到解耦合作用。