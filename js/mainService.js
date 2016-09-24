(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	mainCtrl.factory('$publicService', ['$request', function(request){
		return {
			getCode: function(obj, callback){
				request.post('/userService/getCaptcha', obj, callback);
			}
		}
	}]);
	mainCtrl.factory('$loginService', ['$request', function(request){
		return {
			login: function(obj, callback){
				request.post('/userService/login', obj, callback);
			}
		}
	}]);
	mainCtrl.factory('$getBackPsdService', ['$request', function(request){
		return {
			getBackPsd: function(obj, callback){
				request.post('/userService/v10/resetPass', obj, callback);
			}
		}
	}]);
	mainCtrl.factory('$registerService', ['$request', function(request){
		return {
			registerRecommend:function(obj, callback){
				request.post('/userService/regWithPass', obj, callback);
			}

		}
	}]);
	// 个人资料相关接口
	mainCtrl.factory('$userService', ['$request', function(request){
		return {
			getUser:function(obj, callback){
				request.post('/userService/showSelf', obj, callback);
			},
			modifyUser: function(obj, callback){
				request.post('/userService/modify', obj, callback);
			}
		}
	}]);
})();