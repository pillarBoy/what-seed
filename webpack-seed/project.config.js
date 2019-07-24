const exists = require('fs').existsSync
const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs')
const webpackConfig = require('./webpack/config.template.js')

const log = console.log 

const destPath = path.resolve(__dirname, 'webpack/config.js')
const configPath = path.resolve(__dirname, 'webpack/config.template.js')


const webpackConfigContent = fs.readFileSync(configPath, 'utf-8')
const configFileArray = webpackConfigContent.split(/\r?\n/)
// log(configFileArray)

// 遍历config 对于config.template.js中有注释的条目，为之加上注释
function copyExistingComments(newConfig, configWithComment){
  const configFileContent = 'module.exports = ' + JSON.stringify(webpackConfig, appendComments,2)
  // log('configFileContent',configFileContent,typeof configFileContent)

  // 在template文件中搜索key 对应的'//'标记的注释, 如果有，则加到后面
  function appendComments(key, value){
    log('key:',key)
    if( !!key  ) {
      let commentItem = configWithComment.filter( nitem => {
        log('nitem:',nitem) ;
        let hasKeyInTemplate = nitem.trim().indexOf(`${key}`) 
        return hasKeyInTemplate === 0 || hasKeyInTemplate === 1 
      })

      log(' commentItem:', commentItem)
      if( commentItem.length > 1) {
        throw 'error, repeated key'
      }
    
      if(!!commentItem && !!commentItem[0]){
        let commentContent = (commentItem[0].split('//'))[1]
        if(!!commentContent) {
          return value + `, // ${commentContent.trim()}`
        }
      }
    }
    return value
  }
  const configFileContentUltimate = configFileContent.replace(/: +"(.+?\/\/.+?)",?/g, ': $1' ) 
    // log(configFileContent.split(/\r?\n/))
    log(configFileContentUltimate)
  return configFileContentUltimate
}

inquirer.prompt([{
  type: 'confirm',
  message: !exists(destPath)
    ? 'Generate config in current directory?'
    : 'warning! will rewrite current webpack/config.js. Continue?',
  name: 'ok'
}]).then(answers => {
  if (answers.ok) {
    inquirer.prompt([{
      type: 'confirm',
      message: 'is it a mobile web project',
      name: 'isMobile',
      default: true
    },
    {
      type: 'confirm',
      message: 'support international language?',
      name: 'i18n',
      default: false
    },
    {
      type: 'confirm',
      message: 'Use ESLint to lint your code?',
      name: 'eslint',
      default: false
    }

    ]).then( answers => {
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
