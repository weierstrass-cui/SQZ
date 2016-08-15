
(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}

	mainCtrl.controller('loginController', ['$scope', 
		function($scope){
			console.log('login')
		}
	]);
})();
