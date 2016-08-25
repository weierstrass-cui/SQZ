(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}

	mainCtrl.factory('$loginService', ['$request', function(request){
		return {

		}
	}]);
	mainCtrl.factory('$registerService', ['$request', function(request){
		return {
			getCode: function(obj, callback){
				request.post('/userService/getCaptcha', obj, callback);
			},
			registerRecommend:function(obj, callback){
				request.post('/api/saleActivity/getActiviInforRecommend', obj, callback);
			}
		}
	}]);
	
})();