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
		}).when('/sexEdit', {
			templateUrl: 'template/sexEdit.html'
		}).when('/resumeEdit', {
			templateUrl: 'template/resumeEdit.html'
		}).when('/schoolSelEdit', {
			templateUrl: 'template/schoolSelEdit.html'
		}).when('/districtSelEdit', {
			templateUrl: 'template/districtSelEdit.html'
		}).when('/districtInfoEdit', {
			templateUrl: 'template/districtInfoEdit.html'
		}).when('/userNameEdit', {
			templateUrl: 'template/userNameEdit.html'
		}).when('/myWorkAxis', {
			templateUrl: 'template/myWorkAxis.html'
		}).when('/jobDetails', {
			templateUrl: 'template/jobDetails.html'
		}).when('/myCollection', {
			templateUrl: 'template/myCollection.html'
		});
		//当找不到链接页面后跳转首页
		$routeProvider.otherwise('/login');
	}
]);