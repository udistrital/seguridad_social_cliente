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

  var proveedores = [];

  agoraService.get('informacion_proveedor','fields=NomProveedor,Id,NumDocumento').then(function(response) {
    response.data.forEach(function(proveedor) {
      agoraService.get('informacion_persona_natural','limit?=1&query=Id:'+proveedor.NumDocumento).then(function (response) {
        proveedores.push({
          display: proveedor.NomProveedor,
          value: proveedor.NomProveedor.toLowerCase(),
          id: proveedor.Id,
          idArl: response.data[0].IdArl,
          idEps: response.data[0].IdEps,
          idFondoPension: response.data[0].IdFondoPension,
          idCajaCompensacion: response.data[0]. IdCajaCompensacion
        });
      });
    });
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
    //$log.info('Item changed to ' + JSON.stringify(item));
    //idProveedor = item.id;
    console.log(item);
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }

});
