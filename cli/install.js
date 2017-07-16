const prog = require('caporal');
const prompt = require('prompt');
const os = require('os');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const packJSON =  require('../package.json');

const validateProjectName = function (name) {
  if (!String(name).match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
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

const createAfterConfirmation = function (name, template, options) {
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
      createProject(name, template, options);
    } else {
      console.log('Project initialization canceled');
      process.exit();
    }
  });
}

const createProject = function (name, template, options) {
  const curPath = path.resolve(__dirname);
  const tmpPath = os.tmpdir();
  const root = path.resolve(name);
  const tmpRoot = path.resolve(`${tmpPath}/${packJSON.version}`, name);
  const tmplPath = path.resolve(tmpRoot, `template/${template}`);
  const projectName = path.basename(root);

  console.log(
    'This will walk you through creating a new Similar Server project in',
    root,
    '\n'
  );

  const clone = function() {
    process.chdir(tmpPath);
    const cloneCommand = `git clone https://github.com/liuhong1happy/similar-server ${tmpRoot}`;
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
    let copyCommand =  `cp -rf ${tmplPath}/. ${root}`;
    if(process.platform === 'win32') copyCommand = `xcopy ${tmplPath} ${root} /y /s`;
    try {
        execSync(copyCommand, {stdio: 'inherit'});
        console.error('Command `' + copyCommand + '` exec.');
    } catch(err) {
      console.error(err);
      console.error('Command `' + copyCommand + '` failed.');
      process.exit(1);
    }
  }

  const install = function() {
    const packageJson = {
      name: projectName,
      version: '0.0.1',
      private: true,
      scripts: {
        start: 'nodemon index.js --exec babel-node'
      },
      devDependencies: {
        "babel-cli": "^6.24.1",
        "babel-loader": "^7.0.0",
        "babel-plugin-transform-decorators-legacy": "^1.3.4",
        "babel-preset-env": "^1.4.0",
        "babel-preset-power-assert": "^1.0.0",
        "nodemon": "^1.11.0",
        "webpack": "^2.6.0",
        "mime": "^1.3.6"
      },
      dependencies: {
        "babel-polyfill": "^6.23.0",
      }
    };
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson));
    process.chdir(root);
    let installCommand =  'npm install && npm install --save similar-server';
    if(template==='mongodb') installCommand+= ' && npm install --save mongoose';
    if(template==='postgresql') installCommand+= ' && npm install --save sequelize pg pg-hstore pg-native';
    if(template==='mysql') installCommand+= ' && npm install --save sequelize mysql mysql2';
    if(template==='websocket') installCommand+= ' && npm install --save socket.io';
    try {
        execSync(installCommand, {stdio: 'inherit'});
        console.error('Command `' + installCommand + '` exec.');
    } catch(err) {
      console.error(err);
      console.error('Command `' + installCommand + '` failed.');
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
  install();
}

module.exports = {
    validateProjectName: validateProjectName,
    createAfterConfirmation: createAfterConfirmation,
    createProject: createProject
}
