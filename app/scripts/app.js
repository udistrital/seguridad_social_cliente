'use strict';

/**
 * @ngdoc overview
 * @name ssClienteApp
 * @description
 * # ssClienteApp
 *
 * Main module of the application.
 */
angular
  .module('ssClienteApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'afOAuth2',
    'treeControl',
    'ngMaterial',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks',
    'pascalprecht.translate'
  ])
    .run(function(amMoment) {
      amMoment.changeLocale('es');
    })
    .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("");
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/notificaciones', {
        templateUrl: 'views/notificaciones.html',
        controller: 'NotificacionesCtrl',
        controllerAs: 'notificaciones'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
        .when('/aportante', {
                templateUrl: 'views/aportante.html',
                controller: 'AportanteCtrl',
                controllerAs: 'aportante'
              })
              .when('/calculos', {
                templateUrl: 'views/calculos.html',
                controller: 'CalculosCtrl',
                controllerAs: 'calculos'
              })
              .when('/ibc', {
                templateUrl: 'views/ibc.html',
                controller: 'IbcCtrl',
                controllerAs: 'ibc'
              })
              .when('/activos', {
                templateUrl: 'views/activos.html',
                controller: 'ActivosCtrl',
                controllerAs: 'activos'
              })
              .when('/incapcidades', {
                templateUrl: 'views/incapacidades.html',
                controller: 'IncapacidadesCtrl',
                controllerAs: 'incapacidades'
              })

      .when('/ver_incapacidades', {
        templateUrl: 'views/ver_incapacidades.html',
        controller: 'VerIncapacidadesCtrl',
        controllerAs: 'verIncapacidades'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
