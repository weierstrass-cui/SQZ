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
			}
		}
	}]);
})();