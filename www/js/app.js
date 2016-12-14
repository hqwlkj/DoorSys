// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.routes', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $location, $rootScope, $ionicHistory, $cordovaToast, $timeout) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience
            ionic.Platform.isFullScreen = true;
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            StatusBar.styleColor('#ffffff'); //设置状态栏的字体颜色
            //StatusBar.styleDefault();
        }
        // function checkConnection() {
        //     var networkState = navigator.connection.type;

        //     var states = {};
        //     states[Connection.UNKNOWN] = 'Unknown connection'; //未知连接
        //     states[Connection.ETHERNET] = 'Ethernet connection'; //以太网
        //     states[Connection.WIFI] = 'WiFi connection'; //wifi 
        //     states[Connection.CELL_2G] = 'Cell 2G connection'; //2G
        //     states[Connection.CELL_3G] = 'Cell 3G connection'; //3G
        //     states[Connection.CELL_4G] = 'Cell 4G connection'; //4G
        //     states[Connection.CELL] = 'Cell generic connection'; //蜂窝网络
        //     states[Connection.NONE] = 'No network connection';

        //     console.log('Connection type: ' + states[networkState]);
        // }
        // checkConnection();
    });


    

    //双击退出
    $ionicPlatform.registerBackButtonAction(function(e) {
        //判断处于哪个页面时双击退出
        if ($location.path() == '/app/index' || $location.path() == '/app/main') {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('再按一次退出系统');
                $timeout(function() {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        } else {
            $ionicHistory.goBack();
        }
        e.preventDefault();
        return false;
    }, 101);
})
