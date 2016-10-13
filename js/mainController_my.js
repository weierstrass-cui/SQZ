// 个人资料，我的
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	var taskTypeList = [{id: '0',name: '不详'},{id: '1',name: '兼职'},{id: '2',name: '实习'},{id: '3',name: '找事'},{id: '4',name: '校招'}];
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
				var schoolCache = JSON.parse($storage.getLocalStorage('SQZ_schoolList')) || [];
				if( schoolCache.length > 0 ){
					$scope.schoolList = schoolCache;
				}else{
					$publicService.getSchoolList({
						sys:{}
					}, function(res){
						$scope.schoolList = res.school;
						$storage.setLocalStorage('SQZ_schoolList', JSON.stringify($scope.schoolList));
					});
				}
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
	// 我的收藏
	mainCtrl.controller('myCollectionController', ['$scope', '$userService', '$storage', '$companyService',
		function($scope, $userService, $storage, $companyService){
			var favoritesCache = JSON.parse($storage.getLocalStorage('SQZ_favorites')) || {},
				newFavoritesCache = {},
				someOneOnRemove = false;
			$scope.fn = {
				filter: function(item){
					return !item.isRemove || item.isRemove != 1;
				},
				showRemoveBtn: function(item){
					item.isOnRemove = true;
					someOneOnRemove = true;
				},
				checkIsRemove: function(item){
					if( someOneOnRemove ){
						var url = item.url;
						item.url = '';
						for(var i in $scope.favoritesList){
							$scope.favoritesList[i].isOnRemove = false;
						}
						setTimeout(function(){
							item.url = url;
						}, 10);
						someOneOnRemove = false;
					}
				},
				hideRemoveItem: function(){
					if( someOneOnRemove ){
						for(var i in $scope.favoritesList){
							$scope.favoritesList[i].isOnRemove = false;
						}
						someOneOnRemove = false;
					}
				},
				removeFavorit: function(item){
					$scope.commonFn.confirmMsg(null, '确定删除这条收藏吗？', function(){
						$companyService.unSetFavorite({
							noName: item.id,
							sys: {
								terminal: $scope.commonFn.getDevice(),
								token: $scope.commonFn.getToken()
							}
						}, function(res){
							item.isRemove = 1;
						});
					});
				}
			}
			$userService.getMyCollection({
				condition: {
					method: 'refresh',
					id: $storage.getLocalStorage('SQZ_userId')
				},
				sys: {
					offset: 0,
					limit: 99,
					terminal: $scope.commonFn.getDevice(),
					token: $scope.commonFn.getToken()
				}
			}, function(res){
				for(var i in res.favorites){
					if( favoritesCache && favoritesCache['f' + res.favorites[i].targetId] ){
						newFavoritesCache['f' + res.favorites[i].targetId] = res.favorites[i] = favoritesCache['f' + res.favorites[i].targetId];
					}else{
						(function(favoritObj){
							$companyService.getJobDetail({
								noName: $storage.getLocalStorage('SQZ_userId') + '/' + favoritObj.targetId,
								sys: {
									terminal: $scope.commonFn.getDevice()
								}
							}, function(taskRes){
								favoritObj.taskTypeName = taskTypeList[favoritObj.taskType].name;
								favoritObj.corpName = taskRes.task.corpName;
								favoritObj.addr = taskRes.task.addr;
								favoritObj.distName = taskRes.task.distName;
								favoritObj.dateFrom = taskRes.task.dateFrom;
								favoritObj.dateTo = taskRes.task.dateTo;
								favoritObj.salary = taskRes.task.salary;
								favoritObj.payUnit = taskRes.task.payUnit;
								favoritObj.url = '#jobDetails?' + $scope.commonFn.buildParamsForUrl({
									jobId: favoritObj.targetId
								});
								newFavoritesCache['f' + favoritObj.targetId] = favoritObj;
								$storage.setLocalStorage('SQZ_favorites', JSON.stringify(newFavoritesCache));
							});
						})(res.favorites[i]);
					}
				}
				$scope.favoritesList = res.favorites;
			});
		}
	]);
	// 我的实兼轴
	mainCtrl.controller('myWorkAxisController', ['$scope', '$userService', '$storage', '$companyService',
		function($scope, $userService, $storage, $companyService){
			var myListCache = JSON.parse($storage.getLocalStorage('SQZ_myTimeList')) || {},
				newMyListCache = {};
			$userService.getMySQZ({
				condition: {
					id: 0,
					method: 'load'
				},
				sys:{
					offset: 0,
					limit: 99,
					token: $scope.commonFn.getToken(),
					terminal: $scope.commonFn.getDevice()
				}
			}, function(res){
				for(var i in res.myTimeList){
					if( myListCache && myListCache['l' + res.myTimeList[i].id] ){
						newMyListCache['l' + res.myTimeList[i].id] = res.myTimeList[i] = myListCache['l' + res.myTimeList[i].id];
					}else{
						(function(myListObj){
							$companyService.getJobDetail({
								noName: $storage.getLocalStorage('SQZ_userId') + '/' + myListObj.taskId,
								sys: {
									terminal: $scope.commonFn.getDevice()
								}
							}, function(taskRes){
								myListObj.taskTypeName = taskTypeList[myListObj.taskType].name;
								myListObj.taskName = taskRes.task.name;
								myListObj.url = '#jobDetails?' + $scope.commonFn.buildParamsForUrl({
									jobId: myListObj.taskId
								});
								newMyListCache['l' + myListObj.id] = myListObj;
								$storage.setLocalStorage('SQZ_myTimeList', JSON.stringify(newMyListCache));
							});
						})(res.myTimeList[i]);
					}
					
					res.myTimeList[i].taskTypeName = taskTypeList[res.myTimeList[i].taskType].name;
				}
				$scope.myTimeList = res.myTimeList;
			});
		}
	]);
})();