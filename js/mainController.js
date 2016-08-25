
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}

	mainCtrl.controller('loginController', ['$scope', 
		function($scope){
			console.log('login')
		}
	]);
	mainCtrl.controller('registerController', ['$scope', '$interval',
		function($scope,$interval){
			$scope.timeTit = '获取验证码';
			$scope.isChange = false;
			$scope.submitList = {
				mobilePhone: $scope.mobilePhone,
				verCode: $scope.verificationCode,
				registerPsd: $scope.registerPsd,
				inviteCode: $scope.inviteCode
			};
			$scope.fn = {
				showTime:function(){
					if( !$scope.vaildata.checkPhone($scope.mobilePhone)){
						$scope.commonFn.alertMsg('系统提醒', '输入的电话号码有误');
						return false;
					}
					if($scope.timeTit == "获取验证码"){						
						var start = 60;
						$scope.isChange = true;
						//定时器
						var timer = $interval(function(){
							var t = start--;
							$scope.timeTit = t + "s";
						}, 1000, 60); 
						alert('123');
						timer.then(function success(){
							$scope.timeTit = "获取验证码";
							$scope.isChange = false;
						}); 
					}
				},
				submitList:function(){
					if(!$scope.submitList.mobilePhone){
						$scope.commonFn.alertMsg("输入错误", "手机号不能为空");
						return false;
					}else if(!$scope.vaildata.checkPhone($scope.submitList.mobilePhone)){
		                $scope.commonFn.alertMsg("输入错误", "您的车牌号有误");
						return false;
		            };
					if( !$scope.submitList.verCode){
						$scope.commonFn.alertMsg('系统提醒', '请输入验证码');
						return false;
					};
					if( !$scope.submitList.registerPsd){
						$scope.commonFn.alertMsg('系统提醒', '请输入您密码');
						return false;
					};
					
					//提交信息接口
					$registerService.registerRecommend($scope.submitList,function(res){
						console.log(res);
					});	
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
