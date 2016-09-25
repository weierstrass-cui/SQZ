// 简历相关内容
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	// 我的简历
	mainCtrl.controller('myResumeController', ['$scope', '$resumeService','$storage','$publicService',
		function($scope, $resumeService,$storage,$publicService){
			$resumeService.getResume({
				sys: {
					token: $scope.commonFn.getToken(),
					terminal: $scope.commonFn.getDevice()
				}
			}, function(res){
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
				$scope.userInfo = res.user;
			});
		}
	]);
	mainCtrl.controller('resumeInfoEditController', ['$scope', '$resumeService',
		function($scope, $resumeService){
			$scope.userInfo = $scope.commonFn.getParamsFromUrl();
			
			$scope.fn = {
				cancel: function(){
					$scope.commonFn.goLastView();
				},
				submit: function(keys, value){
					for(var i in $scope.userInfo){
						if( !$scope.userInfo[i] ){
							$scope.commonFn.alertMsg(null, keys[i]);
							return;
						}
					}

					$resumeService.modifyResume({
						user: $scope.userInfo,
						sys: {
							token: $scope.commonFn.getToken()
						}
					}, function(res){
						$scope.commonFn.goLastView();
					});
				}
			}
		}
	]);
})();