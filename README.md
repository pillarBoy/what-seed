# what-seed 

A front end project seed for whatever 

## Functionality

这是一个前端webpack种子项目，可以用来生成前端的起始项目。通过问答完成移动端适配、sass编译等环境配置，类似vue-init.

详见[已实现功能](https://github.com/pillarBoy/what-seed)

## Usage

``` bash
$ web-cli create <project-name>
```

## Installation

### git clone

``` bash
$ git clone https://github.com/pillarBoy/what-seed
$ cd what-seed
$ npm link  # make web-cli a global command, might have accession issues.
            # alternatively, set path-to-webcli-dir as env variable

$ web-cli create myproject  
$ cd myproject
```

start to work

## Customize this seed

当前可以通过修改 `src/config.template.js` 来修改默认配置，这个文件将会复制到生成项目的 `webpack/config.js` 由webpack引用

问答可以定制一些不同场景下的不同配置，在 `src/questions.js` 中可以定制问答项目。

引入单元测试，编写测试文件 `test/test.js` 后 `npm run test` 运行测试，`npm run coverage` 运行istanbul覆盖率测试

## Details

移动端适配方案: 依照750px设计图写尺寸(后续将增设配置)，单位用px， 编译时，由px2rem转为rem，根据ClientWidth设定根字体，完成响应式适配。

在webpack中引入了px2rem，基准宽度是750px，因此750px宽度设计图的尺寸可以直接用到css文件中，单位是px

代码在生成项目中的 `src/utils/htmlFontSize.js`  中

不想转换的，如1px 线，写作 `border: 1px solid #ddd; /*no*/`，想转换，但需要保留px单位的，如字体，写作 ` font-size: 28px; /*px*/ `

详见[px2rem文档](https://github.com/songsiqi/px2rem)


## 项目包管理，使用yarn

##### 项目初始化

`yarn`
或 `npm install`

##### dev

`yarn start`

##### build

`yarn build`


## Regards

[vue-cli](https://github.com/vuejs/vue-cli)

[px2rem](https://github.com/songsiqi/px2rem)
