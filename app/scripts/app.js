'use strict';

/**
 * @ngdoc overview
 * @name ssClienteApp
 * @description
 * # ssClienteApp
 *
 * Main module of the application.
 */
angular.module('ssClienteApp', [
    'angular-loading-bar',
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
    'ui.grid.expandable',
    'ui.grid.pinning',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks',
    'pascalprecht.translate',
    'ngAnimate',
    'ui.select',
    'ui.knob',
    'implicitToken',
    'configuracionService'
])
    .run(function (amMoment) {
        amMoment.changeLocale('es');
    })
    .config(['cfpLoadingBarProvider', 'uiSelectConfig', function (cfpLoadingBarProvider, uiSelectConfig) {
        // cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        // cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-div"><div><span class="fa loading-spinner"></div><div class="fa sub-loading-div">Por favor espere, cargando...</div></div>';
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        uiSelectConfig.theme = 'select2';
        uiSelectConfig.resetSearchInput = true;
        uiSelectConfig.appendToBody = true;
    }])
    .config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return date ? moment.utc(date).format('YYYY-MM-DD') : '';
        };
    })
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
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
                controllerAs: 'calculo'
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
            .when('/tipo_upc', {
                templateUrl: 'views/tipo_upc.html',
                controller: 'TipoUpcCtrl',
                controllerAs: 'tipoUpc'
            })
            .when('/ver_upc', {
                templateUrl: 'views/ver_upc.html',
                controller: 'VerUpcCtrl',
                controllerAs: 'verUpc'
            })
            .when('/persona_upc', {
                templateUrl: 'views/persona_upc.html',
                controller: 'PersonaUpcCtrl',
                controllerAs: 'personaUpc'
            })
            .when('/registrar_tipo_upc', {
                templateUrl: 'views/registrar_tipo_upc.html',
                controller: 'RegistrarTipoUpcCtrl',
                controllerAs: 'registrarTipoUpc'
            })
            .when('/planillas', {
                templateUrl: 'views/planillas.html',
                controller: 'PlanillasCtrl',
                controllerAs: 'planillas'
            })
            .when('/vista_prueba', {
                templateUrl: 'views/vista_prueba.html',
                controller: 'VistaPruebaCtrl',
                controllerAs: 'vistaPrueba'
            })
            .when('/ingreso', {
                templateUrl: 'views/ingreso.html',
                controller: 'IngresoCtrl',
                controllerAs: 'ingreso'
            })
            .when('/retiro', {
                templateUrl: 'views/retiro.html',
                controller: 'RetiroCtrl',
                controllerAs: 'retiro'
            })
            .when('/cambio_entidad', {
                templateUrl: 'views/cambio_entidad.html',
                controller: 'CambioEntidadCtrl',
                controllerAs: 'cambioEntidad'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
