'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:IncapcidadesCtrl
 * @description
 * # IncapcidadesCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('IncapacidadesCtrl', function (agoraService, titanCrudService, $scope, $timeout, $q, $log) {
    var self = this;
    var idProveedor = 0;

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

    //autocomplete
    // list of `state` value/display objects
    self.states        = proveedores;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
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
    //autocomplete

    titanCrudService.get('concepto','query=naturaleza:seguridad_social,NombreConcepto__startswith:incapacidad')
    .then(
      function(response) {
        self.incapacidades = response.data;
      }
   );


   self.registrarIncapacidad = function() {
     var persona = { Id: idProveedor }
     var concepto = { Id: parseInt(self.tipoIncapacidad) }
     var nomina = { Id: 5 }

     var incapacidad = {
       ValorNovedad: 0,
       EstadoNovedad: 'Activo',
       FechaDesde: self.fechaDesde,
       FechaHasta: self.fechaHasta,
       NumCuotas: 999,
       Persona: persona,
       Concepto: concepto,
       Nomina: nomina,
       Tipo: 'fijo'
     };

     titanCrudService.post('concepto_por_persona',incapacidad).then(function(response) {
       if(response.statusText === 'Created') {
         swal('Incapacidad Registrada Exitosamente');
         console.log(response.statusText);
       } else {
         swal('No se ha logrado registrar la incapacidad');
       }
     });
   }
});
