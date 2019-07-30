const exists = require('fs').existsSync
const path = require('path')
const fs = require('fs')

const log = console.log

/* 遍历config 对于config.template.js中有注释的条目，为之加上注释
 *  usage: copyExistingComments( path.resolve(__dirname, relativePath ) )
 */

module.exports = function copyExistingComments(absPath){
  const srcConfig = require(absPath)
  const srcFileContent = fs.readFileSync( absPath, 'utf-8' )

  const configFileArray = srcFileContent.split(/\r?\n/)
  const configFileContent = 'module.exports = ' + JSON.stringify(srcConfig, (key, value, srcArray) => appendComments(key, value, configFileArray) ,2)

  // 在template文件中搜索key 对应的'//'标记的注释, 如果有，则加到后面
  // 替换后会造成 a:"1 // some comment" 这样的错误，用正则替换掉双引号
  const configWithIndent = configFileContent.replace(/: +"(.+?\/\/.+?)",?/g, ': $1' ) 
    // log(configFileContent.split(/\r?\n/))
  return configWithIndent
}

function appendComments(key, value, srcArray){
  // log('key:',key)
  if( !!key  ) {
    let commentItem = srcArray.filter( nitem => {
      // log('nitem:',nitem) ;
      let hasKeyInTemplate = nitem.trim().indexOf(`${key}`)
        return hasKeyInTemplate === 0 || hasKeyInTemplate === 1
    })

    // log(' commentItem:', commentItem)
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

