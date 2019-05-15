'use strict';

/**
 * @ngdoc directive
 * @name ssClienteApp.directive:buscarProveedor
 * @description
 * # buscarProveedor
 */
angular.module('ssClienteApp')
  .directive('buscarProveedor', function () {
    return {
      restrict: 'E',
      scope:{
          proveedor:'='
      },
      templateUrl: 'views/directives/buscar-proveedor.html',
      controller:function(seguridadSocialService, $timeout, $q, $log, $scope){
        var ctrl = this;

        function getPersonas() {
          seguridadSocialService.get('incapacidades/BuscarPersonas/'+ctrl.searchText, '').then(function(response) {
            ctrl.states = response.data;
          });
        }
        
        //autocomplete
        ctrl.querySearch   = querySearch;
        ctrl.selectedItemChange = selectedItemChange;
        ctrl.searchTextChange   = searchTextChange;
        
        function querySearch (query) {
          if (ctrl.states !== undefined) {
            var results = query ? ctrl.states.filter( createFilterFor(query) ) : ctrl.states, deferred;
            if (ctrl.simulateQuery) {
              deferred = $q.defer();
              $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
              return deferred.promise;
            } else {
              return results;
            }
          }
        }
        
        function searchTextChange(text) {
          if (text.length > 3) {
            getPersonas();  
          }
        }
        
        function selectedItemChange(item) {
          $scope.proveedor = item;
          ctrl.selected = true;
          ctrl.tipoDocumento = item.tipoDocumento;
          ctrl.numeroDocumento = item.documento;
        }
        
        function createFilterFor(query) {
          var lowercaseQuery = query.toLowerCase();
          return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
          };
        }

      },
      controllerAs:'d_buscarProveedor'
    };
  });
