'use strict';
/**
* @ngdoc function
* @name ssClienteApp.controller:menuCtrl
* @description
* # menuCtrl
* Controller of the ssClienteApp
*/

angular.module('ssClienteApp')
    .controller('menuCtrl', function($location, $http, $window, $q, $scope, $rootScope, token_service, configuracionRequest, notificacion, $translate, $route, $mdSidenav) {
        var paths = [];
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };
        $scope.menu_app = [
          {
                id: "seguridadsocial",
                title: "SEGURIDAD SOCIAL",
                url: "https://seguridadsocial.portaloas.udistrital.edu.co"
            },
            {
                id: "titan",
                title: "TITAN",
                url: "https://titan.portaloas.udistrital.edu.co"
            },
            {
                id: "agora",
                title: "AGORA",
                url: "https://funcionarios.portaloas.udistrital.edu.co/agora"
            }, {
                id: "argo",
                title: "ARGO",
                url: "https://funcionarios.portaloas.udistrital.edu.co/argo"
            }, {
                id: "arka",
                title: "ARKA",
                url: "https://funcionarios.portaloas.udistrital.edu.co/arka"
            }, {
                id: "temis",
                title: "TEMIS",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/gefad"
            }, {
                id: "jano",
                title: "JANO",
                url: "https://funcionarios.portaloas.udistrital.edu.co/jano"
            }, {
                id: "kyron",
                title: "KYRON",
                url: "https://funcionarios.portaloas.udistrital.edu.co/kyron"
            }, {
                id: "sga",
                title: "SISTEMA DE GESTION ACADEMICA",
                url: "https://estudiantes.portaloas.udistrital.edu.co"
            }
        ];
        $scope.notificacion = notificacion;
        $scope.actual = "";
        $scope.token_service = token_service;
        $scope.breadcrumb = [];
        $scope.menu_service = [];

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
            console.log("padres: ",padres);
            return padres;
        };
        
        $scope.logout = function(){
            token_service.logout();
            console.log("logout");
        };
        if(token_service.live_token()){
          console.log("token is live");

            $scope.token = token_service.getPayload();            
            if (!angular.isUndefined($scope.token.role)){
                console.log("$scope:", $scope.token.role);
                var roles="";
                if ( typeof $scope.token.role === "object" ) {
                  console.log("$scope.token.role: ", $scope.token.role);
                  var rl = [];
                  for (var index = 0; index < $scope.token.role.length; index++) {
                    if ($scope.token.role[index].indexOf("/") < 0 ){
                      rl.push($scope.token.role[index]);
                      console.log("$scope.token.role: ", $scope.token.role);
                    }
                  }
                  roles = rl.toString();
                } else {
                  roles = $scope.token.role;
                }
                console.log("roles: ", roles);
    
                roles = roles.replace(/,/g, '%2C');
                console.log("roles: ", roles);
                // roles='ASISTENTE_RECURSOS_HUMANOS_SS';
                configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/ss','').then(function(response) {
                    $rootScope.my_menu = response.data;
                    console.log("menus:", response.data);
                })
                .catch(
                    function(response) {
                        $rootScope.my_menu = response.data;
                        console.log("$rootScope.my_menu:", $rootScope.my_menu)
        
                    });
            } else {
              console.log("else de !angular.isUndefined($scope.token.role)", angular.isUndefined($scope.token.role))
            }
        }
        /*
        configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + "ADMINISTRADOR_ARGO" + '/Argo', '').then(function(response) {
            $rootScope.my_menu = response.data;
          });
            /*configuracionRequest.update_menu(https://10.20.0.162:9443/store/apis/authenticate response.data);
            $scope.menu_service = configuracionRequest.get_menu();*/


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

        $scope.redirect_url = function(path) {
            var path_sub = path.substring(0, 4);
            switch (path_sub.toUpperCase()) {
                case "HTTP":
                    $window.open(path, "_blank");
                    break;
                default:
                    $location.path(path);
                    break;
            }
        };

        recorrerArbol($scope.menu_service, "");
        paths.push({ padre: ["", "Notificaciones", "Ver Notificaciones"], path: "notificaciones" });

        $scope.$on('$routeChangeStart', function( /*next, current*/ ) {
            $scope.actual = $location.path();
            update_url();
        });

        $scope.changeLanguage = function(key) {
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
            $route.reload();
        };

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

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

/*
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

    $scope.logout = function(){
      token_service.logout();
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
  */


