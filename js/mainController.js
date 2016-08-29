
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
    //登录
	mainCtrl.controller('loginController', ['$scope', '$loginService','$location','$storage',
		function($scope,$loginService,$location,$storage){
			$scope.loginList = {
				loginName:'',
				pass:''
			}
			$scope.fn = {
				loginSubmit:function(){
					console.log($scope.loginList);
					if(!$scope.loginList.loginName || !$scope.loginList.pass){
						$scope.commonFn.alertMsg("输入错误", "用户名或密码不能为空");
						return false;
					}
					$loginService.login($scope.loginList, function(res){
						//18817384281 w4894t
						console.log(res);
						var user = res.user,userInfo;
						userInfo = {id:user.id,gender:user.gender,phone:user.phone};
						$storage.setLocalStorage('userInfo',JSON.stringify(userInfo));
						$location.path('userInfoEdit');

					});
				}
			}
			
		}
	]);
	//找回密码
	mainCtrl.controller('getBackPsdController', ['$scope', '$getBackPsdService','$interval',
		function($scope,$getBackPsdService,$interval){
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
					$getBackPsdService.getCode($scope.submitList.phone, function(res){
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
					console.log($scope.submitList);
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
						console.log(res);
						$scope.commonFn.alertMsg(null, "密码设置成功");
						$location.path('login');
					});
				}

			}
			
		}
	]);
	//注册
	mainCtrl.controller('registerController', ['$scope', '$interval', '$registerService', '$location',
		function($scope,$interval, $registerService,$location){
			$scope.timeTit = '获取验证码';
			$scope.isChange = false;
			$scope.submitList = {
				phone:'',
				captcha:'',
				invitedCode:'',
				channel:'self',
				pass:''
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
					$registerService.getCode($scope.submitList.phone, function(res){
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

					/*if($registerService.getDeviceType() == 'android'){
						$scope.submitList.channel = 'self';
						console.log($scope.submitList.channel);
					}*/
					console.log($scope.submitList);
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
					
					//提交信息接口
					$registerService.registerRecommend($scope.submitList, function(res){
						console.log(res);
						
						$scope.commonFn.alertMsg(null, "注册成功");
						$location.path('login');
						//$scope.commonFn.goView('/login');
					});	
				}
			}

		}
	]);
	mainCtrl.controller('userInfoEditController', ['$scope', '$storage',
		function($scope,$storage){
			//18817384281 w4894t
			//var joins = $scope.commonFn.getParamsFromUrl();
			var info = JSON.parse($storage.getLocalStorage('userInfo'));
			$scope.username = '';
			$scope.nickName = '';
	        console.log(info);
	        $scope.username = info.username || info.phone;
	        $scope.nickName = $storage.getLocalStorage('nickName');
	        console.log($scope.nickName);
          
			$storage.removeLocalStorage('nickName');
			
		}
	]);
	mainCtrl.controller('userNameEditController', ['$scope', '$storage',
		function($scope,$storage){
			//18817384281 w4894t
			/*$scope.userNameEdit='';*/
			$scope.fn = {
				cancel:function(){
					$scope.commonFn.goLastView();
				},
				submit:function(){
					/*$scope.nameEdit = $scope.commonFn.buildParamsForUrl({
						userName : $scope.userNameEdit
					});*/
					$storage.setLocalStorage('nickName',$scope.userNameEdit);
					$scope.commonFn.goLastView('userInfoEdit');
				}
			}
		}
	]);
	mainCtrl.controller('myCollectionController', ['$scope', 
		function($scope){
			$scope.fn = {
				showRemoveBtn:function(e){
					
				}
			}
		}
	]);
})();
