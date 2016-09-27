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
			$companyService.getJobDetail({
				noName: '0/1',
				sys: {
					terminal: $scope.commonFn.getDevice()
				}
			}, function(res){
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
				$scope.taskInfo = res.task;
				console.log($scope.taskInfo);
			});
		}
	]);
})();