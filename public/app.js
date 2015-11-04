/**
 * Created by LuckyJS on 2015. 11. 4..
 */
(function() {
  'use strict';

  angular.module('app', ['ngRoute', 'ngResource']);

  angular.module('app').config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $routeProvider
      .when('/', {
        templateUrl: '/partials/main/main',
        controller: 'MainCtrl'
      });
  });
})();
