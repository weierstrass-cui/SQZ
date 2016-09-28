(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	// 企业，职位相关接口
	mainCtrl.factory('$companyService', ['$request', function(request){
		return {
			getCompanyDetail:function(obj, callback){
				request.post('/task/v10/corpDetail', obj, callback);
			},
			getJobDetail:function(obj, callback){
				request.post('/task/v10/viewTask', obj, callback);
			},
			enroll:function(obj, callback){
				request.post('/task/v10/enroll', obj, callback);
			},
			cancelEnroll:function(obj, callback){
				request.post('/task/v10/cancelEnroll', obj, callback);
			},
			setFavorite:function(obj, callback){
				request.post('/userService/favorite', obj, callback);
			},
			unSetFavorite:function(obj, callback){
				request.post('/userService/cancelFavorite', obj, callback);
			}
		}
	}]);
})();