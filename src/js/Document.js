/*
* 文档操作
* */
var Document = {
    append: function(childList){
        return this.html(childList, 'append');
    }
    ,prepend: function(childList){
        return this.html(childList, 'prepend');
    }
    ,before: function (node) {
        if(node.jTool){
            node = node.get(0);
        }
        var thisNode = this.get(0);
        var parentEl = thisNode.parentNode;
        parentEl.insertBefore(node, thisNode);
        return this;
    }
    ,after: function (node) {
        if(node.jTool){
            node = node.get(0);
        }
        var thisNode = this.get(0);
        var parentEl = thisNode.parentNode;
        if(parentEl.lastChild == thisNode){
            parentEl.appendChild(node);
        }else{
            parentEl.insertBefore(node, thisNode.nextSibling);
        }
        //  parentEl.insertBefore(node, thisNode);
    }
    ,text: function(text){
        // setter
        if(typeof(text) !== 'undefined'){
            jTool.each(this.DOMList, function(i, v){
                v.textContent = text;
            });
            return this;
            // getter
        }else{
            return this.get(0).textContent;
        }
    }
    ,html: function(childList, insertType) {
        // getter
        if(typeof(childList) == 'undefined' && typeof(insertType) == 'undefined'){
            return this.get(0).innerHTML;
        }
        // setter
        var _this = this;
        var type = jTool.type(childList);
        if(childList.jTool){
            childList = childList.DOMList;
        }
        else if(type === 'String'){
            childList = _this.createDOM(childList || '');
        }
        else if(type === 'Element'){
            childList = [childList];
        }
        var firstChild;
        jTool.each(_this.DOMList, function(e, element){
            // html
            if(!insertType){
                element.innerHTML = '';
            }
            // prepend
            else if(insertType === 'prepend'){
                firstChild = element.firstChild;
            }
            jTool.each(childList, function(c, child){
                child = child.cloneNode(true);
                // text node
                if(!child.nodeType){
                    child = document.createTextNode(child);
                }
                if(firstChild){
                    element.insertBefore(child, firstChild);
                }
                else{
                    element.appendChild(child);
                }
                element.normalize();
            });
        });
        return this;
    }
    ,wrap: function (elementText) {
        var selfDOM = '', //存储当前node 的html
            parentNode;  // 存储父节点
        jTool.each(this.DOMList, function(i, v){
            selfDOM = v;
            parentNode = v.parentNode;
            v.outerHTML = elementText;
            // 将原节点添加入wrap中第一个为空的节点内
            parentNode.querySelector(':empty').appendChild(selfDOM);
        });
        return this;
    }
    // 向上寻找匹配节点
    ,closest: function (selectorText) {
        var _this  =this;
        var parentDOM = this.get(0).parentNode;
        if(typeof selectorText === 'undefined'){
            return jTool(parentDOM);
        }
        var target = document.querySelectorAll(selectorText);

        // 递归查找匹配的父级元素
        function getParentNode(){
            if(!parentDOM || target.length === 0 || parentDOM.nodeType !== 1){
                parentDOM = null;
                return;
            }
            if([].indexOf.call(target, parentDOM) !== -1){
                return;
            }
            parentDOM = parentDOM.parentNode;
            getParentNode();
        }
        getParentNode();
        return jTool(parentDOM);
    }
    // 获取当前元素父级,返回jTool对象
    ,parent: function () {
        return this.closest();
    }
    // 通过html字符串, 生成DOM.  返回生成后的子节点
    // 该方法无处处理包含table标签的字符串,但是可以处理table下属的标签
    ,createDOM: function (htmlString) {
        var jToolDOM = document.querySelector('#jTool-create-dom');
        if(!jToolDOM || jToolDOM.length === 0){
            // table标签 可以在新建element时可以更好的容错.
            // div标签, 添加thead,tbody等表格标签时,只会对中间的文本进行创建
            // table标签,在添加任务标签时,都会成功生成.且会对table类标签进行自动补全
            var el = document.createElement('table');
            el.id = 'jTool-create-dom';
            el.style.display = 'none';
            document.body.appendChild(el);
            jToolDOM = document.querySelector('#jTool-create-dom');
        }
        jToolDOM.innerHTML = htmlString || '';
        var childNodes = jToolDOM.childNodes;

        // 进行table类标签清理, 原因是在增加如th,td等table类标签时,浏览器会自动补全节点.
        if(childNodes.length == 1 && !/<tbody|<TBODY/.test(htmlString) && childNodes[0].nodeName === 'TBODY'){
            childNodes = childNodes[0].childNodes;
        }
        if(childNodes.length == 1 && !/<thead|<THEAD/.test(htmlString) &&  childNodes[0].nodeName === 'THEAD'){
            childNodes = childNodes[0].childNodes;
        }
        if(childNodes.length == 1 && !/<tr|<TR/.test(htmlString) &&  childNodes[0].nodeName === 'TR'){
            childNodes = childNodes[0].childNodes;
        }
        if(childNodes.length == 1 && !/<td|<TD/.test(htmlString) && childNodes[0].nodeName === 'TD'){
            childNodes = childNodes[0].childNodes;
        }
        if(childNodes.length == 1 && !/<th|<TH/.test(htmlString) && childNodes[0].nodeName === 'TH'){
            childNodes = childNodes[0].childNodes;
        }
        jToolDOM.remove();
        return childNodes;
    }
    //克隆节点: 参数deep克隆节点及其后代
    ,clone: function (deep) {
        return jTool(this.get(0).cloneNode(deep || false));
    }
    //批量删除节点
    ,remove: function () {
        jTool.each(this.DOMList, function(i, v) {
            v.remove();
        });
    }
};