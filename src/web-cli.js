#! /usr/bin/env node

var path = require('path')
var program = require('commander')
var fs = require('fs-extra');
var chalk = require('chalk');
var vinyl = require('vinyl-fs');
var through = require('through2');
var ver = require('../package.json').version


function createProject() {
  // 获取将要构建的项目根目录
  var proPath = path.resolve(program.create);

  // mkdir 项目文件夹
  fs.ensureDirSync(path.basename(proPath));

  // 获取本地 种子项目 路径
  let proCWD = path.join(__dirname, '../webpack-seed');

  // 把模版文件复制到 新项目下
  vinyl.src(['**/*', '!node_modules/**/*'], { cwd: proCWD, dot: true })
    .pipe(through.obj(function (file, enc, callback) {
      if (!file.stat.isFile()) {
        return callback();
      }
      this.push(file);
      return callback();
    })
    )
    // 将从模版项目 下读取的文件流写入到 新项目文件夹中
    .pipe(vinyl.dest(proPath))
    .on('end', function () {
      // 将node工作目录更改成构建的项目根目录下
      process.chdir(proPath);
      // 创建完成，提示
      console.log(`
        项目创建已完成

        =============================================================== 
          请进入到 你到项目文件夹 ./${chalk.green(program.create)} 
            ${chalk.green('cd ./' + program.create)} 

          然后执行install 
            ${chalk.green('npm install')} 或 ${chalk.green('yarn')} 

          然后执行下面命令启动项目 
            ${chalk.green('npm start')} 或 ${chalk.green('yarn start')} 

        ==============================================================
    `);
    })
    .resume();
}

program
  .version(ver)
  .option('-c --create [name]', 'create', 'create project')
  .on("option:create", function (cmd) {
    console.log(chalk.green('项目正在开始创建....'));
    createProject(cmd.create)
  })
  .parse(process.argv)

