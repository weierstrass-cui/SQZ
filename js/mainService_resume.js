(function(){
	if( mainCtrl == ''){
		console.log('mainCtrl 加载出错');
		return;
	}
	// 个人资料相关接口
	mainCtrl.factory('$resumeService', ['$request', function(request){
		return {
			getResume:function(obj, callback){
				request.post('/userService/showSelf', obj, callback);
			},
			modifyResume: function(obj, callback){
				request.post('/userService/v10/resume', obj, callback);
			},
			sendResumeAsMail: function(obj, callback){
				request.post('/task/v10/send/resumes/myself', obj, callback);
			}
		}
	}]);
})();