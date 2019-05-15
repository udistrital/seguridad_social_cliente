'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:PersonaUpcCtrl
 * @description
 * # PersonaUpcCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('PersonaUpcCtrl', function (administrativaAmazonService, seguridadSocialCrudService, titanCrudService, seguridadSocialService, $scope, $timeout, $q, $log) {
    var self = this;
    var idProveedor = 0;
    var fechaActual = null;

    self.variablesForm = {
      numDocumento: self.numDocumento,
      nombre: self.nombre,
      apellido: self.apellido,
      valorUpc: { "Valor": 0 },
    };

    seguridadSocialService.get('utils/GetActualDate', '').then(function(response) {
      fechaActual = new Date(response.data.fecha_actual);
    });

    seguridadSocialCrudService.get('zona_upc', 'limit=-1').then(function (response) {
      self.tipoZona = response.data;
    });

    seguridadSocialCrudService.get('rango_edad_upc', 'query=AplicaGenero__icontains:M').then(function (response) {
      var response = response.data;
      self.generos = {};
      for (var i = 0; i < response.length; i++) {
        const element = response[i];
        if (self.generos.length == 0) {
          self.generos[element.AplicaGenero] = true;
        } else if (!self.generos[element.AplicaGenero]) {
          self.generos[element.AplicaGenero] = true;
        }
      }
    })

    seguridadSocialCrudService.get('rango_edad_upc', 'limit=-1&sortby=EdadMin&order=asc').then(
      function (response) {
        self.rangosEdad = response.data;
      });

    titanCrudService.get('categoria_beneficiario', '').then(function (response) {
      self.tiposParentesco = response.data;
    });

    administrativaAmazonService.get('parametro_estandar', 'query=ClaseParametro:Tipo%20Documento&limit=-1').then(function (response) {
      self.tipoDocumento = response.data;
    });

    self.cambiarZona = function () {
      if (self.edad !== null) {
        traerValorUpc(self.zona, self.edad.Id);
      }
    };

    self.cambiarEdad = function () {
      if (self.zona !== null) {
        traerValorUpc(self.zona, self.edad);
      }
    };

    self.calcularEdad = function () {
      var today = new Date();
      var birthday = self.variablesForm.fechaNacimiento;
      var age = today.getFullYear() - birthday.getFullYear();
      var m = today.getMonth() - birthday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }
      self.edadUpc = age;
      for (var i = 0; i < self.rangosEdad.length; i++) {
        var element = self.rangosEdad[i];
        if (age >= element.EdadMin && age <= element.EdadMax) {
          self.edad = element;
          if (element.AplicaGenero !== "") {
            if (element.AplicaGenero === self.generoUpc) {
              self.edad = element;
              break;
            }
          }
        }
      }
      traerValorUpc(self.zona, self.edad.Id);
    }

    function traerValorUpc(idZona, idRangoEdad) {
      seguridadSocialCrudService.get('tipo_upc', 'limit=1&query=ZonaUpc:' + idZona + ',RangoEdadUpc:' + idRangoEdad).then(function (response) {
        self.variablesForm.valorUpc = response.data[0];
      });
    }

    self.reset = function () {
      self.variablesForm = { valorUpc: { "Valor": 0 } };
    };

    self.guardarUpcAdicional = function () {

      var upcAdicional = {
        PersonaAsociada: self.proveedor.documento,
        ParametroEstandar: parseInt(self.tipoIdentificacion),
        NumDocumento: self.variablesForm.numDocumento,
        PrimerNombre: self.variablesForm.nombre,
        SegundoNombre: self.variablesForm.segundoNombre,
        PrimerApellido: self.variablesForm.apellido,
        SegundoApellido: self.variablesForm.segundoApellido,
        FechaNacimiento: self.variablesForm.fechaNacimiento,
        Activo: true,
        FechaInicio: fechaActual
      };

      if (!self.beneficiario) {
          seguridadSocialCrudService.post('beneficiarios', upcAdicional).then(function (response) {
            if (response.statusText === 'Created') {
              swal('Beneficiario registrado');
            } else {
              swal('No se ha logrado registrar el beneficiario');
            }
          });
      } else {
        var idTipoUpc = { Id: self.variablesForm.valorUpc.Id };
        upcAdicional.TipoUpc = idTipoUpc;
        seguridadSocialCrudService.post('upc_adicional', upcAdicional).then(function (response) {
          if (response.statusText === 'Created') {
            swal('Beneficiario Adicional Adicional Registrada');
            self.reset();
          } else {
            swal('No se ha logrado registrar el beneficiario adicional');
          }
        });
      }

    };
  });
