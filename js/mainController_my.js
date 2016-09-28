// 个人资料，我的
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	var taskTypeList = [{id: '0',name: '不详'},{id: '1',name: '兼职'},{id: '2',name: '实习'},{id: '3',name: '找事'}];
	// 个人资料编辑所有页面通用
	mainCtrl.controller('userInfoEditController', ['$scope', '$storage', '$userService','$publicService',
		function($scope,$storage,$userService,$publicService){
			$scope.userInfo = $scope.commonFn.getParamsFromUrl();
			if( $scope.userInfo.load == 'area' ){
				$publicService.getAreaList({
					noName: $scope.userInfo.areaId,
					sys:{}
				}, function(res){
					var step = $scope.userInfo.step - 0;
					if( step < 3 ){
						for(var i in res.list){
							var data = {
								load: 'area',
								areaId: res.list[i].id,
								step: (step + 1)
							}
							data.areaList = $scope.userInfo.areaList ? ($scope.userInfo.areaList + ',' + data.areaId) : data.areaId;
							res.list[i].param = '#districtSelEdit?' + $scope.commonFn.buildParamsForUrl(data);
						}
					}
					
					$scope.areaList = res.list;
				});
			}else if( $scope.userInfo.load == 'school' ){
				$publicService.getSchoolList({
					sys:{}
				}, function(res){
					$scope.schoolList = res.school;
				});
			}
			$scope.filter = {
				schoolFilter: function(item){
					return !$scope.schoolFilterKey || item.name.indexOf($scope.schoolFilterKey) != '-1';
				}
			}
			$scope.fn = {
				setGender: function(gender){
					$scope.userInfo.gender = gender;
				},
				setArea: function(areaId){
					if( $scope.userInfo.step == 3 ){
						var areaList = $scope.userInfo.areaList.split(','),
							data = {
								provinceId: areaList[0],
								cityId: areaList[1],
								distId: areaId
							};
						$userService.modifyUser({
							user: data,
							sys: {
								token: $scope.commonFn.getToken()
							}
						}, function(res){
							$scope.commonFn.goView('/userInfoEdit', true);
						});
					}
				},
				setSchool: function(schoolId){
					$userService.modifyUser({
						user: {
							schoolId: schoolId
						},
						sys: {
							token: $scope.commonFn.getToken()
						}
					}, function(res){
						$scope.commonFn.goView('/userInfoEdit', true);
					});
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
					}

					$userService.modifyUser({
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
	mainCtrl.controller('myCollectionController', ['$scope', '$userService', '$storage',
		function($scope, $userService, $storage){
			$userService.getMyCollection({
				condition: {
					method: 'refresh',
					id: $storage.getLocalStorage('SQZ_userId')
				},
				sys: {
					offset: 0,
					limit: 5,
					terminal: $scope.commonFn.getDevice(),
					token: $scope.commonFn.getToken()
				}
			}, function(res){
				for(var i in res.favorites){
					res.favorites[i].taskTypeName = taskTypeList[res.favorites[i].taskType].name;
				}
				$scope.favoritesList = res.favorites;
			});
		}
	]);
})();