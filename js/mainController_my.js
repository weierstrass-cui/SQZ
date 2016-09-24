// 个人资料，我的
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
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
							$scope.commonFn.goView('/userInfoEdit');
						});
					}
				},
				cancel: function(){
					$scope.commonFn.goLastView();
				},
				submit: function(keys, value){
					for(var i in $scope.userInfo){
						if( !$scope.userInfo[i] ){
							$scope.commonFn.alertMsg(null, keys[i]);
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
	mainCtrl.controller('myCollectionController', ['$scope', 
		function($scope){
			$scope.fn = {
				showRemoveBtn:function(e){
					
				}
			}
		}
	]);
})();