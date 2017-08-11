# jTool

[![Build Status](https://img.shields.io/travis/baukh789/jTool.svg?style=flat-square)](https://travis-ci.org/baukh789/jTool)
[![npm version](https://img.shields.io/npm/v/jTool.svg?style=flat-square)](https://www.npmjs.com/package/jTool)
[![npm downloads](https://img.shields.io/npm/dt/jTool.svg?style=flat-square)](https://www.npmjs.com/package/jTool)
[![coverage](https://img.shields.io/codecov/c/github/baukh789/jTool.svg?style=flat-square)](https://codecov.io/gh/baukh789/jTool)
[![codecov](https://codecov.io/gh/baukh789/jTool/branch/master/graph/badge.svg)](https://codecov.io/gh/baukh789/jTool)
# jTool从哪里来
表格组件[GridManager.js](http://gridmanager.lovejavascript.com), 这个组件起先是基于jQuery开发的,后来在做去jquery操作时, 将所支撑的基础类做了抽离, 而这个类库就是 jTool.

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

### 成功案例
- [GridManager.js](http://gridmanager.lovejavascript.com)
