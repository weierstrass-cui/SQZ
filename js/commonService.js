(function(){
	var localUrl = 'http://apptest.54jeunesse.com:8088/part';
	/*var localUrl = 'http://120.26.122.173:8000/app';*/

	// 重写 Date的toJSON方法，满足后台对日期格式的需求
	// 1990-12-31T00:00:00Z
	var addZero = function(num){
		return num < 10 ? ('0' + num) : num;
	}
	Date.prototype.toJSON = function(){
		var str = this.getFullYear() + '-';
			str += addZero(this.getMonth() + 1) + '-';
			str += addZero(this.getDate()) + 'T';
			str += addZero(this.getHours()) + ':';
			str += addZero(this.getMinutes()) + ':';
			str += addZero(this.getSeconds()) + 'Z';
		return str;
	}
	// 远程请求
	mainCtrl.factory('$request', ['$rootScope', '$http', '$storage', function($rootScope, $http, $storage){
		var formatDateInObjectToString = function(object){
			for(var i in object){
				if(typeof object[i] === 'object'){
					formatDateInObjectToString(object[i]);
					continue;
				}
				if( typeof object[i] === 'string' && object[i].indexOf('GMT') == 26 ){
					object[i] = new Date(object[i]).toJSON();
				}
			}
		}
		var isOnError = false;
		return {
			getLocalURL: function(){
				return localUrl;
			},
			post: function(fnName, json, callback, parm, showLoading){
				if( !$storage.getLocalStorage('insuranceId') ){
					$rootScope.$broadcast('onError', {title: '参数错误',  message: '未设置保险公司ID'});
					return false;
				}
				if( !$storage.getLocalStorage('openId') ){
					$rootScope.$broadcast('onError', {title: '参数错误',  message: '未设置用户OPENID'});
					return false;
				}

				var postData = {
					object: json,
					insuranceId: $storage.getLocalStorage('insuranceId'),
					openId: $storage.getLocalStorage('openId'),
					userId: $storage.getLocalStorage('userId') || ' ',
					ajax: 1
				};

				if( showLoading !== false){
					$rootScope.isLoadingData = true;
				}
				var transform = function(data){
				    return $.param(data);
				}
				// formatDateInObjectToString(data);
				$http.post(localUrl + fnName, {data: JSON.stringify(postData)+ '/sys;terminal=' + device }, {
				    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				    transformRequest: transform
				})
				.success(function(res){
					if( res.ifSuccess == 'Y' ){
						if(typeof callback === 'function'){
							callback(res.object);
						}
					}else{
						if( !isOnError ){
							isOnError = true;
							$rootScope.$broadcast('onError', {title: '系统错误',  message: res.description});
							setTimeout(function(){
								isOnError = false;
							}, 3000);
						}
					}
					if( showLoading !== false){
						$rootScope.isLoadingData = false;
					}
				})
				.error(function(data, status){
					$rootScope.$broadcast('onError', {title: '系统错误',  message: 'Oops~~ 你的数据被外星人劫持了~~'});
					if( showLoading !== false){
						$rootScope.isLoadingData = false;
					}
				});
			},
			setPublicParm: function(key, value){
				if( typeof key === 'string' && value ){
					$storage.setLocalStorage(key, value);
				}else if( typeof key === 'object' ){
					for(var i in key){
						$storage.setLocalStorage(i, key[i]);
					}
				}else{
					$rootScope.$broadcast('onError', {title: '参数出错',  message: '设置的功能参数不正确'});
				}
			}
		}
	}]);
	// 本地存储
	mainCtrl.factory('$storage', [function(){
		return {
			getLocalStorage: function(key){
				return localStorage.getItem(key) || null;
			},
			setLocalStorage: function(key, value){
				localStorage.setItem(key, value);
				return this.getLocalStorage(key) || null;
			},
			removeLocalStorage: function(key){
				localStorage.removeItem(key);
				return this.getLocalStorage(key) || null;
			}
		}
	}]);
	// 字典
	mainCtrl.factory('$dictionary', ['$request', function(request){
		return {
			getDictionary: function(json, callback){
				request.post('/api/dictionary/getDict', json, callback);
			}
		}
	}]);
})();