// 简历相关内容
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	var educationList = [{id: '0',name: '不详'},{id: '1',name: '专科'},{id: '2',name: '本科'},{id: '3',name: '硕士'},{id: '4',name: '博士'}],
		politicalList = [{name: '党员'},{name: '团员'},{name: '群众'},{name: '其他'}],
		taskTypeList = [{id: '0',name: '不详'},{id: '1',name: '兼职'},{id: '2',name: '实习'},{id: '3',name: '找事'}];
	// 我的简历
	mainCtrl.controller('myResumeController', ['$scope', '$resumeService','$storage','$publicService',
		function($scope, $resumeService,$storage,$publicService){
			var resumeCache = JSON.parse($storage.getLocalStorage('SQZ_resume'));

			$scope.fn = {
				saveResume: function(){
					if( resumeCache.isChange == '1' ){
						$resumeService.modifyResume({
							user: resumeCache.resumeData,
							sys: {
								token: $scope.commonFn.getToken()
							}
						}, function(res){
							console.log(res);
						});
					}
				},
				viewResume: function(){

				}
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
						birthDay: res.user.birthDay,
						birthDayFack: res.user.birthDay ? new Date(res.user.birthDay) : '',
						resumePhone: res.user.resumePhone,
						email: res.user.email,
						schoolId: res.user.schoolId,
						schoolName: res.user.schoolName,
						education: res.user.education,
						educationName: educationList[res.user.education].name,
						political: res.user.political,
						taskType: res.user.taskType,
						taskTypeName: taskTypeList[res.user.taskType].name,
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
				resumeCache.resumeData.birthDayFack = resumeCache.resumeData.birthDay ? new Date(resumeCache.resumeData.birthDay) : '',
				$scope.userInfo = resumeCache.resumeData;
			}
		}
	]);
	// 简历编辑通用方法
	mainCtrl.controller('resumeInfoEditController', ['$scope', '$resumeService', '$storage','$publicService',
		function($scope, $resumeService,$storage, $publicService){
			var param = $scope.commonFn.getParamsFromUrl();
			$scope.userInfo = param;
			if( $scope.userInfo.load == 'school' ){
				$publicService.getSchoolList({
					sys:{}
				}, function(res){
					$scope.schoolList = res.school;
				});
			}else if( $scope.userInfo.load == 'education' ){
				$scope.educationList = educationList;
			}else if( $scope.userInfo.load == 'political' ){
				$scope.politicalList = politicalList;
			}else if( $scope.userInfo.load == 'taskType' ){
				$scope.taskTypeList = taskTypeList
			}else if( $scope.userInfo.load == 'experience' ){
				var resumeCache = JSON.parse($storage.getLocalStorage('SQZ_resume'));
				$scope.userInfo.experience = resumeCache.resumeData.experience;
			}

			var updateResumeLocalStorage = function(json){
				var resumeCache = JSON.parse($storage.getLocalStorage('SQZ_resume'));
				if( resumeCache ){
					resumeCache.isChange = '1';
					var resumeData = resumeCache.resumeData;
					for(var i in json){
						resumeData[i] = json[i];
					}
				}
				$storage.setLocalStorage('SQZ_resume', JSON.stringify(resumeCache));
			}
			
			$scope.filter = {
				schoolFilter: function(item){
					return !$scope.schoolFilterKey || item.name.indexOf($scope.schoolFilterKey) != '-1';
				}
			}
			$scope.fn = {
				setGender: function(gender){
					updateResumeLocalStorage({
						gender: gender
					});
					$scope.commonFn.goLastView();
				},
				setSchool: function(schoolId, schoolName){
					updateResumeLocalStorage({
						schoolId: schoolId,
						schoolName: schoolName
					});
					$scope.commonFn.goLastView();
				},
				setEducation: function(eduId, eduName){
					updateResumeLocalStorage({
						education: eduId,
						educationName: eduName
					});
					$scope.commonFn.goLastView();
				},
				setPolitical: function(name){
					updateResumeLocalStorage({
						political: name
					});
					$scope.commonFn.goLastView();
				},
				setTaskType: function(taskTypeId, taskTypeName){
					updateResumeLocalStorage({
						taskType: taskTypeId,
						taskTypeName: taskTypeName
					});
					$scope.commonFn.goLastView();
				},
				cancel: function(){
					$scope.commonFn.goLastView();
				},
				submit: function(keys, value){
					for(var i in $scope.userInfo){
						if( !$scope.userInfo[i] ){
							$scope.commonFn.alertMsg(null, keys[i]);
							return;
						}
						if( i === 'birthDayFack' ){
							$scope.userInfo.birthDay = $scope.userInfo.birthDayFack.toJSON();
						}
					}

					var resumeCache = JSON.parse($storage.getLocalStorage('SQZ_resume'));
					if( resumeCache ){
						resumeCache.isChange = '1';
						var resumeData = resumeCache.resumeData;
						for( var i in $scope.userInfo ){
							resumeData[i] = $scope.userInfo[i];
						}
					}
					$storage.setLocalStorage('SQZ_resume', JSON.stringify(resumeCache));
					$scope.commonFn.goLastView();
				}
			}
		}
	]);
})();