angular.module('starter.controllers', ['ionic'])

.constant('Constant', {
        url: 'http://door.parsec.com.cn',
        pic_url: '',
        token: ''
    })
    //登录
    .controller('LoginCtrl', function($scope, $ionicLoading, $ionicPopover, $http, $timeout, $state, Userinfo, Login, Constant) {
        $scope.isRememberPwd = false;
        Userinfo.set('isRememberPwd', 0);
        $scope.user = {};
        $scope.change = function() {
            if (!$scope.isRememberPwd) {
                $scope.isRememberPwd = true;
                Userinfo.set('isRememberPwd', 1);
            } else {
                $scope.isRememberPwd = false;
                Userinfo.set('isRememberPwd', 0);
            }
        }
        $scope.doLogin = function() {
            if ($scope.user.username === undefined) {
                $scope.showMsg('请输入您的手机号码');
                return false;
            };
            if ($scope.user.password === undefined) {
                $scope.showMsg('请输入您的登录密码');
                return false;
            };
            $ionicLoading.show({
              template: '<ion-spinner icon="spiral"></ion-spinner><br/>登录中...'
            });
            $http({
                url: Constant.url + '/login',
                method: 'post',
                params: { username: $scope.user.username, password: $scope.user.password }
            }).success(function(data) {
                $ionicLoading.hide();
                if (data.status == 0) {
                    Userinfo.set('token', data.token);
                    Userinfo.set('username', data.truename);
                    $state.go('app.main');
                } else {
                    $scope.showMsg("请输入正确的手机号码和密码");
                }
            }).error(function(data) {
                $ionicLoading.hide();
                console.log(data);
                console.error("Failed to save.");
                $scope.showMsg("服务器异常！请稍后重试...");
            });
        }

        $scope.showMsg = function(txt) {
            var template = '<ion-popover-view class = "light padding" > ' + txt + ' </ion-popover-view>';
            $scope.popover = $ionicPopover.fromTemplate(template, {
                scope: $scope
            });
            $scope.popover.show();
            $timeout(function() {
                $scope.popover.hide();
            }, 1400);
        };
        $scope.forget = function() {
            $state.go('app.forget');
            return false;
        }
    })
    .controller('MainCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicModal, $http, $timeout, $interval, $state, Userinfo, Constant) {
        $scope.isActive = false;
        $scope.button_clicked = false;
        $scope.sec = "00";
        $scope.min = "00";
        $scope.hours = "00";
        $scope.username = "";

        // 创建两个变量，一个数组中的月和日的名称
        $scope.monthNames = ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"];
        $scope.dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]

        // 创建一个对象newDate（）
        $scope.newDate = new Date();
        // 提取当前的日期从日期对象
        $scope.newDate.setDate($scope.newDate.getDate());
        //输出的日子，日期，月和年
        $scope.date = $scope.newDate.getFullYear() + "年 " + $scope.monthNames[$scope.newDate.getMonth()] + ' ' + $scope.newDate.getDate() + ' 日 ' + $scope.dayNames[$scope.newDate.getDay()];

        $interval(function() {
            $scope.username = Userinfo.get('username');
            // 创建一个对象，并提取newDate（）在访问者的当前时间的秒
            $scope.seconds = new Date().getSeconds();
            //添加前导零秒值
            $scope.sec = ($scope.seconds < 10 ? "0" : "") + $scope.seconds;
            // 创建一个对象，并提取newDate（）在访问者的当前时间的分钟
            $scope.minutes = new Date().getMinutes();
            // 添加前导零的分钟值
            $scope.min = ($scope.minutes < 10 ? "0" : "") + $scope.minutes;
            // 创建一个对象，并提取newDate（）在访问者的当前时间的小时
            $scope.h = new Date().getHours();
            // 添加前导零的小时值
            $scope.hours = ($scope.h < 10 ? "0" : "") + $scope.h;
        }, 1000);


        $scope.openDoor = function() {
            $scope.button_clicked = true;

            $scope.token = Userinfo.get('token');
            console.log(Userinfo.get('isRememberPwd'));
            console.log(Userinfo.get('token'));
            if ($scope.token == null || $scope.token == "") {
                $scope.showAlert("登录信息已经过期，请重新登录", 1);
                return;
            }
            $scope.isActive = true;
            $http({
                url: Constant.url + '/open',
                method: 'post',
                params: { token: $scope.token },
                timeout: 10000
            }).success(function(data) {
                if (data.status == 0) {
                    if (Userinfo.get('isRememberPwd') == 0) {
                        Userinfo.remove('token');
                    }
                    $scope.showAlert('今天'+$scope.dayNames[$scope.newDate.getDay()]+'，祝您工作愉快。', 0);
                } else {
                    $scope.showAlert("登录信息已经过期，请重新登录", 1);
                }
            }).error(function(data) {
                $scope.showAlert("服务器异常，稍后重试...", 0);
            }).finally(function() {
              $scope.button_clicked = false;
              $scope.isActive = false;
            });
        }

        // 一个提示对话框
        $scope.showAlert = function(txt, fu) {
            var alertPopup = $ionicPopup.alert({
                title: '开门提示',
                template: txt
            });
            alertPopup.then(function(res) {
                if (fu == 1) {
                    Userinfo.remove('username');
                    $state.go('app.index');
                }
            });
        };
        //通讯录
        $scope.gotoAddress = function() {
            $state.go('app.address', { ran: Math.random() * 1000 });
        };

        // $ionicModal.fromTemplateUrl('templates/address-list.html?v='+Math.random()*1000, {
        //     scope: $scope,
        //     animation: 'slide-in-right'
        // }).then(function(modal) {
        //     $scope.addressModal = modal;
        // });
        // $scope.openAddressModal = function() {
        //     $scope.addressModal.show();
        // };
        // $scope.closeAddressModal = function() {
        //     $scope.addressModal.hide();
        // };

        //照片墙
        $scope.gotoWaterfall = function() {
             var alertPopup = $ionicPopup.alert({
                 title: '逗您提示',
                 template: "哈哈哈...，您甭逗了，此功能还在开发中..."
             });
            //$state.go('app.waterfall', { ran: Math.random() * 1000 });
        };

        // $ionicModal.fromTemplateUrl('templates/waterfall.html', {
        //     scope: $scope,
        //     animation: 'slide-in-right'
        // }).then(function(modal) {
        //     $scope.waterfallModal = modal;
        // });
        // $scope.openWaterfallModal = function() {
        //     $scope.waterfallModal.show();
        // };
        // $scope.closeWaterfallModal = function() {
        //     $scope.waterfallModal.hide();
        // };
    })
    .controller('Public', function($scope, $ionicPopover, $timeout, $ionicModal, $ionicLoading, $http, Userinfo, Constant, $state) {})
    //忘记密码
    .controller('ForgetCtrl', function($scope, $ionicLoading, $ionicPopover, $ionicModal, $state, $interval, $timeout, Verify) {
        $scope.user = {};
        $scope.isActive = false;
        $scope.btn_name = "发送验证码";
        $scope.code = "";
        $scope.closeForget = function() {
            $state.go('app.index');
        }
        $scope.getVerify = function() {

            var i = 60;
            var countdown = $interval(function() {
                i--;
                $scope.btn_name = i + "s后重新发送";
                if (i == 0) {
                    $scope.btn_name = "发送验证码";
                    $scope.isActive = false;
                    $interval.cancel(countdown);
                }
            }, 1000);
            $scope.isActive = true;
            $scope.code = Verify.getCode();
            if ($scope.code != "") {
                $ionicLoading.show({
                  template: '<ion-spinner icon="spiral"></ion-spinner><br/>正在获取验证码...'
                });
                $timeout(function() {
                    $ionicLoading.hide();
                }, 2000);
            }
            console.log($scope.code);
        }
        $scope.doForget = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner><br/>修改中...'
            });
            $timeout(function() {
                $ionicLoading.hide();
                $scope.showMsg("修改成功,请重新登录");
                $timeout(function() {
                    $scope.closeForget();
                }, 1500);
            }, 2000);
        }

        $scope.showMsg = function(txt) {
            var template = '<ion-popover-view class = "light padding" > ' + txt + ' </ion-popover-view>';
            $scope.popover = $ionicPopover.fromTemplate(template, {
                scope: $scope
            });
            $scope.popover.show();
            $timeout(function() {
                $scope.popover.hide();
            }, 1400);
        };
    })
    //欢迎页
    .controller('Welcome', function($scope, $ionicModal, $state) {
        $scope.guideFlag = 'a';
        $scope.guideSure = function() {
            $state.go('app.index');
            window.localStorage['first'] = '1';
        };

        $scope.onSwipeLeft = function() {
            switch ($scope.guideFlag) {
                case 'a':
                    $scope.guideFlag = 'b';
                    break;
                case 'b':
                    $scope.guideFlag = 'c';
                    break;
                case 'c':
                    $scope.guideFlag = 'd';
                    break;
                case 'd':
                    $scope.guideFlag = 'e';
                    break;
                default:
                    break;
            }
        };
    })
    .controller('AddressCtrl', function($scope, $ionicLoading, $ionicPopover, $ionicModal, $ionicLoading, $ionicHistory, $http, $state, $interval, $timeout, Constant, $ionicPopup,Userinfo) {
        $scope.isActive = false;
        $scope.user = {};
        $scope.user.username = "";
        $scope.items = [];

        $scope.loadData = function() {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $http({
                url: Constant.url + '/contact',
                method: 'get',
                timeout: 10000
            }).success(function(data) {
                $scope.items = data;
                Userinfo.setObj('address',data);
            }).error(function(data) {
                $scope.items = Userinfo.getObj('address') == null ? [] : Userinfo.getObj('address');
                //$scope.showAlert("服务器异常，稍后重试...", 0);
            }).finally(function() {
                $ionicLoading.hide();
            });
        }
        $scope.loadData();

        $scope.showCancelBtn = function() {
            $scope.isActive = true;
        }
        $scope.cancelSearch = function() {
            $scope.user.username = "";
            $scope.isActive = false;
        }
        $scope.doRefresh = function() {
            $scope.items = [];
            $http({
                url: Constant.url + '/contact',
                method: 'get',
                timeout: 10000
            }).success(function(data) {
                $scope.items = data;
                Userinfo.setObj('address',data);
            }).error(function(data) {
                //$scope.showAlert("服务器异常，稍后重试...");
                $scope.items = Userinfo.getObj('address') == null ? [] : Userinfo.getObj('address');
            }).finally(function() {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.remove = function(index) {
            $scope.items.splice(index, 1);
        }
        $scope.closeAddress = function() {
                $state.go('app.main');
            }
            // 一个提示对话框
        $scope.showAlert = function(txt) {
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template: txt
            });
            alertPopup.then(function(res) {});
        };
    })
    .controller('WaterfallCtrl', function($scope, $ionicLoading, $ionicPopover, $ionicModal, $ionicHistory, $state, $interval, $timeout) {
        $scope.moreDataCanBeLoaded = true;
        $scope.doRefresh = function() {
            // $http.get('/new-items')
            //     .success(function(newItems) {
            //         $scope.items = newItems;
            //     })
            //     .finally(function() {
            //         // 停止广播ion-refresher
            //         $scope.$broadcast('scroll.refreshComplete');
            //     });
            $timeout(function() {
                $scope.$broadcast('scroll.refreshComplete');
            }, 2000);
        };
        $scope.loadMoreData = function(){
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 2000);
        }

        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMoreData();
        });

        $scope.closeWaterfall = function() {
            $state.go('app.main');
        }
    })
