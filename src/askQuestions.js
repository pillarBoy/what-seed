const inquirer = require('inquirer')
const path = require('path')
const exists = require('fs').existsSync
const questions = require('./questions')

const destPath = path.resolve(__dirname, 'webpack/config.js')


inquirer.prompt([{
  type: 'confirm',
  message: !exists(destPath)
    ? 'Generate config in current directory?'
    : 'warning! will rewrite current webpack/config.js. Continue?',
  name: 'ok'
}]).then(answers => {
  if (answers.ok) {
    inquirer.prompt(questions).then( answers => {
//      webpackConfig.isMobile = answers.isMobile
//      webpackConfig.eslint= answers.eslint
//      webpackConfig.i18n = answers.i18n
//      log(webpackConfig)
//      fs.writeFileSync(destPath, copyExistingComments(webpackConfig, configFileArray),'utf-8')
	console.log(answers)
    })
  }

}).catch(
  // logger.fatal
)

