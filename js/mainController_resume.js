// 简历相关内容
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	// 我的简历
	mainCtrl.controller('myResumeController', ['$scope', '$resumeService','$storage','$publicService',
		function($scope, $resumeService,$storage,$publicService){
			var resumeCache = JSON.parse($storage.getLocalStorage('SQZ_resume'));
			var buildNewResume = function(){

			}
			if( !resumeCache ){
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

					var resumeData = {
						name: res.user.name,
						gender: res.user.gender,
						birthDay: res.user.birthDay ? new Date(res.user.birthDay) : '',
						resumePhone: res.user.resumePhone,
						email: res.user.email,
						schoolId: res.user.schoolId,
						schoolName: res.user.schoolName,
						education: res.user.education,
						educationName: res.user.educationName,
						political: res.user.political,
						taskType: res.user.taskType,
						head: res.user.head,
						nation: res.user.nation,
						photo: res.user.photo,
						studying: res.user.studying,
						ability: res.user.ability,
						experience: res.user.experience,
						industryTypeIds: res.user.industryTypeIds
					}
					$storage.setLocalStorage('SQZ_resume', JSON.stringify({
						isChange: '0',
						resumeData: resumeData
					}));
					
					$scope.userInfo = resumeData;
				});
			}else{
				$scope.userInfo = resumeCache.resumeData;
			}
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
				}
			}
		}
	]);
})();