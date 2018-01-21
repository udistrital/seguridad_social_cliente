'use strict';
/**
* @ngdoc function
* @name ssClienteApp.controller:menuCtrl
* @description
* # menuCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('menuCtrl', function($location, $http, $scope, token_service, notificacion, $translate) {
  var paths = [];
  $scope.language = {
    es:"btn btn-primary btn-circle btn-outline active",
    en:"btn btn-primary btn-circle btn-outline"
  };
  $scope.notificacion = notificacion;
  $scope.actual = "";
  $scope.token_service = token_service;
  $scope.breadcrumb = [];

  $http.get('http://10.20.0.254/configuracion_api/v1/menu_opcion_padre/ArbolMenus/ASISTENTE_RECURSOS_HUMANOS_SS/Titan').then(function(response) {
    $scope.menu_service = response.data;
    recorrerArbol(response.data, "")
  });

    var recorrerArbol = function(item, padre) {
      var padres = "";
      for (var i = 0; i < item.length; i++) {
        if (item[i].Opciones === null) {
          padres = padre + " , " + item[i].Nombre;
          paths.push({
            'path': item[i].Url,
            'padre': padres.split(",")
          });
        } else {
          recorrerArbol(item[i].Opciones, padre + "," + item[i].Nombre);
        }
      }
      return padres;
    };

    var update_url = function() {
      $scope.breadcrumb = [''];
      for (var i = 0; i < paths.length; i++) {
        if ($scope.actual === "/" + paths[i].path) {
          $scope.breadcrumb = paths[i].padre;
        } else if ('/' === $scope.actual) {
          $scope.breadcrumb = [''];
        }
      }
    };

    paths.push({padre:["","Notificaciones","Ver Notificaciones"],path:"notificaciones"});

    $scope.$on('$routeChangeStart', function(next, current) {
      $scope.actual = $location.path();
      update_url();
      console.log(next + current);
    });

    $scope.changeLanguage = function (key){
      $translate.use(key);
      switch (key) {
        case 'es':
        $scope.language.es = "btn btn-primary btn-circle btn-outline active";
        $scope.language.en = "btn btn-primary btn-circle btn-outline";
        break;
        case 'en':
        $scope.language.en = "btn btn-primary btn-circle btn-outline active";
        $scope.language.es = "btn btn-primary btn-circle btn-outline";
        break;
        default:
      }
    };
    //Pendiente por definir json del menu
    (function($) {
      $(document).ready(function() {
        $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          $(this).parent().siblings().removeClass('open');
          $(this).parent().toggleClass('open');
        });
      });
    })(jQuery);
  });
