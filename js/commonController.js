var mainCtrl = '';
(function(){	
	mainCtrl = angular.module('starter.controller', ['ngRoute']);
	mainCtrl.controller('main', ['$scope', '$location', '$dictionary', '$storage', '$timeout',
		function($scope, $location, $dictionary, $storage, $timeout){
			$scope.showFloatNav = false;
			$scope.commonStatus = {
				showQuick: false
			}
			$scope.paramsPool = {};
			$scope.currentParams = {};
			$scope.cacheDataPool = {};
			$scope.cacheData = {};
			$scope.publicData = {};
			// for alert
			$scope.isAlert = false;
			$scope.isConfirm = false;
			$scope.$on('onError', function(d, M){
				$scope.commonFn.alertMsg(M.title, M.message, function(){
					if(M.redirt){
						$storage.removeLocalStorage('SQZ_autoLogin');
						$storage.removeLocalStorage('SQZ_userInfo');
						$storage.removeLocalStorage('SQZ_userId');
						$scope.commonFn.goView(M.redirt);
					}
				});
			});

			var currentLocation = {};
			var deviceType = '';
			if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ){
				deviceType = 'ios';
			}else if(/Android/i.test(navigator.userAgent)){
				deviceType = 'android';
			}

			//声明字典字段
			var dictionaryMapping = {
				
			}
			for(var index in dictionaryMapping){
				(function(i){
					$dictionary.getDictionary({dictionaryId: dictionaryMapping[i]}, function(res){
						var json = {};
						for(var j in res){
							json[res[j].value] = res[j].name;
						}
						$scope.commonFn.setDictionaryByKey(i, json);
					});
				})(index);
			}

			$scope.vaildata = {
				//电话号码正则
				checkPhone: function(phone){
					return /^1\d{10}$/.test(phone);
				}
			}

			$scope.commonFn = {
				getTracker: function(){
					try{
						return _paq || null;
					}catch(e){
						return null;
					}
				},
				showFloat: function(){
					$scope.showFloatNav = true;
					$timeout(function(){
						$scope.showFloatNav = false;
					}, 3000);
				},
				loginout: function(){
					$storage.removeLocalStorage('SQZ_autoLogin');
					$scope.commonFn.goView('/login', true);
				},
				setPublicData: function(key, value){
					$scope.publicData[key] = value;
				},
				getPublicData: function(key){
					return $scope.publicData[key]
				},
				// 缓存表单数据
				cacheFormData: function(data){
					$scope.cacheDataPool[$location.$$path] = data;
				},
				// 获取缓存表单
				getCacheFormData: function(){
					var newData = {}, cacheData = $scope.cacheDataPool[$location.$$path];
					if( cacheData ){
						for(var i in cacheData){
							newData[i] = cacheData[i]
						}
						cacheData = null;
					}else{
						newData = null;
					}
					return  newData;
				},
				// 清空缓存的表单
				clearCacheFormData: function(path){
					$scope.cacheDataPool[path] = null;
				},
				// 构建地址栏参数
				buildParamsForUrl: function(params){
					var paramStr = '', paramArr = [];
					if( typeof params === 'object' ){
						for(var i in params){
							paramArr.push(i + '=' + params[i]);
						}
						paramStr = encodeURI(paramArr.join('&'));
					}else{
						paramStr = '';
					}
					return paramStr;
				},
				// 从地址栏获取参数
				getParamsFromUrl: function(){
					return $scope.currentParams;
				},
				// 从字典库获取字典值/列表
				getDictionaryByKey: function(key, value){
					if( typeof key === 'string' && value ){
						if( key === 'ALL' ){
							return $scope.dictionary[value];
						}else{
							return $scope.dictionary[key] ? ($scope.dictionary[key][value] || value) : value;
						}
					}else if(typeof key === 'object'){
						for(var i in key){
							for(j in key[i]){
								if( $scope.dictionary[j] ){
									key[i][j] = $scope.dictionary[j][key[i][j]] || key[i][j];
								}
							}
						}
						return key;
					}
					return null;
				},
				// 向字典库写入字典
				setDictionaryByKey: function(key, value){
					$scope.dictionary[key] = value;
				},
				// 跳转到指定页面
				goView: function(viewName, back){
					if( back ){
						$location.path(viewName).replace();
					}else{
						$location.path(viewName);
					}
				},
				// 返回上一页面
				goLastView: function(){
					history.back();
				},
				// 获取设备类型
				getDevice: function(){
					return deviceType;
				},
				getToken: function(){
					return $storage.getLocalStorage('SQZ_token');
				},
				// 弹窗
				alertMsg: function(title, message, success){
					$scope.alertTitle = title || '系统提醒';
					$scope.alertMessage = message || '出错了，请稍后重试';
					$scope.isAlert = true;
					$scope.alertAction = {
						success: function(){
							if(typeof success === 'function') success();
							$scope.isAlert = false;
						}
					}
				},
				// 确认框
				confirmMsg: function(title, message, success, cancel){
					$scope.confirmTitle = title || '系统提醒';
					$scope.confirmMessage = message || '出错了，请稍后重试';
					$scope.isConfirm = true;
					$scope.confirmAction = {
						success: function(){
							if(typeof success === 'function') success();
							$scope.isConfirm = false;
						},
						cancel: function(){
							if(typeof cancel === 'function') cancel();
							$scope.isConfirm = false;
						}
					}
				}
			}

			var _getParamsFromUrl = function(){
				var d = {}, str = decodeURI($location.url());
				if( str != '' ){
					var ag = str.replace(/^\/[a-zA-Z0-9]+\?/,'').split('&'), a;
					for(var i in ag){
						a = ag[i].split('=');
						a[1] ? d[a[0]] = a[1]: null;
					}
				}
				return JSON.stringify(d) === '{}' ? null : d;
			}

			$scope.$on('$routeChangeSuccess', function(event, current, last){
				var params = _getParamsFromUrl(),
					stateName = current.originalPath;
				if( last && last.$$route && current.$$route.controller !== 'resumeInfoEditController' && last.$$route.originalPath === '/myResume' ){
					var myResume = JSON.parse($storage.getLocalStorage('SQZ_resume'));
					if( myResume && myResume.isChange == '1' ){
						$scope.commonFn.confirmMsg(null, '您的简历已经修改，是否立即保存？', function(){
							last.scope.fn.saveResume(true);
						}, function(){
							$storage.removeLocalStorage('SQZ_resume');
						});
					}
				}

				if( last && last.$$route && current.$$route.controller !== 'loginController' && last.$$route.originalPath === '/jobDetails' ){
					$storage.setLocalStorage('SQZ_isScan', '1');
				}

				if( params && stateName ){
					$scope.currentParams = $scope.paramsPool[stateName] = params;
				}else if( stateName && $scope.paramsPool[stateName] ){
					$scope.currentParams = $scope.paramsPool[stateName];
				}
				
				if( $scope.commonFn.getTracker() ) $scope.commonFn.getTracker().push(['trackPageView', stateName]);
			});

			// 阻止橡皮筋效果
			// document.querySelector('body').addEventListener('touchmove', function(ev){ev.preventDefault();});
		}
	]);
})();