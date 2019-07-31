/* 这个文件的变动，需要写明inFile, 且inFile的值需要是一个配置文件,否则web-cli.js 下将报错
 * 不是要写入文件的配置，应设定为       inFile: '__notFile__butSettings__',
 */
module.exports ={
  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
      inFile: 'package.json',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A front-end project',
      inFile: 'package.json',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author',
      inFile: 'package.json',
    },

    isMobile: {
      type: 'confirm',
      message: 'is it a mobile web project',
      name: 'isMobile',
      default: true,
      inFile: 'config.js',
    },
    i18n: {
      type: 'confirm',
      message: 'support international language?',
      name: 'i18n',
      default: false,
      inFile: 'config.js',
    },
    lint: {
      type: 'confirm',
      message: 'Use ESLint to lint your code?',
      name: 'eslint',
      default: false,
      inFile: 'config.js',
    },
    autoInstall: {
      type: 'confirm',
      message: 'run npm install after created?',
      name: 'autoInstall',
      default: false,
      inFile: '__notFile__butSettings__',
    }
  }
}
