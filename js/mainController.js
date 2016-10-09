// 登录注册
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
    // 登录
	mainCtrl.controller('loginController', ['$scope', '$loginService','$storage',
		function($scope,$loginService,$storage){
			var autoLogin = $storage.getLocalStorage('SQZ_autoLogin');
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
						if( $scope.rememberPass ){
							$storage.setLocalStorage('SQZ_autoLogin', '1');
							$storage.setLocalStorage('SQZ_userInfo', JSON.stringify($scope.loginList));
						}
						$storage.setLocalStorage('SQZ_token', res.token);
						$storage.setLocalStorage('SQZ_userId', res.user.id);
						location.href = '#/userInfoEdit?userId=' + res.user.id;
						// $scope.commonFn.goView('/userInfoEdit', true);
					});
				}
			}
			if( autoLogin === '1' ){
				$scope.loginList = JSON.parse($storage.getLocalStorage('SQZ_userInfo'));
				$scope.fn.loginSubmit();
				return;
			}
			$scope.loginList = {
				loginName:'',
				pass:''
			};
			// $scope.loginList = {
			// 	loginName:'13611944988',
			// 	pass:'ZAQ!xsw2'
			// };
		}
	]);
	// 找回密码
	mainCtrl.controller('getBackPsdController', ['$scope','$publicService', '$getBackPsdService','$interval',
		function($scope, $publicService, $getBackPsdService, $interval){
			$scope.timeTit = '获取验证码';
			$scope.isChange = false;
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
					$getBackPsdService.getBackPsd({
						map:$scope.submitList,
						sys: {}
					}, function(res){
						$scope.commonFn.alertMsg(null, "密码设置成功", function(){
							$scope.commonFn.goView('/login', true);
						});
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
					$registerService.registerRecommend({
						user: $scope.submitList,
						sys: {}
					}, function(res){
						$scope.commonFn.alertMsg(null, "注册成功");
						$scope.commonFn.goView('/login', true);
					});	
				}
			}

		}
	]);
	// 用户资料
	mainCtrl.controller('userInfoController', ['$scope', '$storage', '$userService','$publicService','Upload',
		function($scope, $storage, $userService,$publicService, $upload){
			var areaName = [],
				param = $scope.commonFn.getParamsFromUrl();
			var getAreaName = function(areaId, callback){
				$publicService.getOneArea({
					noName: areaId,
					sys:{}
				},function(res){
					areaName.push(res.region.name);
					if(typeof callback === 'function') callback();
				});
			}
			var setAreaCache = function(id, name){
				$storage.setLocalStorage('SQZ_area', JSON.stringify({
					id: id,
					name: name
				}));
			}

			$scope.fn = {
				uploadFile: function(file){
					if(file){
						if( file.size < (2 * 1024 * 1024) ){
							$publicService.getUploadToken({
								sys: {
									token: $scope.commonFn.getToken(),
									terminal: $scope.commonFn.getDevice()
								}
							}, function(uploadToken){
								$upload.upload({
									url: 'http://filetest.54jeunesse.com:8088/file/fileService/upload',
									data: {
										token: uploadToken.token,
										file: file
									}
								}).success(function(res){
									$publicService.getPicture({
										noName: res.result.fileNames[0],
										sys: {
											token: $scope.commonFn.getToken(),
											terminal: $scope.commonFn.getDevice()
										}
									}, function(imageRes){
										$userService.modifyUser({
											user: {
												head: res.result.fileNames[0]
											},
											sys: {
												token: $scope.commonFn.getToken()
											}
										}, function(modifyUserRes){
											$scope.commonFn.alertMsg(null, '上传头像成功');
										});
										$scope.thumbnail = imageRes;
									});
								});
							});
						}else{
							$scope.commonFn.alertMsg(null, '您上传的图片太大，请使用2M以下的图片。');
						}
					}
				}
			}

			$userService.getUser({
				noName: param.userId || $storage.getLocalStorage('SQZ_userId'),
				sys: {
					token: $scope.commonFn.getToken(),
					terminal: $scope.commonFn.getDevice()
				}
			}, function(res){
				var areaCache = JSON.parse($storage.getLocalStorage('SQZ_area'));
				if( areaCache && areaCache.id == [res.user.provinceId, res.user.cityId, res.user.distId].join(',') ){
					res.user.areaName = areaCache.name;
				}else{
					if( res.user.provinceId ){
						getAreaName(res.user.provinceId, function(){
							if( res.user.cityId ){
								getAreaName(res.user.cityId, function(){
									if( res.user.distId ){
										getAreaName(res.user.distId, function(){
											res.user.areaName = areaName.join(' - ');
											setAreaCache([res.user.provinceId, res.user.cityId, res.user.distId].join(','), res.user.areaName);
										});
									}else{
										res.user.areaName = areaName.join(' - ');
										setAreaCache([res.user.provinceId, res.user.cityId, '0'].join(','), res.user.areaName);
									}
								});
							}else{
								res.user.areaName = areaName.join(' - ');
								setAreaCache([res.user.provinceId, '0', '0'].join(','), res.user.areaName);
							}
						});
					}
				}
				
				if( res.user.schoolId ){
					var schoolCache = JSON.parse($storage.getLocalStorage('SQZ_school'));
					if( schoolCache && schoolCache.id == res.user.schoolId ){
						res.user.schoolName = schoolCache.name;
					}else{
						$publicService.getOneSchool({
							noName: res.user.schoolId,
							sys:{}
						},function(schoolRES){
							res.user.schoolName = schoolRES.school.name;
							$storage.setLocalStorage('SQZ_school', JSON.stringify({id: res.user.schoolId, name: schoolRES.school.name}));
						});
					}
				}
				if( res.user.head ){
					$publicService.getPicture({
						noName: res.user.head,
						sys: {
							token: $scope.commonFn.getToken(),
							terminal: $scope.commonFn.getDevice()
						}
					}, function(imageRes){
						$scope.thumbnail = imageRes;
					});
				}
				
				$scope.userInfo = res.user;
			});
		}
	]);
})();