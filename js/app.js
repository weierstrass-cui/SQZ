angular.module('starter', ['starter.controller', 'ngAnimate', 'ngTouch', 'ngFileUpload'])
.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider
		.when('/login', {
			templateUrl: 'template/login.html',
			controller: 'loginController'
		}).when('/register', {
			templateUrl: 'template/register.html',
			controller: 'registerController'
		}).when('/getBackPsd', {
			templateUrl: 'template/getBackPsd.html',
			controller: 'getBackPsdController'
		}).when('/userInfoEdit', {
			templateUrl: 'template/userInfoEdit.html',
			controller: 'userInfoController'
		}).when('/sexEdit', {
			templateUrl: 'template/sexEdit.html',
			controller: 'userInfoEditController'
		}).when('/resumeEdit', {
			templateUrl: 'template/resumeEdit.html'
		}).when('/schoolSelEdit', {
			templateUrl: 'template/schoolSelEdit.html'
		}).when('/districtSelEdit', {
			templateUrl: 'template/districtSelEdit.html',
			controller: 'userInfoEditController'
		}).when('/districtInfoEdit', {
			templateUrl: 'template/districtInfoEdit.html',
			controller: 'userInfoEditController'
		}).when('/userNameEdit', {
			templateUrl: 'template/userNameEdit.html',
			controller: 'userInfoEditController'
		}).when('/myWorkAxis', {
			templateUrl: 'template/myWorkAxis.html'
		}).when('/jobDetails', {
			templateUrl: 'template/jobDetails.html'
		}).when('/myCollection', {
			templateUrl: 'template/myCollection.html',
			controller: 'myCollectionController'
		}).when('/companyDetails', {
			templateUrl: 'template/companyDetails.html'
		});
		//当找不到链接页面后跳转首页
		$routeProvider.otherwise('/login');
	}
]);