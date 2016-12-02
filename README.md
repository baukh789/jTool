# jTool

[![Build Status](https://img.shields.io/travis/hjzheng/jTool.svg?style=flat-square)](https://travis-ci.org/hjzheng/jTool)
[![npm version](https://img.shields.io/npm/v/jTool.svg?style=flat-square)](https://www.npmjs.com/package/jTool)
[![npm downloads](https://img.shields.io/npm/dt/jTool.svg?style=flat-square)](https://www.npmjs.com/package/jTool)
[![coverage](https://img.shields.io/codecov/c/github/hjzheng/jTool.svg?style=flat-square)](https://codecov.io/gh/hjzheng/jTool)

# jTool从哪里来
个人最先做的是表格组件[GridManager.js](http://www.lovejavascript.com/plugIn/GridManager/demo2.html), 这个组件基于jQuery开发.
后来想做成原生 JS 组件, 那么就需要一个类库来支撑. 这个类库就是 jTool.js.

# jTool的实现理念
这么多年来一直使用的都是 jQuery 或直接上手原生 JS, jTool 使用方法和 API 基本上参考 jQuery.
jTool 用一样的 API, 不一样的逻辑, 实现相同的功能. 这就是 jTool.js 的编码理念.
### 安装方式
```
npm install jTool
```
### 引入方式
```
<script type="text/javascript" src="build/jTool.js"></script>
```
### 使用方式
```
jTool('#test').show();
//如果需要使用$符号, 则在代码初始区域执行 var $ = jTool; 即可.
```
