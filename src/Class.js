var utilities = require('./utilities');

var _Class = {

    addClass: function(className) {
        return this.changeClass(className, 'add');
    },

	removeClass: function(className) {
        return this.changeClass(className, 'remove');
    },

	toggleClass: function(className) {
        return this.changeClass(className, 'toggle');
    },

	// 不支持多 className
    hasClass: function(className) {
	    return [].some.call(this.DOMList, function(dom) {
			return dom.classList.contains(className);
	    });
    },

    // 解析className 将以空格间格的字符串分割为数组
    parseClassName: function(className) {
        return className.indexOf(' ') ?  className.split(' ') : [className];
    },

    // 执行指定classList方法
    changeClass: function(className, exeName) {
        var classNameList = this.parseClassName(className);
	    utilities.each(this.DOMList, function(i, dom) {
		    utilities.each(classNameList, function(index, name){
                dom.classList[exeName](name);
            });
        });
        return this;
    }
};

module.exports = _Class;
