module.exports = function(config) {
	config.set({
		// 将用于解决所有的模式基本路径（例如，文件，排除）
		basePath: '',

		frameworks: ['browserify', 'jasmine-ajax', 'jasmine'],

		// 持续集成模式: 配置为true 将会持续运行测试, 直致完成返回0(成功)或1(失败). 示例: Done. Your build exited with 0.
		singleRun: true,

		// 浏览器启动并连接到Karma所允许的最长启动时间
		captureTimeout: 60000,

		// 使用端口
		port: 9876,

		// 是否在输出日志中使用颜色
		colors: true,

		// 日志级别
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		files: [
			// 'src/**/*.js',
			'test/**/*_spec.js'
		],
		preprocessors: {
			'test/**/*.js': ['jshint', 'browserify'],
			'src/**/*.js': ['jshint', 'browserify', 'coverage']
		},
		browsers: ['PhantomJS'],
		browserify: {
			debug: true,
			bundleDelay: 2000 // Fixes "reload" error messages, YMMV!
		},
		reporters: ['progress', 'coverage'],
		// optionally, configure the reporter
		coverageReporter: {

			reporters: [
				// generates ./coverage/lcov.info
				{type:'lcovonly', subdir: '.'},
				// generates ./coverage/coverage-final.json
				{type:'json', subdir: '.'},
				{type:'html', subdir: '.'}
			]
		},
		concurrency: Infinity
	});
};
