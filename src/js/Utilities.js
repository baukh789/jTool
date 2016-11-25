
/*
 * @jTool工具扩展
 * */
var utilities = {
    // 是否为chrome浏览器
    isChrome: function(){
        return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
    }
    // 是否为window
    ,isWindow: function(object){
        return object != null && object === object.window;
    }
    // 版本号
    ,version: '1.0'
    // 空函数
    ,noop: function(){}
    // 类型
    ,type: function(o){
        if(o === null || o === undefined){
            return o + '';
        }
        var type = '';
        switch (o.constructor){
            case Object:
                type = 'Object';
                break;
            case Array:
                type = 'Array';
                break;
            case NodeList:
                type = 'NodeList';
                break;
            case String:
                type = 'String';
                break;
            case Number:
                type = 'Number';
                break;
            case Function:
                type = 'Function';
                break;
            case Date:
                type = 'Date';
                break;
            case RegExp:
                type = 'RegExp';
                break;
            default:
                type = 'null';
                break;
        }
        if(o instanceof Element){
            type = 'Element';
        }
        return type;
    }
    // 循环
    ,each: function(object, callback){
        // 当前为jTool对象,循环目标更换为jTool.DOMList
        if(object && object.jTool){
            object = object.DOMList;
        }
        var type = this.type(object);
        // 为数组或类数组时, 返回: index, value
        if(type === 'Array' || type === 'NodeList'){
            // 由于存在类数组NodeList, 所以不能直接调用every方法
            [].every.call(object, function(v, i){
                jTool.isWindow(v) ? '' : (v.jTool ? v = v.get(0) : ''); // 处理jTool 对象
                return callback.call(v, i, v) === false ? false : true;
            });
        }
        // 为对象格式时,返回:key, value
        else if(type === 'Object'){
            for(var i in object){
                if(callback.call(object[i], i, object[i]) === false){
                    break;
                }
            }
        }
    }
    // 清除字符串前后的空格
    ,trim: function (text) {
        return text.trim();
    }
    // 抛出异常信息
    ,error: function(msg){
        throw new Error('[jTool Error: '+ msg + ']');
    }
    // 检测是否为空对象
    ,isEmptyObject: function(obj){
        var isEmptyObject = true;
        for(var i in obj){
            isEmptyObject = false;
        }
        return isEmptyObject;
    }
    // 获取节点样式: key为空时则返回全部
    ,getStyle: function(dom, key){
        return window.getComputedStyle(dom)[key]
    }
    // 获取样式的单位
    ,getStyleUnit: function (style) {
        var unitList = ['px', 'em', 'vem', '%'],
            unit = '';
        // 样式本身为纯数字,则直接返回单位为空
        if(typeof(style) === 'number'){
            return unit;
        }
        jTool.each(unitList, function (i, v) {
            if(style.indexOf(v) !== -1){
                unit = v;
                return false;
            }
        });
        return unit;
    }
    // 字符格式转换: 连字符转驼峰
    ,toHump: function (text) {
        return text.replace(/-\w/g, function(str){
            return str.split('-')[1].toUpperCase();
        });
    }
    //字符格式转换: 驼峰转连字符
    ,toHyphen: function (text) {
        return text.replace(/([A-Z])/g,"-$1").toLowerCase();
    }
};