#! /usr/bin/env node

var path = require('path')
var program = require('commander')
var fs = require('fs-extra')
var chalk = require('chalk')
var ver = require('../package.json').version
var inquirer = require('inquirer')

var copyExistingComments = require('./copyExistingComments.js')
var questions = require('./questions')
var getGitUser = require('./lib/git-user.js')
var promptForMeta = require('./promptForMeta')
var createProject = require('./create_project')


// 获取本地 种子项目 路径
const seedPath = path.join(__dirname, '../webpack-seed')


program
  .version(ver)
  .command('create [name]', 'create', 'create project')
  .on("command:create", function (cmd) {

    let projectName = cmd[0] || 'myproject'
    questions.prompts.name.default = projectName
    questions.prompts.author.default = getGitUser()
    if(!cmd[0]) {
      console.log(chalk.yellow('path not given, using default path \'myproject\''))
     }
    startCreate(projectName, questions, seedPath)

  })
  .parse(process.argv)

async function startCreate (projectName, questions, seedPath) {
  let ok = await checkExist(projectName)
  if (!!ok) {
    let opts = await promptForMeta(projectName, questions)
      console.log(seedPath)
    createProject(projectName, opts, seedPath)
  }
}

// 查看当前文件中是否存在和要创建的项目同名的文件夹, from vue-init
function checkExist(projectName) {
  return new Promise( (resolve,reject) => {
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
          return resolve(answers.ok)
        }
        else {
          return resolve(false)
        }
      }).catch(e => console.log(e))
    } else {
      return resolve (true)
    }
  })
}

// for test
module.export = startCreate
