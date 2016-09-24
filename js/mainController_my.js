// 个人资料，我的
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	mainCtrl.controller('userInfoEditController', ['$scope', '$storage', '$userService',
		function($scope,$storage,$userService){
			$scope.userInfo = $scope.commonFn.getParamsFromUrl();
			$scope.fn = {
				setGender: function(gender){
					$scope.userInfo.gender = gender;
				},
				cancel: function(){
					$scope.commonFn.goLastView();
				},
				submit: function(keys){
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