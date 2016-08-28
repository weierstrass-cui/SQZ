(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}

	mainCtrl.factory('$loginService', ['$request', function(request){
		return {
			login: function(obj, callback){
				request.post('/userService/login/map', obj, callback);
			}
		}
	}]);
	mainCtrl.factory('$getBackPsdService', ['$request', function(request){
		return {
			getCode: function(obj, callback){
				request.post('/userService/getCaptcha', obj, callback);
			},
			getBackPsd: function(obj, callback){
				request.post('/userService/v10/resetPass/map', obj, callback);
			}
		}
	}]);
	mainCtrl.factory('$registerService', ['$request', function(request){
		return {
			getDeviceType: function(){
				return request.getDeviceType();
			},
			getCode: function(obj, callback){
				request.post('/userService/getCaptcha', obj, callback);
			},
			registerRecommend:function(obj, callback){
				request.post('/userService/reg/user', obj, callback);
			}

		}
	}]);
	
})();