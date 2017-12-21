'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:IncapcidadesCtrl
* @description
* # IncapcidadesCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('IncapacidadesCtrl', function (agoraService, titanCrudService, administrativaAmazonService, $scope, $timeout, $q, $log, $translate) {
  var self = this;
  var idProveedor = 0;
  var proveedores = [];
  var contratos = [];
  var nominas = [];

  titanCrudService.get('nomina', '').then(function(response) {
    nominas = response.data;
  });

  agoraService.get('informacion_proveedor','limit=-1&query=Tipopersona:NATURAL').then(function(response) {
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
      if (item !== undefined) {
        idProveedor = item.id;
        administrativaAmazonService.get('contrato_general','limit=0&query=Estado:true,Contratista:'+idProveedor).then(function(response) {
          contratos = response.data;
          if (contratos === null) {
            self.noContrato = 'Está persona no tiene contratos vigentes';
          } else {
            self.noContrato = '';
          }
        });
      }
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
    //autocomplete

    self.states        = proveedores;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;


    titanCrudService.get('concepto_nomina','query=TipoConcepto.Nombre:seguridad_social,NombreConcepto__startswith:incapacidad').then(
      function(response) {
        self.listaIncapacidades = response.data;
      }
    );

    self.setTipoIncapacidad = function(item) {
      if (item !== undefined) {
        self.tipoIncapacidad = item;
      }
    }

    self.minDate = function() {
      var minDate = self.fechaDesde;
      return new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate + 3
      );
    }

    function validarCampos() {
      var validacion = {validado: false, mensaje: '', alerta: true};
      if (idProveedor <= 0) {
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

    self.registrarIncapacidad = function() {
      var validar = validarCampos();
      var errorRegistro = false;
      if (validar.validado) {
        var concepto = { Id: parseInt(self.tipoIncapacidad.Id) }
        var nomina = { Id: 0 };

        for (var i in contratos) {
          switch (contratos[i].TipoContrato.Id) {
            case 2: // HC Salarios
            nomina.Id = 5;
            break;
            case 3: // HC Honorarios
            nomina.Id = 4;
            break;
            case 6: // Contratista
            nomina.Id = 3;
            break;
          }

          var incapacidad = {
            ValorNovedad: 0,
            NumCuotas: 999,
            Activo: true,
            FechaDesde: self.fechaDesde,
            FechaHasta: self.fechaHasta,
            FechaRegistro: new Date(),
            Persona: idProveedor,
            Concepto: concepto,
            Nomina: nomina,
            Tipo: 'fijo'
          };

          titanCrudService.post('concepto_nomina_por_persona',incapacidad).then(function(response) {
            console.log(response);
            if(response.statusText === 'Created') {
              swal($translate.instant('INCAPACIDADES.REGISTRADA'));
            } else {
              errorRegistro = true;
            }
          }).catch(function() {
            errorRegistro = true;
          });
        }

        if (errorRegistro) {
          swal($translate.instant('INCAPACIDADES.ERROR_REGISTRO'));
        }

      } else {
        self.alerta = validar.alerta;
        self.alerta = validar.mensaje;
      }
    };
  });
