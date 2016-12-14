angular.module('starter.routes', [])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  //andoird 底部出现在了上部 解决方案
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center'); //处理android nav-title 没有居中的问题

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  //$ionicConfigProvider.navBar.alignTitle('center');//处理android nav-title 没有居中的问题
  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/public.html'
  })

  // // Each tab has its own nav history stack:

  .state('app.index', {
    url: '/index',
    views: {
      'public': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('app.main', {
    url: '/main',
    views: {
      'public': {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      }
    }
  })
  .state('app.forget', {
    url: '/forget',
    animation: 'slide-in-up',
    views: {
      'public': {
        templateUrl: 'templates/forget-pwd.html',
        controller: 'ForgetCtrl'
      }
    }
  })
  .state('app.address', {
      url: '/address/{ran}',
    animation: 'slide-in-right',
    views: {
      'public': {
        templateUrl: 'templates/address-list.html',
        controller: 'AddressCtrl'
      }
    }
  })
  .state('app.waterfall', {
      url: '/waterfall/{ran}',
    animation: 'slide-in-right',
    views: {
      'public': {
        templateUrl: 'templates/waterfall.html',
        controller: 'WaterfallCtrl'
      }
    }
  })



  .state('welcome', {
    url: '/welcome',
    abstract: true,
    templateUrl: 'templates/welcome/welcome.html'
  })


  .state('welcome.w_page', {
    url: '/w_page',
    views: {
      'welcome': {
        templateUrl: 'templates/welcome/w_page.html',
        controller: 'Welcome'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  if(window.localStorage.getItem('isRememberPwd') == 1){
    $urlRouterProvider.otherwise('/app/main');
  }else{
    $urlRouterProvider.otherwise('/app/index');
  }
  // if(window.localStorage['first'] === undefined){
  //    $urlRouterProvider.otherwise('/welcome/w_page');
  // }else{
  //   if(window.localStorage.getItem('isRememberPwd') == 0){
  //     console.log(0+"==============");
  //     $urlRouterProvider.otherwise('/app/index');
  //   }else{
  //     console.log(1+"==============");
  //     $urlRouterProvider.otherwise('/app/main');
  //   }
  // }
});