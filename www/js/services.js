angular.module('starter.services', [])

.factory('Userinfo', function() {
        var userinfo = {};
        return {
          set : function(key, value) {
      			// 在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
      			// 这时一般在setItem之前，先removeItem()就ok了
      			if (this.get(key) !== null)
      				this.remove(key);
      			  window.localStorage.setItem(key, value);
      		},
      		// 查询不存在的key时，有的浏览器返回undefined，这里统一返回null
      		get : function(key) {
      			var v = window.localStorage.getItem(key);
      			return v === undefined ? null : v;
      		},
      		setObj : function(key, data) {
      			// 将 Object 转换为 JSON 字符串
      			var json = JSON.stringify(data);
      			console.log("json:"+json);
      			window.localStorage.setItem(key, json);
      			console.log("localStorage:"+localStorage);
      		},
      		getObj : function(key) {
      			var str = window.localStorage.getItem(key);
      			// 将 JSON 字符串转换为 Object
      			var data = JSON.parse(str);
      			return data === undefined ? null : data;
      		},
      		remove : function(key) {
      			window.localStorage.removeItem(key);
      		},
      		clear : function() {
      			window.localStorage.clear();
      		},
      		each : function(fn) {
      			var n = window.localStorage.length, i = 0, fn = fn || function() {
      			}, key;
      			for (; i < n; i++) {
      				key = window.localStorage.key(i);
      				if (fn.call(this, key, this.get(key)) === false)
      					break;
      				// 如果内容被删除，则总长度和索引都同步减少
      				if (window.localStorage.length < n) {
      					n--;
      					i--;
      				}
      			}
      		},
          l : window.localStorage
        };
    })
    .factory('Login', ['$http', '$window','Constant',function($http, $window,Constant) {
        var users = {};
        return {
            all: function() {
                return users;
            },
            set:function(obj){
              users = obj;
            },
            get: function(userId) {
              console.log(Constant.url);
              return null;
            },
            post:function(user){
              console.log("这个是调用的services doLogin 函数");
              console.log(user.username);
              $http({
                url:Constant.url+'/login',
                method:'post',
                params:{username: user.username,password: user.password}
              }).success(function(data){
                  console.log(data);
                  console.log("登录成功");
                  return data;
              }).error(function(data){
                  console.log(data);
                  console.error("Failed to save.");
                  return data;
              });
            }
        };

    }])
    .factory('OpenDoor',['$http','$window','Constant',function($http,$window,Constant){
      var json = {};
      return{
        open:function(token){
          $http({
            url:Constant.url+'/open',
            method:'post',
            params:{token: token}
          }).success(function(data){
              console.log(data);
              console.log("登录成功");
              json = data;
          }).error(function(data){
              console.log(data);
              console.error("Failed to save.");
              json = data;
          });
        }
      }
    }])
    .factory('Verify',['$http','$window','Constant',function($http,$window,Constant){
      var code = "";
      return {
        getCode:function(){
          code = "888888";
          return code;
        },
        varifyCode:function(c){
          if(c != "" && c == code){
            return true;
          }
          return false;
        }
      }
    }]);
