/*
* 效果
* */
var Animate = {
    show: function(){
        jTool.each(this.DOMList, function(i, v){
            if(v.style.oldDisplay && v.style.oldDisplay !== 'none'){
                v.style.display = v.style.oldDisplay;
            }
            else{
                v.style.display = 'block';
            }
        });
        return this;
    }
    ,hide: function(){
        jTool.each(this.DOMList, function(i, v){
            v.style.oldDisplay = jTool.getStyle(v, 'display');
            v.style.display = 'none';
        });
        return this;
    }
    // 动画效果, 动画样式仅支持以对象类型传入且值需要存在有效的单位
    ,animate: function (styleObj, time, callback) {
        var _this = this;
        var animateFromText = '',   // 动画执行前样式文本
            animateToText = '',     // 动画执行后样式文本
            node = _this.get(0);
        // 组装动画 keyframes
        jTool.each(styleObj, function(key, v){
            key = jTool.toHyphen(key);
            animateFromText += key + ':' + jTool.getStyle(node, key) + ';';
            animateToText += key + ':' + v + ';';
        });
        // 拼接动画样式文本
        var animateText = '@keyframes jToolAnimate {'
            + 'from {'
            + animateFromText
            + '}'
            + 'to {'
            + animateToText
            + '}'
            + '}';

        // 引入动画样式至页面
        var jToolAnimate = document.createElement('style');
        jToolAnimate.className = 'jTool-animate-style';
        jToolAnimate.type = 'text/css';
        document.head.appendChild(jToolAnimate);
        jToolAnimate.textContent = jToolAnimate.textContent + animateText;

        // 启用动画
        node.style.animation = 'jToolAnimate ' + time / 1000 + 's ease-in-out forwards';

        // 延时执行回调函数及清理操作
        window.setTimeout(function(){
            _this.css(styleObj);
            node.style.animation = '';
            jToolAnimate.remove();
            callback();
        }, time);
    }
};