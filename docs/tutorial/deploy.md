# 发布项目

## 手动发布

1. webpack打包发布

开发环境的开发用到了babel，所有我们需要打包部署，这里优先选择的工具为webpack。

你仅仅需要执行`webpack`命令，即可打包。

打包好的文件会自动放置`/bin/www`。

注意：打包之前，你需要对生产环境做相应的配置修改，这里就不在赘述。

2. 执行生产环境

运行 `node /bin/www` 或者`pm2 start /bin/www`，即可运行生产环境下的web应用。

## 命令行发布

1. 发布要求

发布之前，需要全局安装pm2

    npm install -g pm2

2. 执行发布

    similar-server-cli deploy https://github.com/<user-name>/<project-name>.git <deploy-name> -y

注意：自版本0.4.1开始，具有发布功能。