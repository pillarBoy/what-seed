var fs = require('fs-extra')
var path = require('path')
var vinyl = require('vinyl-fs')
var chalk = require('chalk')
var through = require('through2')
const copyExistingComments = require('./copyExistingComments.js')

module.exports = function createProject(projectName, opts, seedPath) {
  return new Promise( (resolve,reject) =>{
  // 获取将要构建的项目根目录
  var proPath = path.resolve(projectName)

  // mkdir 项目文件夹
  fs.ensureDirSync(path.basename(proPath))

  if(!seedPath) console.warn(`seedPath not defined, copying current path`)
  // 把模版文件复制到 新项目下
  vinyl.src(['**/*', '!node_modules/**/*'], { cwd: seedPath, dot: true })
    .pipe(through.obj(function (file, enc, callback) {

      if (!file.stat.isFile()) {
        return callback()
      }

      file.contents = fileInterceptor(file, opts)
      this.push(file)
      return callback()
    })
    )
    // 将从模版项目 下读取的文件流写入到 新项目文件夹中
    .pipe(vinyl.dest(proPath))
    .on('end', function () {
      // 将node工作目录更改成构建的项目根目录下
      process.chdir(proPath)

      let settings = opts['__notFile__butSettings__']

      // 创建完成，提示
      if (settings && settings.autoInstall) {
        var install = require('./lib/install.js')
        install()

        console.log(`
        项目创建已完成
        ===============================================================
          请进入到 你到项目文件夹 ./${chalk.green(projectName)}
            ${chalk.green('cd ./' + projectName)}

          执行 ${chalk.green('npm start')} 或 ${chalk.green('yarn start')} 

          开始开发
        ==============================================================
        `)
      } else {
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
      }
    })
    .resume()

    resolve(true)
  })

}


/* 文件内容处理器
 * file:vinyl的file对象,
 * opts: 一个由
 * {
   * 'package.json':{
     * key:value,
     * key2:value2,
     * },
   * 'config.js':{
     * key3:value3
     * }
 * }
 * 构成的对象数组
 * 输出 file.content
 */

function fileInterceptor( file, opts ) {
  let converted = false
  let content
    if (opts.hasOwnProperty( file.basename ) ) {
      let item = opts[file.basename]
      switch (file.basename) {
        case 'package.json': {
          content = JSON.parse(file.contents.toString())
          break
        }
        case 'config.js': {
          content = require(file.path)
          break
        } 
        default: 
          throw (`unknown file type ${file.basename}`)
      }
      for (key in item) {
        content[key] = item[key]
        converted = true
      }
    }
  if (converted) {
    switch (file.basename) {
      case 'package.json': return Buffer.from(JSON.stringify(content, null, 2)); break;
      case 'config.js':
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

// var child_process = require('child_process')
// 
// module.exports = function create(project_name) {
//   child_process.spawnSync('mkdir', [project_name])
//   child_process.spawn('node', ['/gitdown_seed.js'], {cwd: `${__dirname}/${project_name}`})
//     .on('close', function () {
//       console.log('项目初始化完成。');
//     })
// }
