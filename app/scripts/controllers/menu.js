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
  $scope.menu_service = [{ //aqui va el servicio de el app de configuracion
    "Id": 2,
    "Nombre": "Parámetros",
    "Url": "",
    "Opciones": [{
      "Id": 3,
      "Nombre": "Aportante",
      "Url": "aportante",
      "Opciones": null
    },{
      "Id": 3,
      "Nombre": "Parámetros de Cálculo",
      "Url": "calculos",
      "Opciones": null
    },{
      "Id": 4,
      "Nombre": "Entidades",
      "Url": "entidades",
      "Opciones": null
    }, {
      "Id": 5,
      "Nombre": "Parámetros IBC",
      "Url": "ibc",
      "Opciones": null
    }]},
    {
      "Id": 6,
      "Nombre": "Planillas",
      "Url": "planillas",
      "Opciones": null
    },
    {
      "Id": 7,
      "Nombre": "Incapacidades",
      "Url": "",
      "Opciones": [{
        "Id": 8,
        "Nombre": "Registrar Incapacidad",
        "Url": "incapcidades",
        "Opciones": null
      },
      {
        "Id": 9,
        "Nombre": "Ver Incapacidades",
        "Url": "ver_incapacidades",
        "Opciones": null
      }]},
    {
      "Id": 10,
      "Nombre": "Activos",
      "Url": "activos",
      "Opciones": null
    },
    {
      "Id": 11,
      "Nombre": "UPC",
      "Url": "",
      "Opciones": [{
        "Id": 12,
        "Nombre": "Registrar Nueva UPC",
        "Url": "persona_upc",
        "Opciones": null
      },
      {
        "Id": 13,
        "Nombre": "Ver UPC Registradas",
        "Url": "ver_upc",
        "Opciones": null
      },
      {
        "Id": 14,
        "Nombre": "Registrar Valor UPC",
        "Url": "tipo_upc",
        "Opciones": null
      }]
    }];

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
    recorrerArbol($scope.menu_service, "");
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
