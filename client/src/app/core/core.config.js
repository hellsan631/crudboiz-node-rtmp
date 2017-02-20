;(function() {
  'use strict';

  angular
    .module('app.core')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig(
    $compileProvider,
    $httpProvider,
    $locationProvider,
    $urlRouterProvider,
    $uiViewScrollProvider) {

    //Performance Improvements
    $compileProvider.debugInfoEnabled(true);

    $httpProvider.useApplyAsync(true);
    $httpProvider.interceptors.push('httpLoader');

    //If these walls could talk
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
      $state.go('channels');
    });

    $uiViewScrollProvider.useAnchorScroll();
  }

})();
