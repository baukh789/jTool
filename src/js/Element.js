/*
* 元素筛选
* */
var Element = {
    // 获取指定DOM Element
    get: function(index){
        return this.DOMList[index];
    }
    // 获取指定索引的jTool对象
    ,eq: function(index){
        return jTool(this.DOMList[index]);
    }
    // 返回指定选择器的jTool对象
    ,find: function(selectText){
        return jTool(selectText, this);
    }
    // 获取与th同列的td jTool对象, 该方法的调用者只允许为Th
    ,getRowTd: function () {
        var th = this.eq(0);
        if(th.get(0).tagName !== 'TH'){
            jTool.error('getRowTd的调用者只允许为Th');
            return;
        }
        var table = th.closest('table'),
            trList = $('tbody tr', table);
        var tdList = [],
            thIndex = th.index();
        jTool.each(trList, function (i, v) {
            tdList.push(jTool('td', v).get(thIndex));
        });
        return jTool(tdList);
    }
};
