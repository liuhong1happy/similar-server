# 快速开始

1. 全局安装Similar Server

```cmd
npm install -g similar-server 
```

2. 构建新项目

```cmd
similar-server-cli init AwesomeProject
```

注意：从0.3.0版本开始，默认初始化`默认模版（default）`，如果需要初始化`mongodb模版（mongodb）`，需要在命令行中加入参数 `-t mongodb`，后续文档讲解以`mongodb模版（mongodb）`为例讲解为主。

3. 运行server

```cmd
cd AwesomeProject
npm start
```