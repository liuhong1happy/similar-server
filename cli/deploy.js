const prog = require('caporal');
const prompt = require('prompt');
const os = require('os');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const packJSON =  require('../package.json');

const validateProjectName = function (name) {
  if (!String(name).match(/^[$A-Z_\-][0-9A-Z_\-$]*$/i)) {
    console.error(
      '"%s" is not a valid name for a project. Please use a valid identifier ' +
        'name (alphanumeric).',
      name
    );
    process.exit(1);
  }

  if (name === 'similar-server') {
    console.error(
      '"%s" is not a valid name for a project. Please do not use the ' +
        'reserved word "similar-server".',
      name
    );
    process.exit(1);
  }
}

const deployAfterConfirmation = function (server, name, tool, options) {
  prompt.start();

  var property = {
    name: 'yesno',
    message: 'Directory ' + name + ' already exists. Continue?',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'no'
  };

  prompt.get(property, function (err, result) {
    if (result.yesno[0] === 'y') {
      deployProject(server, name, tool, options);
    } else {
      console.log('Project initialization canceled');
      process.exit();
    }
  });
}

const deployProject = function (server, name, tool, options) {
  const curPath = path.resolve(__dirname);
  const tmpPath = os.tmpdir();
  const root = path.resolve(name);
  const tmpRoot = path.resolve(`${tmpPath}/${encodeURIComponent(server)}`, name);
  const projectName = path.basename(root);

  console.log(
    'This will walk you through creating a new Similar Server project in',
    root,
    '\n'
  );

  const clone = function() {
    process.chdir(tmpPath);
    const cloneCommand = `git clone ${server} ${tmpRoot}`;
    try{
      execSync(cloneCommand, {stdio: 'inherit'});
      console.error('Command `' + cloneCommand + '` exec.');
    } catch(err) {
      console.error(err);
      console.error('Command `' + cloneCommand + '` failed.');
      process.exit(1);
    }
  }

  const copy = function() {
    process.chdir(curPath);
    const copyCommand =  `cp -rf ${tmpRoot}/. ${root}`;
    try {
        execSync(copyCommand, {stdio: 'inherit'});
        console.error('Command `' + copyCommand + '` exec.');
    } catch(err) {
      console.error(err);
      console.error('Command `' + copyCommand + '` failed.');
      process.exit(1);
    }
  }

  const deploy = function() {
    const script = {
        "name"        : name,  // 应用名称
        "script"      : "./bin/www",  // 实际启动脚本
        "cwd"         : "./",  // 当前工作路径
        "watch": [  // 监控变化的目录，一旦变化，自动重启
            "bin",
        ],
        "exec_mode" : "cluster",
        "instances": 0,
        "ignore_watch" : [  // 从监控目录中排除
            "node_modules", 
            "logs",
            "public"
        ],
        "watch_options": {
            "followSymlinks": false
        },
        "error_file" : "./logs/app-err.log",  // 错误日志路径
        "out_file"   : "./logs/app-out.log",  // 普通日志路径
        "env": {
            "NODE_ENV": "production"  // 环境参数，当前指定为生产环境
        }
    };
    fs.writeFileSync(path.join(root, 'app.json'), JSON.stringify(script));
    process.chdir(root);
    const deployCommand = 'npm install && webpack && pm2 delete ' + name + '&& pm2 start app.json';
    try {
        execSync(deployCommand, {stdio: 'inherit'});
        console.error('Command `' + deployCommand + '` exec.');
    } catch(err) {
      console.error(err);
      console.error('Command `' + deployCommand + '` failed.');
      process.exit(1);
    }
  }

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }
  if (!fs.existsSync(tmpRoot)) {
    clone();  
  } 
  copy();
  deploy();
}

module.exports = {
    validateProjectName: validateProjectName,
    deployAfterConfirmation: deployAfterConfirmation,
    deployProject: deployProject
}