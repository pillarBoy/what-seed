// 问类似'./questions'结构中定义的问题, 并将问题转化为fileFilter可接受的对象
var ask = require('./lib/askQuestions')
var invertBy  = require('lodash').invertBy

module.exports = function promptForMeta(projectName, questions) {
  return new Promise( (resolve,reject) => {
    let data = { isNotTest: true }
    ask(questions.prompts, data, () => {
      const tempJson = invertBy(questions.prompts, value => value.inFile)
      let optArray = {}
      Object.keys(tempJson).forEach((key) => {
        let getDataValue = function (data) {
          let obj = {}
          tempJson[key].forEach(item => {
            obj[item] = data[item]
          })
          return obj
        }
        optArray[key] = getDataValue(data)
      })
      return resolve(optArray)
    })
  })
}
