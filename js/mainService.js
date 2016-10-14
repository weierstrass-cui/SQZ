(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	mainCtrl.factory('$publicService', ['$request', function(request){
		return {
			getCode: function(obj, callback){
				request.post('/userService/getCaptcha', obj, callback, {ignorLogin: true});
			},
			getAreaList: function(obj, callback){
				request.post('/regionService/children', obj, callback, {ignorLogin: true});
			},
			getOneArea: function(obj, callback){
				request.post('/regionService/find', obj, callback, {ignorLogin: true});
			},
			getSchoolList: function(obj, callback){
				request.post('/schoolService/findAll', obj, callback, {ignorLogin: true});
			},
			getOneSchool: function(obj, callback){
				request.post('/schoolService/find', obj, callback, {ignorLogin: true});
			},
			getUploadToken: function(obj, callback){
				request.post('/fileService/getToken', obj, callback, {ignorLogin: true});
			},
			getPicture: function(obj, callback){
				request.post('/fileService', obj, callback, {ignorLogin: true});
			},
		}
	}]);
	mainCtrl.factory('$loginService', ['$request', function(request){
		return {
			login: function(obj, callback){
				request.post('/userService/login', obj, callback, {ignorLogin: true});
			}
		}
	}]);
	mainCtrl.factory('$getBackPsdService', ['$request', function(request){
		return {
			getBackPsd: function(obj, callback){
				request.post('/userService/v10/resetPass', obj, callback, {ignorLogin: true});
			}
		}
	}]);
	mainCtrl.factory('$registerService', ['$request', function(request){
		return {
			registerRecommend:function(obj, callback){
				request.post('/userService/regWithPass', obj, callback, {ignorLogin: true});
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
			},
			getMyCollection: function(obj, callback){
				request.post('/userService/favoriteList', obj, callback);
			},
			getMySQZ: function(obj, callback){
				request.post('/task/v10/myTimeList', obj, callback);
			}
		}
	}]);
})();