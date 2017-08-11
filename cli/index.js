#!/usr/bin/env node
const prog = require('caporal');
const prompt = require('prompt');
const os = require('os');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const packJSON =  require('../package.json');

const installCommand = require('./install');
const deployCommand = require('./deploy');

prog
  .version(packJSON.version)
  .description('A similar http server')
  .command('init', 'Create new project') 
  .argument('<path>', 'Path to create')
  .option('-t,--template <template>', 'Type of template', /^default|mongodb|postgresql|mysql|markdown|websocket$/) 
  .option('-y,--yes <yes>', 'don\'t comfirm to create after', prog.BOOL, false, false)
  .action(function(args, options, logger) {
    const name = args.path;
    const template = options.template || 'default';
    const yes = options.yes;
    logger.info(name);
    // 克隆线上的代码到新创建的目录下
    installCommand.validateProjectName(name);
    if (!yes && fs.existsSync(name)) {
        installCommand.createAfterConfirmation(name, template, options);
    } else {
        installCommand.createProject(name, template, options);
    }
  })
  .command('deploy', 'Deploy the code')
  .argument('<server>', 'Git server')
  .argument('<path>', 'Path to deploy')
  .option('-t,--tool <tool>', 'Start up tool', /^pm2$/)
  .option('-y,--yes <yes>', 'don\'t comfirm to create after', prog.BOOL, false, false)
  .action(function(args, options, logger) {
    const name = args.path;
    const server = args.server;
    const tool = options.tool || 'pm2';
    const yes = options.yes;
    logger.info(name);
    // 克隆线上的代码到新创建的目录下
    deployCommand.validateProjectName(name);
    if (!yes && fs.existsSync(name)) {
        deployCommand.deployAfterConfirmation(server, name, tool, options);
    } else {
        deployCommand.deployProject(server, name, tool, options);
    }
  });

prog.parse(process.argv);