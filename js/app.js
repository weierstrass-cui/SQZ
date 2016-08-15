angular.module('starter', ['starter.controller', 'ngAnimate', 'ngTouch', 'ngFileUpload'])
.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider.when('/login', {
			templateUrl: 'template/login.html'
		});

		//当找不到链接页面后跳转首页
		$routeProvider.otherwise('/login');
	}
]);