const exists = require('fs').existsSync
const path = require('path')
const fs = require('fs')

const configPath = './config.template.js'

const webpackConfig = require(configPath)

const log = console.log 

const webpackConfigContent = fs.readFileSync(configPath, 'utf-8')
// log(configFileArray)
const data = {
}
// log( copyConfigComment(webpackConfig, webpackConfigContent) )

export function copyConfigComment( srcConfig, srcFileContent){
  const configFileContent = 'module.exports = ' + JSON.stringify(srcConfig ,  (key,value,configFileArray) => appendComments(key,value,srcFileContent) ,2)
  const configFileContentIndent = configFileContent.replace(/: +"(.+?\/\/.+?)",?/g, ': $1' ) 
  return configFileContentIndent
}

function appendComments(key, value, configWithComment){
    // log('key:',key, 'value:', value, configWithComment)
    const configFileArray = configWithComment.split(/\r?\n/)
    if( !!key  ) {
      let commentItem = configFileArray.filter( nitem => {
        // log('nitem:', nitem) ;
        let hasKeyInTemplate = nitem.trim().indexOf(`${key}`) 
	// {a:1} 时为0, {"a":1} 时为1
        return hasKeyInTemplate === 0 || hasKeyInTemplate === 1 
      })
      // log(' commentItem:', commentItem )
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
