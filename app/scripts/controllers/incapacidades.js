'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:IncapcidadesCtrl
* @description
* # IncapcidadesCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
  .controller('IncapacidadesCtrl', function (titanCrudService, titanMidService, seguridadSocialService, $scope, $timeout, $q, $log, $translate) {
    var self = this;
    var proveedor = 0;
    self.documento = "";
    self.diasIncapacidad = 0;
    self.nominasPertenece = [];

    function getPersonas() {
      seguridadSocialService.get('incapacidades', 'documento=' + self.searchText).then(function (response) {
        self.states = response.data;
      });
    }

    //autocomplete
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    function querySearch(query) {
      if (self.states !== undefined) {
        var results = query ? self.states.filter(createFilterFor(query)) : self.states, deferred;
        if (self.simulateQuery) {
          deferred = $q.defer();
          $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
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
      self.proveedor = item;
      self.tipoDocumento = item.tipoDocumento;
      self.numeroDocumento = item.documento;
    }

    function createFilterFor(query) {
      // var lowercaseQuery = angular.lowercase(query);
      var lowercaseQuery = query.toLowerCase();
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }

    titanCrudService.get('concepto_nomina', 'query=TipoConcepto.Nombre:seguridad_social,NombreConcepto__startswith:incapacidad').then(
      function (response) {
        self.listaIncapacidades = response.data;
      }
    );

    titanCrudService.get('nomina', '').then(function (response) {
      self.nominas = response.data;
    });

    self.setTipoIncapacidad = function (item) {
      if (item !== undefined) {
        self.tipoIncapacidad = item;
      }
    };

    self.minDate = function () {
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

    // Concatena las nóminas seleccionadas al arreglo nominasPertenece
    self.toggleSelection = function (nominaId) {
      var idx = self.nominasPertenece.indexOf(nominaId);

      // fue seleccionado
      if (idx > -1) {
        self.nominasPertenece.splice(idx, 1);
      } else { // es nuevo
        self.nominasPertenece.push(nominaId);
      }
    };

    // Llama al método post de concepto_nomina_por_persona desde titanCrudService
    function incapacidadPost(incapacidad, errorRegistro) {
      titanMidService.post('concepto_nomina_por_persona/tr_registro_incapacidades', incapacidad).then(function (response) {
        if (response.statusText === 'Created') {
          errorRegistro = false;
        } else {
          errorRegistro = true;
        }
      });
    }

    self.calcularDias = function() {
      if (self.fechaDesde !== undefined && self.fechaHasta !== undefined) {
        var diff = self.fechaHasta.getTime() - self.fechaDesde.getTime();
        self.diasIncapacidad = (diff/(1000*60*60*24)) + 1; 
      }
    }

    // Disparador para el botón de guardar
    self.registrarIncapacidad = function () {
      var validar = validarCampos();
      var errorRegistro = false;
      var incapacidades = {"Conceptos":[]};
      if (validar.validado) {
        var concepto = { Id: parseInt(self.tipoIncapacidad.Id) };

        for (var i = 0; i < self.nominasPertenece.length; i++) {
          for (var j = 0; j < self.proveedor.contratos.length; j++) {
            var incapacidad = {
              ValorNovedad: 0.0,
              NumCuotas: 999,
              FechaDesde: self.fechaDesde,
              FechaHasta: self.fechaHasta,
              FechaRegistro: new Date(),
              NumeroContrato: self.proveedor.contratos[j].NumeroContrato,
              VigenciaContrato: self.proveedor.contratos[j].VigenciaContrato,
              Concepto: concepto,
              Nomina: { Id: self.nominasPertenece[i] },
              Activo: true
            };
            
            incapacidades.Conceptos.push(incapacidad);
          }
        }

        incapacidadPost(incapacidades, errorRegistro)
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




    self.infoIncapacidades = function() {
      if (self.prorroga && self.proveedor !== undefined) {
        var numContrato = "";
        var vigContrato = 0;
        for (var i = 0; i < self.proveedor.contratos.length; i++) {
          
          if(self.proveedor.contratos[i].VigenciaContrato === new Date().getFullYear()) {
            numContrato = self.proveedor.contratos[i].NumeroContrato;
            vigContrato = self.proveedor.contratos[i].VigenciaContrato;
          }
        }
        // console.log(self.proveedor);
        
        // console.log({numContrato, vigContrato});
        self.contrato = {numContrato, vigContrato};
      }
      
    } 

  });
