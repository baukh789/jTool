var express = require('express');
var app = express();

// 配置空路径
app.use(/\/$/, function (req, res) {
	res.redirect('/demo/index.html');
});

// 配置资源路径
app.use(express.static(__dirname));
app.listen(2016, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('started at http://localhost:2016');
});
