'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:IncapcidadesCtrl
* @description
* # IncapcidadesCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('IncapacidadesCtrl', function (titanCrudService, seguridadSocialService, $scope, $timeout, $q, $log, $translate) {
var self = this;
var proveedor = 0;
self.documento = "";

function getPersonas() {
  seguridadSocialService.get('incapacidades', 'documento='+self.searchText).then(function(response) {
    self.states = response.data;
  });
}

//autocomplete
self.querySearch   = querySearch;
self.selectedItemChange = selectedItemChange;
self.searchTextChange   = searchTextChange;

function querySearch (query) {
  if (self.states !== undefined) {
    var results = query ? self.states.filter( createFilterFor(query) ) : self.states, deferred;
    if (self.simulateQuery) {
      deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }
}

function searchTextChange(text) {
  $log.info('Text changed to ' + text);
  if (text.length > 3) {
    getPersonas();  
  }
}

function selectedItemChange(item) {
  $log.info('Item changed to ' + JSON.stringify(item));
  self.selected = true;
  self.tipoDocumento = item.tipoDocumento;
  self.numeroDocumento = item.documento;
}

function createFilterFor(query) {
  angular.lowercase = text => text.toLowerCase();
  var lowercaseQuery = angular.lowercase(query);
  return function filterFn(state) {
    return (state.value.indexOf(lowercaseQuery) === 0);
  };
}

titanCrudService.get('concepto_nomina','query=TipoConcepto.Nombre:seguridad_social,NombreConcepto__startswith:incapacidad').then(
  function(response) {
    self.listaIncapacidades = response.data;
  }
);

self.setTipoIncapacidad = function(item) {
  if (item !== undefined) {
    self.tipoIncapacidad = item;
  }
};

self.minDate = function() {
  var minDate = self.fechaDesde;
  return new Date(
    minDate.getFullYear(),
    minDate.getMonth(),
    minDate.getDate + 3
  );
};

function validarCampos() {
  var validacion = { validado: false, mensaje: '', alerta: true };
  if (proveedor.id <= 0) {
    validacion.mensaje = $translate.instant('VALIDACION.PERSONA_INVALIDA');
  } else if (self.tipoIncapacidad === undefined) {
    validacion.mensaje = $translate.instant('VALIDACION.TIPO_IDENTIFICACION');
  } else if (self.fechaDesde === undefined) {
    validacion.mensaje = $translate.instant('VALIDACION.FECHA_INCIO');
  } else if (self.fechaHasta === undefined) {
    validacion.mensaje = $translate.instant('VALIDACION.FECHA_FIN');
  } else {
    validacion.validado = true;
    validacion.alerta = false;
  }
  return validacion;
}

// Llama al método post de concepto_nomina_por_persona desde titanCrudService
function incapacidadPost(incapacidad, errorRegistro) {
  titanCrudService.post('concepto_nomina_por_persona',incapacidad).then(function(response) {
    if(response.statusText === 'Created') {
      errorRegistro = false;
    } else {
      errorRegistro = true;
    }
  });
}

// Disparador para el botón de guardar
self.registrarIncapacidad = function() {
  var validar = validarCampos();
  var errorRegistro = false;
  if (validar.validado) {
    var concepto = { Id: parseInt(self.tipoIncapacidad.Id) };

    for (var i = 0; i < proveedor.nominas.length; i++) {
      var incapacidad = {
        ValorNovedad: 0,
        NumCuotas: 999,
        Activo: true,
        FechaDesde: self.fechaDesde,
        FechaHasta: self.fechaHasta,
        FechaRegistro: new Date(),
        Persona: proveedor.id,
        Concepto: concepto,
        Nomina: { Id: parseInt(proveedor.nominas[i]) },
        Tipo: 'fijo'
      };
      incapacidadPost(incapacidad);
    }

    if (errorRegistro) {
      swal($translate.instant('INCAPACIDADES.ERROR_REGISTRO'));
    } else {
      swal($translate.instant('INCAPACIDADES.REGISTRADA'));
    }

  } else {
    self.alerta = validar.alerta;
    self.alerta = validar.mensaje;
  }
};

});
