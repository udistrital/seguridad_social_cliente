'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:PersonaUpcCtrl
 * @description
 * # PersonaUpcCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('PersonaUpcCtrl', function (agoraService, seguridadSocialCrudService, titanCrudService, $scope, $timeout, $q, $log) {
    var self = this;
    var idProveedor = 0;

    self.variablesForm = {
      numDocumento: self.numDocumento,
      nombre: self.nombre,
      apellido: self.apellido,
      valorUpc: {"Valor": 0},
    };

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
  //autocomplete

  seguridadSocialCrudService.get('tipo_zona_upc','limit=-1').then(function(response) {
    self.tipoZona = response.data;
  });

  seguridadSocialCrudService.get('edad_upc', 'limit=-1&query=Vigencia:' + new Date().getFullYear() + '&sortby=EdadMin&order=asc').then(
    function(response) {
        console.log(response.data);
        self.rangosEdad = response.data;
    });

    titanCrudService.get('categoria_beneficiario', 'limit=-1').then(function(response) {
      self.tiposParentesco = response.data;
    });

    agoraService.get('parametro_estandar','query=ClaseParametro:Tipo%20Documento&limit=-1').then(function(response) {
      self.tipoDocumento = response.data;
    });

    self.cambiarZona = function() {
      console.log('zona: ' + self.zona);
      if (self.edad != null) {
        traerValorUpc(self.zona, self.edad);
        console.log('edad: ' + self.edad);
      }
    }

    self.cambiarEdad = function() {
      console.log('edad: ' + self.edad);
      if (self.zona != null) {
          traerValorUpc(self.zona, self.edad);
          console.log('zona:' + self.zona);
      }
    }

    function traerValorUpc(idZona, idRangoEdad) {
      seguridadSocialCrudService.get('tipo_upc','limit=1&&query=IdTipoZonaUpc:'+ idZona +',idEdadUpc:' + idRangoEdad).then(function(response) {
        self.variablesForm.valorUpc = response.data[0];
        console.log('valor upc: ' + self.valorUpc);
      });
    }

    self.reset = function() {
      self.variablesForm = {valorUpc: {"Valor": 0}};
    }

    self.guardarUpcAdicional = function() {

      var idTipoUpc = { Id: self.variablesForm.valorUpc.Id };
      var upcAdicional = {
        PersonaAsociada: idProveedor,
        TipoDocumento: self.tipoIdentificacion,
        Documento: self.variablesForm.numDocumento,
        Nombre: self.variablesForm.nombre,
        Apellido: self.variablesForm.apellido,
        IdParentesco: self.parentesco.Id,
        IdTipoUpc: idTipoUpc
      };

      seguridadSocialCrudService.post('upc_adicional',upcAdicional).then(function(response) {
        if (response.statusText == 'Created') {
          swal('UPC Registrada Exitosamente');
          self.reset();
        } else {
          swal('No se ha Logrado Registrar la UPC');
        }
        console.log(response.data);
      });

      console.log(upcAdicional);
    };
});
