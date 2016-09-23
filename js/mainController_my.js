// 个人资料，我的
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	mainCtrl.controller('userNameEditController', ['$scope', '$storage',
		function($scope,$storage){
			$scope.fn = {
				cancel:function(){
					$scope.commonFn.goLastView();
				},
				submit:function(){
					$storage.setLocalStorage('nickName',$scope.userNameEdit);
					$scope.commonFn.goLastView('userInfoEdit');
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