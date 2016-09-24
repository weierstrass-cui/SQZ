// 登录注册
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
    // 登录
	mainCtrl.controller('loginController', ['$scope', '$loginService','$storage',
		function($scope,$loginService,$storage){
			$scope.loginList = {
				loginName:'13611944988',
				pass:'ZAQ!xsw2'
			}
			$scope.fn = {
				loginSubmit:function(){
					if(!$scope.loginList.loginName || !$scope.loginList.pass){
						$scope.commonFn.alertMsg("输入错误", "用户名或密码不能为空");
						return false;
					}

					$loginService.login({
						map: $scope.loginList,
						sys: {
							terminal: $scope.commonFn.getDevice()
						}
					}, function(res){
						$storage.setLocalStorage('SQZ_token', res.token);
						$storage.setLocalStorage('SQZ_userId', res.user.id);
						$scope.commonFn.goView('userInfoEdit');
					});
				}
			}
		}
	]);
	// 找回密码
	mainCtrl.controller('getBackPsdController', ['$scope','$publicService', '$getBackPsdService','$interval',
		function($scope, $publicService, $getBackPsdService, $interval){
			$scope.timeTit = '获取验证码';
			$scope.isChange = false;
			$scope.submitList = {
				phone:'',
				pass:'',
				captcha:''
			}
			$scope.fn = {
				getCode:function(){
					if( $scope.isChange ){
						$scope.commonFn.alertMsg(null, '验证码已发送，请耐心等待');
						return false;
					}
					if( !$scope.vaildata.checkPhone($scope.submitList.phone)){
						$scope.commonFn.alertMsg(null, '输入的电话号码有误');
						return false;
					}
					$publicService.getCode({
						noName: $scope.submitList.phone,
						sys: {
							terminal: $scope.commonFn.getDevice()
						}
					}, function(res){
						if($scope.timeTit == "获取验证码"){						
							var start = 60;
							$scope.isChange = true;
							//定时器
							var timer = $interval(function(){
								var t = start--;
								$scope.timeTit = t + "s";
							}, 1000, 60);
							timer.then(function success(){
								$scope.timeTit = "获取验证码";
								$scope.isChange = false;
							}); 
						}
					});
				},
				submitList:function(){
					if(!$scope.submitList.phone){
						$scope.commonFn.alertMsg("输入错误", "手机号不能为空");
						return false;
					}else if(!$scope.vaildata.checkPhone($scope.submitList.phone)){
		                $scope.commonFn.alertMsg("输入错误", "手机号有误");
						return false;
		            };
					if( !$scope.submitList.captcha){
						$scope.commonFn.alertMsg('系统提醒', '请输入验证码');
						return false;
					};
					if( !$scope.submitList.pass){
						$scope.commonFn.alertMsg('系统提醒', '请输入新密码');
						return false;
					};
					//提交信息接口
					$getBackPsdService.getBackPsd($scope.submitList, function(res){
						$scope.commonFn.alertMsg(null, "密码设置成功");
						$location.path('login');
					});
				}

			}
			
		}
	]);
	// 注册
	mainCtrl.controller('registerController', ['$scope','$publicService', '$interval', '$registerService', '$location',
		function($scope,$publicService,$interval,$registerService,$location){
			$scope.timeTit = '获取验证码';
			$scope.isChange = false;
			$scope.submitList = {
				phone:'',
				captcha:'',
				invitedCode:'',
				channel:'self',
				pass:'',
				terminal: $scope.commonFn.getDevice()
			};
			$scope.fn = {
				getCode:function(){
					if( $scope.isChange ){
						$scope.commonFn.alertMsg(null, '验证码已发送，请耐心等待');
						return false;
					}
					if( !$scope.vaildata.checkPhone($scope.submitList.phone)){
						$scope.commonFn.alertMsg(null, '输入的电话号码有误');
						return false;
					}

					$publicService.getCode({
						noName: $scope.submitList.phone,
						sys: {
							terminal: $scope.commonFn.getDevice()
						}
					}, function(res){
						if($scope.timeTit == "获取验证码"){						
							var start = 60;
							$scope.isChange = true;
							//定时器
							var timer = $interval(function(){
								var t = start--;
								$scope.timeTit = t + "s";
							}, 1000, 60);
							timer.then(function success(){
								$scope.timeTit = "获取验证码";
								$scope.isChange = false;
							}); 
						}
					});
				},
				submitList:function(){
					if(!$scope.submitList.phone){
						$scope.commonFn.alertMsg("输入错误", "手机号不能为空");
						return false;
					}else if(!$scope.vaildata.checkPhone($scope.submitList.phone)){
		                $scope.commonFn.alertMsg("输入错误", "手机号有误");
						return false;
		            };

					if( !$scope.submitList.captcha ){
						$scope.commonFn.alertMsg('系统提醒', '请输入验证码');
						return false;
					};
					
					//提交信息接口
					// /userService/reg/user;phone=13585948849;invitedCode=;captcha=1628;channel=self;terminal=ios/sys
					$registerService.registerRecommend({
						user: $scope.submitList,
						sys: {}
					}, function(res){
						$scope.commonFn.alertMsg(null, "注册成功");
						$location.path('login');
						//$scope.commonFn.goView('/login');
					});	
				}
			}

		}
	]);
	// 用户资料
	mainCtrl.controller('userInfoController', ['$scope', '$storage', '$userService','$publicService',
		function($scope, $storage, $userService,$publicService){
			var areaName = [];
			var getAreaName = function(areaId, callback){
				$publicService.getOneArea({
					noName: areaId,
					sys:{}
				},function(res){
					areaName.push(res.region.name);
					if(typeof callback === 'function') callback();
				});
			}
			$userService.getUser({
				sys: {
					token: $scope.commonFn.getToken(),
					terminal: $scope.commonFn.getDevice()
				}
			}, function(res){
				if( res.user.provinceId ){
					getAreaName(res.user.provinceId, function(){
						if( res.user.cityId ){
							getAreaName(res.user.cityId, function(){
								if( res.user.distId ){
									getAreaName(res.user.distId, function(){
										res.user.areaName = areaName.join(' - ');
									});
								}else{
									res.user.areaName = areaName.join(' - ');
								}
							});
						}else{
							res.user.areaName = areaName.join(' - ');
						}
					});
				}
				if( res.user.schoolId ){
					$publicService.getOneSchool({
						noName: res.user.schoolId,
						sys:{}
					},function(schoolRES){
						res.user.schoolName = schoolRES.school.name;
					});
				}
				$scope.userInfo = res.user;
			});
		}
	]);
})();