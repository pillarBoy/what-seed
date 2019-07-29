#! /usr/bin/env node

var path = require('path')
var program = require('commander')
var fs = require('fs-extra');
var chalk = require('chalk');
var vinyl = require('vinyl-fs');
var through = require('through2');
var ver = require('../package.json').version

var copyExistingComments = require('./lib/copyExistingComments.js')
var ask = require('./lib/askQuestions')
var questions = require('./lib/questions')
var _=require('lodash')
var evaluate = require('./lib/evaluate.js')

var marker = 0

function createProject(opts) {
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

      // console.log('this', file.contents.toString())

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

      if(opt.autoInstall){
        var install = require('./install.js')
        install()
      }
      // 创建完成，提示
      if( !opt.autoInstall){
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
        `) 
      } else {
        console.log(`
        项目创建已完成
        ===============================================================
          请进入到 你到项目文件夹 ./${chalk.green(program.create)}
            ${chalk.green('cd ./' + program.create)}

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
  .command('-c --create [name]', 'create', 'create project')
  .command('create [name]', 'create', 'create project')
  .on("option:create", function (cmd) {
    console.log(chalk.green('项目正在开始创建....'));
    configure() 
  })
  .on("command:create", function (cmd) {
    console.log(chalk.green('项目正在开始创建....'));
    configure()
  })
  .parse(process.argv)

function configure() {
  // 问问题
  let data = {isNotTest:true}
  ask( questions.prompts, data , () => {
      
    /* 此处的函数目的是从questions中得到一个如下结构的数组，里面的对象name表示要变化的文件，replace表示要变化的条目
    // 可能有 package.json, webpack.config.js, proxy.js, tsconfig.json
    // callback was already called 错误见于此函数体下的语法错误
    let opts =  [
      {
        name: 'package.json',
        replace: {
          name,
          description,
          author
        }
      },
      {
        name: 'config.js',
        replace: {
          isMobile,
          i18n,
          lint
        }
      },
      {
        name: '__notFile__butSettings__',
        replace: {
          autoInstall: data.autoInstall
        }
      }
    ]
    */
    
    const tempJson = _.invertBy( questions.prompts, value => value.inFile)
    const optArray = []

    Object.keys(tempJson).forEach((key)=>{
      let getDataValue = function(data){
        let obj = {}
        tempJson[key].forEach(item => {
          obj[item] = data[item]
        })
        return obj
      }
      optArray.push( {
        name: key,
        replace: getDataValue(data),
      })
    })
    // console.log(chalk.green('optArray'),optArray)

    createProject(optArray)
  })
}

function fileFilter(file, opts){
  let converted = false
  let content
  opts.map( item => {
    if (file.basename === item.name){
      switch(file.extname) {
        case '.json': content = JSON.parse(file.contents.toString()) ; break;
        case '.js': content = require(file.path); break;
        default: throw(`unknown file type ${file.basename}`)
      }
      for ( key in item.replace){
        content[key] = item.replace[key]
          converted = true
      }
    }
  })

  if (converted){
    switch(file.extname) {
        case '.json': return Buffer.from(JSON.stringify(content, null, 2)); break;
        case '.js':
          var templatePath  ='./config.template.js'
          return Buffer.from( copyExistingComments( require(templatePath),fs.readFileSync(path.resolve(__dirname,templatePath), 'utf-8')) )
          // return Buffer.from(`module.exports = {\n` + JSON.stringify( content ,null, 2).replace(/^/mg,'  ') + `\n}`);; break;
        default: throw(`unknown file type ${file.basename}`)
    }

  }
  else {
    return file.contents
  }

}
