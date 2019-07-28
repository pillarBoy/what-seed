module.exports = [
    {
      type: 'input',
      message: 'Project name:',
      name: 'name',
      default: 'a mobile project'
    },
    {
      type: 'input',
      message: 'Project description:',
      name: 'desc',
      default: 'a mobile project'
    },
    {
      type: 'input',
      message: 'author:',
      name: 'author',
      default: 'a cool programmer'
    },
    {
      type: 'confirm',
      message: 'is it a mobile web project?',
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
    ]
