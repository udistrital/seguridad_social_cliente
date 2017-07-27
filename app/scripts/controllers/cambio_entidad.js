'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:CambioEntidadCtrl
 * @description
 * # CambioEntidadCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('CambioEntidadCtrl', function (agoraService) {
    var self = this;

    agoraService.get('informacion_persona_natural','').then(function (response) {
      var proveedores = [];
      agoraService.get('informacion_proveedor','fields=NomProveedor,Id').then(function(response) {
         self.personas = response.data;

         for (var i = 0; i < response.data.length; i++) {
           proveedores.push(
             {
               display: response.data[i].NomProveedor,
               value: response.data[i].NomProveedor.toLowerCase(),
               id: response.data[i].Id
             });
         }
         console.log('proveedores : ' , proveedores);
       });

    self.states        = proveedores;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      idProveedor = item.id;
      console.log(idProveedor);
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
    });
  });
