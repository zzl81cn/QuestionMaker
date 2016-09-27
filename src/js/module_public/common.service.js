/**
 * 基础模块公用的方法在这个service 里面
 *
 */
angular.module('commonServerModule', ['ngResource'])
	.factory('commonService', ['$http', '$filter', '$templateCache', '$modal', '$resource', '$alert', function($http, $filter, $templateCache, $modal, $resource, $alert) {

		Date.prototype.format = function(format) {
			format = $filter('date')(this, format);
			return format;
		}

		var commonService = {
			//基本调用后台的post Content-Type:为application/json
			showAlert: function(title, connents) {
				$modal({
					title: title,
					content: connents,
					show: true,
					backdrop: "static",
					keyboard: false,
					template: 'src/js/module_public/alert.tpl.html'
				});
			},

			showInfo: function(title, connents, duration) {
				var myAlert = $alert({
					title: title,
					content: connents,
					placement: 'top',
					duration: duration,
					type: 'info',
					show: true
				});
			},
			showConfirm: function(title, connents) { //confirm
				var confirm = $modal({
					title: title,
					content: connents,
					show: true,
					backdrop: "static",
					keyboard: false,
					template: 'src/js/module_public/cnfirm.tpl.html'
				});
				confirm.$scope.success = function() {
					confirm.hide();
				};
				confirm.$scope.cancle = function() {
					confirm.hide();
				};
				return {
					success: function(successFun) {
						confirm.$scope.success = function() {
							confirm.hide();
							successFun();
						};
					},
					cancle: function(cancleFun) {
						confirm.$scope.cancle = function() {
							confirm.hide();
							cancleFun();
						};
					}
				}
			},

            /**
             * @param title 标题　
             *        contents 提示内容
             *        state 进度条，只是那个条是否显示
             */
			loadingAlert: function(title, connents, state) { //带进度条

				var lodmodel = $modal({
					show: true,
					backdrop: "static",
					title: title,
					content: connents,
					template: 'src/js/module_public/loadingAlert.tpl.html'
				});
				lodmodel.$scope.state = state;
				return {
					loadSuccess: function(state, content) {
						lodmodel.$scope.state = state;
						lodmodel.$scope.content = content;
					}
				}
			},
			clearSession: function() {
				//清除session
				for (var key in sessionStorage) {
					sessionStorage.removeItem(key);
				}

				//清空全局变量
				currentDay = undefined; //系统时间
				User = undefined; // 登录时候返回的信息将来会包含权限等信息
				curretMenue = undefined; //当前选中的菜单
			}

		};
		return commonService;

	}]);

