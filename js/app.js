angular.module('starter', ['starter.controller', 'ngAnimate', 'ngTouch', 'ngFileUpload'])
.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider
		.when('/login', {
			templateUrl: 'template/user/login.html',
			controller: 'loginController'
		}).when('/register', {
			templateUrl: 'template/user/register.html',
			controller: 'registerController'
		}).when('/getBackPsd', {
			templateUrl: 'template/user/getBackPsd.html',
			controller: 'getBackPsdController'
		}).when('/userInfoEdit', {
			templateUrl: 'template/user/userInfoEdit.html',
			controller: 'userInfoController'
		}).when('/sexEdit', {
			templateUrl: 'template/user/sexEdit.html',
			controller: 'userInfoEditController'
		}).when('/userNickEdit', {
			templateUrl: 'template/user/userNickEdit.html',
			controller: 'userInfoEditController'
		}).when('/schoolSelEdit', {
			templateUrl: 'template/user/schoolSelEdit.html',
			controller: 'userInfoEditController'
		}).when('/districtSelEdit', {
			templateUrl: 'template/user/districtSelEdit.html',
			controller: 'userInfoEditController'
		})

		.when('/myResume', {
			templateUrl: 'template/resume/myResume.html',
			controller: 'myResumeController'
		}).when('/resumeSexEdit', {
			templateUrl: 'template/resume/sexEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/userNameEdit', {
			templateUrl: 'template/resume/userNameEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/emailEdit', {
			templateUrl: 'template/resume/emailEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/birthdayEdit', {
			templateUrl: 'template/resume/birthdayEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/resumePhoneEdit', {
			templateUrl: 'template/resume/resumePhoneEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/resumeSchoolSelEdit', {
			templateUrl: 'template/resume/schoolSelEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/educationEdit', {
			templateUrl: 'template/resume/educationEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/politicalEdit', {
			templateUrl: 'template/resume/politicalEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/taskTypeEdit', {
			templateUrl: 'template/resume/taskTypeEdit.html',
			controller: 'resumeInfoEditController'
		}).when('/experienceEdit', {
			templateUrl: 'template/resume/experienceEdit.html',
			controller: 'resumeInfoEditController'
		})
		
		.when('/companyDetails', {
			templateUrl: 'template/companyDetails.html',
			controller: 'companyDetailController'
		}).when('/jobDetails', {
			templateUrl: 'template/jobDetails.html',
			controller: 'jobDetailController'
		})



		.when('/myWorkAxis', {
			templateUrl: 'template/myWorkAxis.html'
		}).when('/myCollection', {
			templateUrl: 'template/myCollection.html',
			controller: 'myCollectionController'
		})
		//当找不到链接页面后跳转首页
		$routeProvider.otherwise('/login');
	}
]);