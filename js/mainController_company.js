// 企业相关
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	var taskTypeList = [{id: '0',name: '不详'},{id: '1',name: '兼职'},{id: '2',name: '实习'},{id: '3',name: '找事'}];
	// 公司详情
	mainCtrl.controller('companyDetailController', ['$scope', '$companyService', '$storage', '$publicService',
		function($scope, $companyService, $storage, $publicService){
			var geolocation = new BMap.Geolocation(),
				param = $scope.commonFn.getParamsFromUrl();
			geolocation.getCurrentPosition(function(pos){
				$companyService.getCompanyDetail({
					condition: {
						userId: $storage.getLocalStorage('SQZ_userId'),
						corpId: param.corpId,
						pt: pos.latitude + ',' + pos.longitude
					},
					sys: {
						terminal: $scope.commonFn.getDevice()
					}
				}, function(res){
					$scope.corpInfo = res.corp;
					$scope.jobList = res.search.result.query.response.docs;
					for(var i in $scope.jobList){
						$scope.jobList[i].taskTypeName = taskTypeList[$scope.jobList[i].taskType].name;
						(function(obj){
							$publicService.getOneArea({
								noName: obj.distId,
								sys:{}
							},function(area){
								obj.distName = area.region.name;
							});
						})($scope.jobList[i]);
					}
				});
			});
		}
	]);

	// 职位详情
	mainCtrl.controller('jobDetailController', ['$scope', '$companyService', '$storage', '$publicService',
		function($scope, $companyService, $storage, $publicService){
			var param = $scope.commonFn.getParamsFromUrl();
			var enrollId = null, taskType = null, favoriteId = null;
			var userId = $storage.getLocalStorage('SQZ_userId') || '0';
			$scope.isEnroll = false;
			$scope.isFavorite = true;
			$scope.workTypeName = param.workTypeName;
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
					$companyService.enroll({
						noName: param.jobId,
						sys: {
							token: $scope.commonFn.getToken()
						}
					}, function(res){
						enrollId = res.enroll.id;
						$scope.isEnroll = true;
						$scope.commonFn.alertMsg(null, '恭喜您报名成功');
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
					}
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
				if( res.enrollList.length > 0 ){
					$scope.isEnroll = true;
					enrollId = res.enrollList[0].id;
				}
				
				if( res.favoriteId == 0 ){
					$scope.isFavorite = false;
				}else{
					favoriteId = res.favoriteId;
				}
				$scope.taskInfo = res.task;
			});
		}
	]);
})();