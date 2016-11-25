/*
 Class
* */
var Class = {
    addClass: function(className){
        return this.changeClass(className, 'add');
    }
    ,removeClass: function(className){
        return this.changeClass(className, 'remove');
    }
    ,toggleClass: function(className){
        return this.changeClass(className, 'toggle');
    }
    // 如果DOMList为多值, 以第一个值为基准
    ,hasClass: function(className){
        return this.get(0).classList.contains(className);
    }
    // 解析className 将以空格间格的字符串分割为数组
    ,parseClassName: function (className) {
        return className.indexOf(' ') ?  className.split(' ') : [className];
    }
    // 执行指定classList方法
    ,changeClass: function (className, exeName) {
        var classNameList = this.parseClassName(className);
        jTool.each(this.DOMList, function(i, dom){
            jTool.each(classNameList, function(index, name){
                dom.classList[exeName](name);
            });
        });
        return this;
    }
};