var Sizzle = require('./Sizzle');
var Extend = require('./extend');
var Utilities = require('./utilities');
var Ajax = require('./ajax');
var _Event = require('./Event');
var _Css = require('./Css');
var _Class = require('./Class');
var _Document = require('./Document');
var _Offset = require('./Offset');
var _Element = require('./Element');

// 如果需要集成Angular,React,在此处进行集成
var jTool = function (selector, context){
    return new Sizzle(selector, context);
};

// 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
Sizzle.prototype = jTool.prototype = {};
// 捆绑jTool 工具
jTool.extend = jTool.prototype.extend = Extend;
jTool.extend(Utilities);
jTool.extend(Ajax);

//捆绑jTool 方法
jTool.prototype.extend(_Event);
jTool.prototype.extend(_Css);
jTool.prototype.extend(_Class);
jTool.prototype.extend(_Document);
jTool.prototype.extend(_Offset);
jTool.prototype.extend(_Element);

window.jTool = jTool;

module.exports = jTool;
