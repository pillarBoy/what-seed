// const render = require('consolidate').handlebars.render
const { expect } = require('chai')
const inquirer = require('inquirer')
const async = require('async')
const fs = require('fs')
const path = require('path')
// const extend = Object.assign || require('util')._extend
// const generate = require('../../lib/generate')
// const metadata = require('../../lib/options')
// const { isLocalPath, getTemplatePath } = require('../../lib/local-path')
const copyExistingComments = require('../src/copyExistingComments.js')

function monkeyPatchInquirer (answers) {
  // monkey patch inquirer
  inquirer.prompt = questions => {
    const key = questions[0].name
    const _answers = {}
    const validate = questions[0].validate
    const valid = validate(answers[key])
    if (valid !== true) {
      return Promise.reject(new Error(valid))
    }
    _answers[key] = answers[key]
    return Promise.resolve(_answers)
  }
}

describe('web-cli', () => {
  const escapedAnswers = {
    name: 'web-cli-test',
    author: 'John "The Tester" Doe <john@doe.com>',
    description: 'vue-cli e2e test',
    preprocessor: {
      less: true,
      sass: true
    },
    pick: 'no',
    noEscape: true

  }

  const answers = {
    name: 'vue-cli-test',
    author: 'John Doe <john@doe.com>',
    description: 'vue-cli e2e test',
    preprocessor: {
      less: true,
      sass: true
    },
    pick: 'no',
    noEscape: true
  }

  it('copy existing config with comment to target file', () => {
    let fromPath ='./mock-copy-js/from.js'
    let toPath ='./mock-copy-js/to.js'
    
    const config = copyExistingComments(path.resolve(__dirname,fromPath))
    expect(config).to.equal(fs.readFileSync(toPath, 'utf-8'))
    
  })
//  it('read metadata from json', () => {
//    const meta = metadata('test-pkg', MOCK_TEMPLATE_REPO_PATH)
//    expect(meta).to.be.an('object')
//    expect(meta.prompts).to.have.property('description')
//  })
//
//  it('read metadata from js', () => {
//    const meta = metadata('test-pkg', MOCK_METADATA_REPO_JS_PATH)
//    expect(meta).to.be.an('object')
//    expect(meta.prompts).to.have.property('description')
//  })
//
//  it('helpers', done => {
//    monkeyPatchInquirer(answers)
//    generate('test', MOCK_METADATA_REPO_JS_PATH, MOCK_TEMPLATE_BUILD_PATH, err => {
//      if (err) done(err)
//      const contents = fs.readFileSync(`${MOCK_TEMPLATE_BUILD_PATH}/readme.md`, 'utf-8')
//      expect(contents).to.equal(answers.name.toUpperCase())
//      done()
//    })
//  })

})
