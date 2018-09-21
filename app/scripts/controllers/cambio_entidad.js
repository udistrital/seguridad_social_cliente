'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:CambioEntidadCtrl
* @description
* # CambioEntidadCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('CambioEntidadCtrl', function (agoraService, $q, $timeout, $log) {
  var self = this;

  agoraService.get('informacion_proveedor','limit=0').then(function(response) {
    var temp = [], promises = [];
    var inforPersonaNatural = function(proveedor,proveedores){
      var deferred = $q.defer();
      agoraService.get('informacion_persona_natural','limit=1&query=Id:'+proveedor.NumDocumento).then(function (response) {
        proveedores.push({
          display: proveedor.NomProveedor,
          value: proveedor.NomProveedor.toLowerCase(),
          id: proveedor.Id,
          idArl: response.data[0].IdArl,
          idEps: response.data[0].IdEps,
          idFondoPension: response.data[0].IdFondoPension,
          idCajaCompensacion: response.data[0].IdCajaCompensacion
        });
        deferred.resolve(proveedor);
      }).catch(function(){
        deferred.resolve();
      });
      return deferred.promise;
    };
    response.data.forEach(function(proveedor) {
      promises.push(inforPersonaNatural(proveedor,temp));
    });
    $q.all(promises).then(function(){

      self.states  = temp;
    });
  });

  agoraService.get('')

  function querySearch(query) {
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
    self.proveedor = item;
  }

  function createFilterFor(query) {
    var lowercaseQuery = query.toLowerCase();
    // var lowercaseQuery = angular.lowercase(query);
    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }

  self.querySearch   = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange   = searchTextChange;

});
