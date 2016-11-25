/*
 * @extend:扩展方法
 * jTool.extend => 可以直接使用$.extend调用
 * jTool.prototype.extend => 扩展操作后可以通过$.prototype获取
 * */
var extend = function(){
    // 参数为空,返回空对象
    if(arguments.length === 0){
        return {};
    }
    var doop = false, // 是否递归
        i = 1,
        target = arguments[0],
        options;
    // 如果参数只有一个, 将认为是对jTool进行扩展
    if(arguments.length === 1){
        target = this;
        i=0;
    }
    if(typeof(target) === 'boolean'){
        doop = target;
        target = arguments[1] || {};
//            console.log('jTool不支持递归合并');
    }
    for(; i<arguments.length; i++){
        options = arguments[i] || {};
        for (var p in options) {
            if (options.hasOwnProperty(p)) {
                target[p] = options[p];
            }
        }
    }
    return target;
};