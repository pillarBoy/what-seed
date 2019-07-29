const exists = require('fs').existsSync
const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs')
const async = require('async')
const chalk = require('chalk')
const evaluate = require('./evaluate.js')

const questions = require('./questions')
const webpackConfig = require('../config.template.js')

const log = console.log 

const destPath = path.resolve(__dirname, '../config.js')
const configPath = path.resolve(__dirname, '../config.template.js')

const webpackConfigContent = fs.readFileSync(configPath, 'utf-8')
const configFileArray = webpackConfigContent.split(/\r?\n/)


const promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

// webpackConfig.isNotTest = true

let data = webpackConfig
module.exports = function ask(questions, data, done){
  async.eachSeries(Object.keys(questions), (key, next) => {
    prompt(data, key, questions[key], next)
  }, done)
}
// ask(questions.prompts, data)

function prompt (data, key, prompt, done) {
  // skip prompts whose when condition is not met
  if (prompt.when && !evaluate(prompt.when, data)) {
    return done()
  }

  let promptDefault = prompt.default
  if (typeof prompt.default === 'function') {
    promptDefault = function () {
      return prompt.default.bind(this)(data)
    }
  }

  inquirer.prompt([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || prompt.label || key,
    default: promptDefault,
    choices: prompt.choices || [],
    validate: prompt.validate || (() => true)
  }]).then(answers => {
    if (Array.isArray(answers[key])) {
      data[key] = {}
      answers[key].forEach(multiChoiceAnswer => {
        data[key][multiChoiceAnswer] = true
      })
    } else if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"')
    } else {
      data[key] = answers[key]
    }
    done()
  }).catch('',done)
}
/*  function askQuestions(data) {
    inquirer.prompt([{
      type: 'confirm',
      message: !exists(destPath)
      ? 'Generate config in current directory?'
      : 'warning! will rewrite current webpack/config.js. Continue?',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        inquirer.prompt().then( answers => {
          webpackConfig.isMobile = answers.isMobile
            webpackConfig.eslint= answers.eslint
              webpackConfig.i18n = answers.i18n
                log(webpackConfig)
                fs.writeFileSync(destPath, copyExistingComments(webpackConfig, configFileArray),'utf-8')
        })
      }

    }).catch(
      // logger.fatal
      )
  }
*/
