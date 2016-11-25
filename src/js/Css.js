/*
* CSS
* */
var Css = {
    css: function(key, value){
        var _this = this;
        // getter
        if(jTool.type(key) === 'String' && !value){
            return parseInt(jTool.getStyle(this.get(0), key).split('px')[0] || '0');
        }
        // setter
        var pxList = ['width', 'height', 'top', 'left', 'right', 'bottom', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left','margin-top', 'margin-right', 'margin-bottom', 'margin-left'];
        // ex: {width:13px, height:10px}
        if(jTool.type(key) === 'Object'){
            var obj = key;
            for(var k in obj){
                setStyle(k, obj[k]);
            }
        }
        // ex: width, 13px
        else {
            setStyle(key, value);
        }
        function setStyle(name, val) {
            jTool.type(val) !== 'String' ? val = val.toString() : '';
            if(pxList.indexOf(name) !==-1 && val.indexOf('px') === -1){
                val = val + 'px';
            }
            jTool.each(_this.DOMList, function(i, v){
                v.style[name] = val;
            });
        }
        return this;
    }
    ,width: function(value){
        return this.css('width', value);
    }
    ,height: function(value){
        return this.css('height', value);
    }
};