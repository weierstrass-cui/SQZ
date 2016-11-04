// 企业相关
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	var taskTypeList = [{id: '0',name: '不详'},{id: '1',name: '兼职'},{id: '2',name: '实习'},{id: '3',name: '找事'},{id: '4',name: '校招'}];
	// 公司详情
	mainCtrl.controller('companyDetailController', ['$scope', '$companyService', '$storage',
		function($scope, $companyService, $storage){
			// var geolocation = new BMap.Geolocation();
			var param = $scope.commonFn.getParamsFromUrl();
			var userId = $storage.getLocalStorage('SQZ_userId') || '0',
				jobListCache = JSON.parse($storage.getLocalStorage('SQZ_jobList')) || {};
			// geolocation.getCurrentPosition(function(pos){
				$companyService.getCompanyDetail({
					condition: {
						userId: userId,
						corpId: param.corpId,
						// pt: pos.latitude + ',' + pos.longitude
						pt: '31.22,121.48'
					},
					sys: {
						terminal: $scope.commonFn.getDevice()
					}
				}, function(res){
					res.corp.descr = res.corp.descr ? res.corp.descr.replace(/\\n/gi, '<br />') : '暂无介绍'
					$scope.corpInfo = res.corp;
					$scope.jobList = res.search.result.query.response.docs;
					for(var i in $scope.jobList){
						if( jobListCache && jobListCache['j' + $scope.jobList[i].id] ){
							$scope.jobList[i] = jobListCache['j' + $scope.jobList[i].id];
						}else{
							$scope.jobList[i].taskTypeName = taskTypeList[$scope.jobList[i].taskType].name;
							(function(obj){
								$companyService.getJobDetail({
									noName: userId + '/' + obj.id,
									sys: {
										terminal: $scope.commonFn.getDevice()
									}
								}, function(taskRes){
									obj.distName = taskRes.task.distName;
									obj.addr = taskRes.task.addr;
									jobListCache['j' + obj.id] = obj;
									$storage.setLocalStorage('SQZ_jobList', JSON.stringify(jobListCache));
								});
							})($scope.jobList[i]);
						}
					}
				});
			// });
		}
	]);

	// 职位详情
	mainCtrl.controller('jobDetailController', ['$scope', '$companyService', '$storage', '$publicService', '$resumeService',
		function($scope, $companyService, $storage, $publicService, $resumeService){
			var param = $scope.commonFn.getParamsFromUrl();
			var enrollId = null, taskType = null, favoriteId = null;
			var userId = $storage.getLocalStorage('SQZ_userId') || '0';
			var trackEventName = '';
			$scope.isEnroll = false;
			$scope.isFavorite = true;
			$scope.workTypeName = param.workTypeName;
			$scope.hasResume = false;
			var checkResume = function(res){
				var isEmptyResume = (false || res.name == '');
					isEmptyResume = (isEmptyResume || res.gender == '');
					isEmptyResume = (isEmptyResume || res.birthDay == '');
					isEmptyResume = (isEmptyResume || res.resumePhone == '');
					isEmptyResume = (isEmptyResume || res.email == '');
					isEmptyResume = (isEmptyResume || res.schoolId == '');
					isEmptyResume = (isEmptyResume || res.education == '');
					isEmptyResume = (isEmptyResume || res.political == '');
					isEmptyResume = (isEmptyResume || res.taskType == '');
					isEmptyResume = (isEmptyResume || res.experience == '');
				return isEmptyResume;
			}
			$resumeService.getResume({
				sys: {
					token: $scope.commonFn.getToken(),
					terminal: $scope.commonFn.getDevice()
				}
			}, function(res){
				$scope.hasResume = checkResume(res);
			});

			$scope.fn = {
				cancelEnroll: function(){
					if( !enrollId ){
						$scope.commonFn.alertMsg(null, '暂时不能取消报名，请稍后重试');
						return;
					}
					$companyService.cancelEnroll({
						noName: enrollId,
						sys: {
							token: $scope.commonFn.getToken()
						}
					}, function(res){
						$scope.commonFn.alertMsg(null, '已为您取消报名', function(){
							$scope.isEnroll = false;
						});
					});
				},
				enroll: function(){
					if( !$scope.hasResume ){
						$scope.commonFn.alertMsg(null, '报名前请先完善您的简历', function(){
							$scope.commonFn.goView('/myResume');
						});
						return;
					}
					$companyService.enroll({
						noName: param.jobId,
						sys: {
							token: $scope.commonFn.getToken()
						}
					}, function(res){
						enrollId = res.enroll.id;
						$scope.isEnroll = true;
						$scope.commonFn.alertMsg(null, '恭喜您报名成功');
						if( $scope.commonFn.getTracker() ) $scope.commonFn.getTracker().push(['trackEvent', '报名职位', trackEventName]);
						$companyService.sendResumeAfterEnroll({
							noName: enrollId,
							sys: {
								terminal: $scope.commonFn.getDevice()
							}
						}, function(sendResumeRes){
							
						});
					});
				},
				setFavorite: function(){
					$companyService.setFavorite({
						map: {
							taskType: taskType,
							targetId: param.jobId
						},
						sys: {
							terminal: $scope.commonFn.getDevice(),
							token: $scope.commonFn.getToken()
						}
					}, function(res){
						favoriteId = res.favoriteId;
						$scope.isFavorite = true;
						$scope.commonFn.alertMsg(null, '收藏成功');
						if( $scope.commonFn.getTracker() ) $scope.commonFn.getTracker().push(['trackEvent', '收藏职位', trackEventName]);
					});
				},
				unSetFavorite: function(){
					if( !favoriteId ){
						$scope.commonFn.alertMsg(null, '暂时不能取消收藏，请稍后重试');
						return;
					}
					$scope.commonFn.confirmMsg(null, '确定删除这条收藏吗？', function(){
						$companyService.unSetFavorite({
							noName: favoriteId,
							sys: {
								terminal: $scope.commonFn.getDevice(),
								token: $scope.commonFn.getToken()
							}
						}, function(res){
							$scope.isFavorite = false;
							$scope.commonFn.alertMsg(null, '取消收藏成功');
						});
					});
				}
			}

			$companyService.getJobDetail({
				noName: userId + '/' + param.jobId,
				sys: {
					terminal: $scope.commonFn.getDevice()
				}
			}, function(res){
				taskType = res.task.taskType;
				res.task.taskTypeName = taskTypeList[res.task.taskType].name;
				res.task.miaoshu = '';
				res.task.yaoqiu = '';
				for(var i in res.task.descr ){
					switch( res.task.descr[i].title ){
						case '工作内容':
							res.task.miaoshu += res.task.descr[i].value;
							break;
						case '工作要求':
							res.task.yaoqiu += res.task.descr[i].value;
							break;
					}
				}
				if( res.enrollId != 0 ){
					$scope.isEnroll = true;
					enrollId = res.enrollId;
				}
				
				if( res.favoriteId == 0 ){
					$scope.isFavorite = false;
				}else{
					favoriteId = res.favoriteId;
				}
				$scope.taskInfo = res.task;
				trackEventName = $scope.taskInfo.corpName + ':' + $scope.taskInfo.name;
				if( $scope.commonFn.getTracker() ) $scope.commonFn.getTracker().push(['trackEvent', '查看职位', trackEventName]);
			});
		}
	]);
})();