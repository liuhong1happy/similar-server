#!/usr/bin/env node
const prog = require('caporal');
const prompt = require('prompt');
const os = require('os');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

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
const createAfterConfirmation = function (name, options) {
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
      createProject(name, options);
    } else {
      console.log('Project initialization canceled');
      process.exit();
    }
  });
}

const createProject = function (name, options) {
  const curPath = path.resolve(__dirname);
  const tmpPath = os.tmpdir();
  const root = path.resolve(name);
  const tmpRoot = path.resolve(tmpPath, name);
  const tmplPath = path.resolve(tmpRoot, 'template');
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
    } catch(err) {
      console.error(err);
      console.error('Command `' + cloneCommand + '` failed.');
      process.exit(1);
    }
  }

  const copy = function() {
    process.chdir(curPath);
    const copyCommand =  `cp -rf ${tmplPath}/. ${root}`;
    try {
        execSync(copyCommand, {stdio: 'inherit'});
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
        start: 'node index.js',
      },
    };
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson));
    process.chdir(root);
    const installCommand =  'npm install && npm install --save similar-server';
    try {
        execSync(installCommand, {stdio: 'inherit'});
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

prog
  .version('1.0.0')
  .description('A similar http server')
  .argument('<path>', 'Path to create')
  .action(function(args, options, logger) {
    const name = args.path;
    logger.info(name);
    // 克隆线上的代码到新创建的目录下
    validateProjectName(name);
    if (fs.existsSync(name)) {
        createAfterConfirmation(name, options);
    } else {
        createProject(name, options);
    }
  });

prog.parse(process.argv);