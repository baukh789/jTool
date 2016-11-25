'use strict';
'use strict';

var Sizzle = require('../src/js/Sizzle');
var Extend = require('../src/Extend');
var Utilities = require('../src/Utilities');
var Ajax = require('../src/Ajax');
var Element = require('../src/Element');
var Class = require('../src/Class');
var Data = require('../src/Data');
var Css = require('../src/Css');
var Offset = require('../src/Offset');
var Animate = require('../src/Animate');
var Document = require('../src/Document');
var Event = require('../src/Event');

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
// 捆绑jTool 方法
jTool.prototype.extend(Element);
jTool.prototype.extend(Class);
jTool.prototype.extend(Data);
jTool.prototype.extend(Css);
jTool.prototype.extend(Offset);
jTool.prototype.extend(Animate);
jTool.prototype.extend(Document);
jTool.prototype.extend(Event);

module.exports = jTool;