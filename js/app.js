angular.module('starter', ['starter.controller', 'ngAnimate', 'ngTouch', 'ngFileUpload'])
.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider
		.when('/login', {
			templateUrl: 'template/login.html'
			/*controller: 'homeController'*/
		}).when('/register', {
			templateUrl: 'template/register.html'
		}).when('/getBackPsd', {
			templateUrl: 'template/getBackPsd.html'
		}).when('/userInfoEdit', {
			templateUrl: 'template/userInfoEdit.html'
		});
		//当找不到链接页面后跳转首页
		$routeProvider.otherwise('/login');
	}
]);