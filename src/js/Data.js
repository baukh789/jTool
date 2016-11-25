/*
* 属性 数据
* */
var Data = {
    // data唯一识别码
    dataKey: 'jTool' + jTool.version
    // 设置\获取对象类属性
    ,data: function(key, value){
        var _this = this,
            _data = {};
        // 未指定参数,返回全部
        if(typeof key === 'undefined' && typeof value === 'undefined'){
            return _this.get(0)[_this.dataKey]
        }
        // setter
        if(typeof(value) !== 'undefined'){
            // 存储值类型为字符或数字时, 使用attr执行
            var _type = jTool.type(value);
            if(_type === 'String' || _type === 'Number'){
                _this.attr(key, value);
            }
            jTool.each(_this.DOMList, function(i, v){
                _data = v[_this.dataKey] || {};
                _data[key] = value;
                v[_this.dataKey] = _data;
            });
            return this;
        }
        // getter
        else{
            _data = _this.get(0)[_this.dataKey] || {};
            return _data[key] || _this.attr(key);
        }
    }
    // 删除对象类属性
    ,removeData: function(key){
        var _this = this,
            _data;
        if(typeof key === 'undefined'){
            return;
        }
        jTool.each(_this.DOMList, function(i, v){
            _data = v[_this.dataKey] || {};
            delete _data[key];
        });
    }
    // 普通属性
    ,attr: function(key, value){
        // 未指定参数,返回空字符
        if(typeof key === 'undefined' && typeof value === 'undefined'){
            return '';
        }
        // setter
        if(typeof(value) !== 'undefined'){
            jTool.each(this.DOMList, function(i, v){
                v.setAttribute(key, value);
            });
            return this;
        }
        // getter
        else{
            return this.get(0).getAttribute(key);
        }
    }
    // 删除普通属性
    ,removeAttr: function(key){
        if(typeof key === 'undefined'){
            return;
        }
        jTool.each(this.DOMList, function(i, v){
            v.removeAttribute(key);
        });
    }
    // 配置固有属性
    ,prop: function (key, value) {
        // 未指定参数,返回空字符
        if(typeof key === 'undefined' && typeof value === 'undefined'){
            return '';
        }
        // setter
        if(typeof(value) !== 'undefined'){
            jTool.each(this.DOMList, function(i, v){
                v[key] = value;
            });
            return this;
        }
        // getter
        else{
            return this.get(0)[key];
        }
    }
    // attr -> value
    ,val: function (value) {
        return this.attr('value', value) || '';
    }
    // 索引
    ,index: function (nodeList) {
        var node = this.get(0);
        // 查找范围参数为空时,找寻同层节点
        if(!nodeList){
            nodeList = node.parentNode.childNodes;
        }
        // 查找范围参数为jTool对象,则使用对象的DOMList
        else if(nodeList.jTool){
            nodeList = nodeList.DOMList;
        }
        return nodeList ? [].indexOf.call(nodeList, node) : -1;
    }
};