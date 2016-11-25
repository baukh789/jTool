/*
* ajax
* type === GET: data格式 name=baukh&age=29
* type === POST: data格式 {name:'baukh',age:29}
* 与jquery不同的是,[success,error,complete]返回的第二个参数,并不是返回错误信息,而是错误码
* */
var Ajax = {
    ajax: function(arg){
        var url = arg.url,
            type = arg.type || 'GET',
            data = arg.data || undefined,
            headers = arg.headers || {},
            asynch = typeof(arg.asynch) === 'undefined' ? true : arg.asynch, // 是否使用异步
            beforeSend = arg.beforeSend || jTool.noop,
            complete =  arg.complete || jTool.noop,
            success =  arg.success || jTool.noop,
            error = arg.error || jTool.noop;
        if(!arg){
            jTool.error('jTool ajax: url不能为空');
            return;
        }
        var xhr = new XMLHttpRequest();
        if (type === 'POST' && jTool.type(data) === 'Object') {
            data = JSON.stringify(data);
        } else if(type === 'GET' && jTool.type(data) === 'String'){
            url = url + (url.indexOf('?') === -1 ?  '?' : '&') + data;
        }
        xhr.open(type, url, asynch);
        for(var key in headers){
            xhr.setRequestHeader(key, headers[key]);
        }
        // 执行发送前事件
        beforeSend(xhr);
        // 监听onload并执行完成事件
        xhr.onload = function () {
            // jquery complete(XHR, TS)
            complete(xhr, xhr.status);
        };
        // 监听onreadystatechange并执行成功后失败事件
        xhr.onreadystatechange = function () {
            if(xhr.readyState !== 4){
                return;
            }
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                // jquery success(XHR, TS)
                success(xhr.response, xhr.status);
            }else{
                // jquery error(XHR, TS, statusText)
                error(xhr, xhr.status, xhr.statusText);
            }
        };
        xhr.send(data);
    }
    ,post: function(url, data, callback){
        this.ajax({url:url, type: 'POST', data: data, success: callback})
    }
};