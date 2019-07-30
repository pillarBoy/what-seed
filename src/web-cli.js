#! /usr/bin/env node

var path = require('path')
var program = require('commander')
var fs = require('fs-extra');
var chalk = require('chalk');
var vinyl = require('vinyl-fs');
var through = require('through2');
var ver = require('../package.json').version
var inquirer = require('inquirer')

var copyExistingComments = require('./copyExistingComments.js')
var ask = require('./lib/askQuestions')
var questions = require('./questions')
var _ = require('lodash')
var getGitUser = require('./lib/git-user.js')

function createProject(opts, projectName) {
  // 获取将要构建的项目根目录
  var proPath = path.resolve(projectName);

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

      file.contents = fileFilter(file, opts)
      this.push(file);
      return callback();
    })
    )
    // 将从模版项目 下读取的文件流写入到 新项目文件夹中
    .pipe(vinyl.dest(proPath))
    .on('end', function () {
      // 将node工作目录更改成构建的项目根目录下
      process.chdir(proPath);

      // 加replace以便一致化
      const opt = opts.filter(item => item.name == '__notFile__butSettings__')[0].replace

      if (opt.autoInstall) {
        var install = require('./lib/install.js')
        install()
      }
      // 创建完成，提示
      if (!opt.autoInstall) {
        console.log(`
        项目创建已完成

        =============================================================== 
          请进入到 你到项目文件夹 ./${chalk.green(projectName)} 
            ${chalk.green('cd ./' + projectName)} 

          然后执行install 
            ${chalk.green('npm install')} 或 ${chalk.green('yarn')} 

          然后执行下面命令启动项目 
            ${chalk.green('npm start')} 或 ${chalk.green('yarn start')} 

        ==============================================================
        `)
      } else {
        console.log(`
        项目创建已完成
        ===============================================================
          请进入到 你到项目文件夹 ./${chalk.green(projectName)}
            ${chalk.green('cd ./' + projectName)}

          开始开发
        ==============================================================
        `)
      }
      ;
    })
    .resume();
}

program
  .version(ver)
  .command('create [name]', 'create', 'create project')
  .on("command:create", function (cmd) {
    let projectName = 'myproject'
    if (cmd) {
      if(!cmd[0])     console.log(chalk.yellow('path not given, using default path \'myproject\''))
      questions.prompts.name.default = cmd[0] || projectName
      checkExist(cmd[0] || projectName)
    } else {
      questions.prompts.name.default = cmd[0]  || projectName
      checkExist(projectName)
    }
  })
  .parse(process.argv)

// 查看当前文件中是否存在和要创建的项目同名的文件夹, from vue-init
function checkExist(projectName) {
  const to = path.resolve(projectName || '.')
  const inPlace = !projectName || projectName === '.'
  if (fs.existsSync(to)) {
    inquirer.prompt([{
      type: 'confirm',
      message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        promptForMeta(projectName)
      }
    }).catch(e => console.log(e))
  } else {
    promptForMeta(projectName)
  }
}

// 问'./questions'中定义的问题, 并将问题转化为fileFilter可接受的对象
function promptForMeta(projectName) {
  let data = { isNotTest: true }
  questions.prompts.author.default = getGitUser()
  ask(questions.prompts, data, () => {
    const tempJson = _.invertBy(questions.prompts, value => value.inFile)
    const optArray = []
    Object.keys(tempJson).forEach((key) => {
      let getDataValue = function (data) {
        let obj = {}
        tempJson[key].forEach(item => {
          obj[item] = data[item]
        })
        return obj
      }
      optArray.push({
        name: key,
        replace: getDataValue(data),
      })
    })
    // console.log(chalk.green('optArray'),optArray)

    createProject(optArray, projectName)
  })
}

/* file:vinyl的file对象, 
 * opts: 一个由
 * {
   * name:'config.js',
   * replace:{
     * key:value,
     * key2:value2,
     * }
   * }
 * }
 * 构成的对象数组
 */
function fileFilter( file, opts ) {
  let converted = false
  let content
  opts.map(item => {
    if (file.basename === item.name) {
      switch (file.extname) {
        case '.json': content = JSON.parse(file.contents.toString()); break;
        case '.js': content = require(file.path); break;
        default: throw (`unknown file type ${file.basename}`)
      }
      for (key in item.replace) {
        content[key] = item.replace[key]
        converted = true
      }
    }
  })

  if (converted) {
    switch (file.extname) {
      case '.json': return Buffer.from(JSON.stringify(content, null, 2)); break;
      case '.js':
        var templatePath = './config.template.js'
        return Buffer.from(copyExistingComments(content, path.resolve(__dirname,templatePath)))
      // return Buffer.from(`module.exports = {\n` + JSON.stringify( content ,null, 2).replace(/^/mg,'  ') + `\n}`);; break;
      default: throw (`unknown file type ${file.basename}`)
    }
  }
  else {
    return file.contents
  }

}
