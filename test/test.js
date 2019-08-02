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

// target test
const copyExistingComments = require('../src/copyExistingComments.js')

const promptForMeta = require('../src/promptForMeta.js')
const questions = require('../src/questions.js')
const startCreate = require('../src/wpbase-cli.js')

var chalk = require('chalk')
const log = console.log

function monkeyPatchInquirer (answers) {
  // monkey patch inquirer
  inquirer.prompt = questions => {
    const key = questions[0].name
    const _answers = {}
   //  const validate = questions[0].validate
   //  const valid = validate(answers[key])
   //  if (valid !== true) {
   //    return Promise.reject(new Error(valid))
   //  }
    _answers[key] = answers[key]
    return Promise.resolve(_answers)
  }
}

describe('wpbase-cli', () => {
  const escapedAnswers = {
    name: 'wpbase-cli-test',
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
  }

  it('copy existing config with comment to target file', () => {
    let fromPath ='./mock-copy-js/from.js'
    let toPath ='./mock-copy-js/to.js'
    
    const config = copyExistingComments(require(fromPath),path.resolve(__dirname,fromPath))
    expect(config).to.equal(fs.readFileSync(toPath, 'utf-8'))
  })

  it('prompt questions and get correct options array',async () => {
    monkeyPatchInquirer( answers )
    const meta = await promptForMeta('oooj', questions )
    expect(meta).to.be.an('Object')
    if (meta.length > 0 ) {
      let packageJson = meta['package.json']
      let configJs = meta['config.js']
      let settings = meta['__notFile__butSettings__']
      packageJson && expect(packageJson).to.have.property('description')
      configJs && expect(configJs).to.have.property('isMobile')
      settings && expect(settings).to.have.property('autoInstall')
    }
  })

  it('prompt stuff correctly add to target file', async () => {
    monkeyPatchInquirer( answers )
    console.log(typeof(startCreate))
    await startCreate('oooj', questions, '../webpack-seed/')

    expect(meta).to.be.an('Object')
    if (meta.length > 0 ) {
      let packageJson = meta['package.json']
      let configJs = meta['config.js']
      let settings = meta['__notFile__butSettings__']
      packageJson && expect(packageJson).to.have.property('description')
      configJs && expect(configJs).to.have.property('isMobile')
      settings && expect(settings).to.have.property('autoInstall')
    }
  })

})
