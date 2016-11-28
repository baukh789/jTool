var Sizzle = require('./Sizzle');
var Extend = require('./extend');
var Utilities = require('./utilities');
var Ajax = require('./ajax');
var Event = require('./Event');

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
jTool.prototype.extend(Event);

module.exports = jTool;
