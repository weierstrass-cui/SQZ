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
				resumeCache.resumeData.birthDay = resumeCache.resumeData.birthDay ? new Date(resumeCache.resumeData.birthDay) : '',
				$scope.userInfo = resumeCache.resumeData;
			}
		}
	]);
	mainCtrl.controller('resumeInfoEditController', ['$scope', '$resumeService', '$storage','$publicService',
		function($scope, $resumeService,$storage, $publicService){
			console.log('123');
			var param = $scope.commonFn.getParamsFromUrl();
			console.log(param);
			$scope.userInfo = param;
			if( $scope.userInfo.load == 'school' ){
				$publicService.getSchoolList({
					sys:{}
				}, function(res){
					$scope.schoolList = res.school;
				});
			}else if( $scope.userInfo.load == 'education' ){
				// 0/不详；1/专科；2/本科；3/硕士；4/博士
				$scope.educationList = [{
					id: '0',
					name: '不详'
				},{
					id: '1',
					name: '专科'
				},{
					id: '2',
					name: '本科'
				},{
					id: '3',
					name: '硕士'
				},{
					id: '4',
					name: '博士'
				}];
			}else if( $scope.userInfo.load == 'political' ){
				$scope.politicalList = [{
					name: '党员'
				},{
					name: '团员'
				},{
					name: '群众'
				},{
					name: '其他'
				}];
			}else if( $scope.userInfo.load == 'taskType' ){
				// 0/无，1/兼职；2/实习
				$scope.taskTypeList = [{
					id: '0',
					name: '不详'
				},{
					id: '1',
					name: '兼职'
				},{
					id: '2',
					name: '实习'
				}]
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
						taskType: taskTypeName
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