'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:PersonaUpcCtrl
 * @description
 * # PersonaUpcCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('PersonaUpcCtrl', function (administrativaAmazonService, seguridadSocialCrudService, titanCrudService, $scope, $timeout, $q, $log) {
    var self = this;
    var idProveedor = 0;

    self.variablesForm = {
      numDocumento: self.numDocumento,
      nombre: self.nombre,
      apellido: self.apellido,
      valorUpc: {"Valor": 0},
    };

    var proveedores = [];
    administrativaAmazonService.get('informacion_proveedor','query=TipoPersona:NATURAL&fields=NomProveedor,Id').then(function(response) {
       self.personas = response.data;

       for (var i = 0; i < response.data.length; i++) {
         proveedores.push(
           {
             display: response.data[i].NomProveedor,
             value: response.data[i].NomProveedor.toLowerCase(),
             id: response.data[i].Id
           });
       }
     });

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
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }

    self.states        = proveedores;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
  //autocomplete

  seguridadSocialCrudService.get('zona_upc','limit=-1').then(function(response) {
    self.tipoZona = response.data;
  });

  seguridadSocialCrudService.get('rango_edad_upc', 'limit=-1&sortby=EdadMin&order=asc').then(
    function(response) {
      self.rangosEdad = response.data;
    });

    titanCrudService.get('categoria_beneficiario', '').then(function(response) {
      self.tiposParentesco = response.data;
    });

    administrativaAmazonService.get('parametro_estandar','query=ClaseParametro:Tipo%20Documento&limit=-1').then(function(response) {
      self.tipoDocumento = response.data;
    });

    self.cambiarZona = function() {
      if (self.edad !== null) {
        traerValorUpc(self.zona, self.edad);
      }
    };

    self.cambiarEdad = function() {
      if (self.zona !== null) {
          traerValorUpc(self.zona, self.edad);
      }
    };

    function traerValorUpc(idZona, idRangoEdad) {
      seguridadSocialCrudService.get('tipo_upc','limit=1&query=ZonaUpc:'+ idZona +',RangoEdadUpc:' + idRangoEdad).then(function(response) {
        self.variablesForm.valorUpc = response.data[0];
      });
    }

    self.reset = function() {
      self.variablesForm = {valorUpc: {"Valor": 0}};
    };

    self.guardarUpcAdicional = function() {
      var idTipoUpc = { Id: self.variablesForm.valorUpc.Id };
      var upcAdicional = {
        PersonaAsociada: idProveedor,
        ParametroEstandar: parseInt(self.tipoIdentificacion),
        NumDocumento: self.variablesForm.numDocumento,
        TipoUpc: idTipoUpc,
        PrimerNombre: self.variablesForm.nombre,
        SegundoNombre: self.variablesForm.segundoNombre,
        PrimerApellido: self.variablesForm.apellido,
        SegundoApellido: self.variablesForm.segundoApellido,
        FechaDeNacimiento: self.variablesForm.fechaNacimiento,
        Activo: true
      };

      seguridadSocialCrudService.post('upc_adicional',upcAdicional).then(function(response) {
        if (response.statusText === 'Created') {
          swal('UPC Adicional Registrada');
          self.reset();
        } else {
          swal('No se ha Logrado Registrar la UPC');
        }
      });

    };
});