'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:IbcCtrl
* @description
* # IbcCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
  .controller('IbcCtrl', function ($scope, rulerservice, seguridadSocialService) {
    var self = this;
    self.conceptos = [];

    seguridadSocialService.get('pago/ConceptosIbc', '').then(function (response) {
      self.conceptosActivos = response.data;
      //Se ejecuta despues de cargado el doom
      $scope.$$postDigest(function () {
        bloquearConceptos();
      });
    });

    /*
    Le asigna el atributo checked a todos los objetos del arreglo conceptosActivos
    con el estado 1 para que aparezcan seleccionados al cargar la pagina
    */
    var bloquearConceptos = function () {
      for (var i = 0; i < self.conceptosActivos.length; i++) {
        document.getElementById(self.conceptosActivos[i].Id).disabled = true;
      }
    };

    /* Cambia el esatdo de un concepto buscado a través del parámetro item*/
    self.actualizarConcepto = function (item) {
      for (var i = 0; i < self.conceptosActivos.length; i++) {
        if (self.conceptosActivos[i].Id === item.Id) {
          self.conceptosActivos[i].Estado = !self.conceptosActivos[i].Estado;
        }
      }
    }

    self.guardar = function () {
      seguridadSocialService.post('conceptos_ibc/ActualizarConceptos/ibc', self.conceptosActivos).then(function (response) {
        if (response.data.Code === "1") {
          swal('Conceptos actualizados exitosamente', '', 'success');
        } else {
          swal('Error al actualizar conceptos', '', 'error');
        }
        if (response.data === undefined) {
          swal('Error al actualizar conceptos', '', 'error');
        }

      })
    }

    /** Mensaje de alerta para el usuario, si quiere continuar con la edición de los conceptos de IBC */
    self.habilitarEdicion = function () {
      swal({
        title: "¿Continuar con la edición?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#32CD32",
        confirmButtonText: "Continuar"
      }).then(function() {
          desbloquearEdicion();
      })
    }

    /** Desbloquea todos los check-box del formulario */
    function desbloquearEdicion() {
      for (var i = 0; i < self.conceptosActivos.length; i++) {
        document.getElementById(self.conceptosActivos[i].Id).disabled = false;
      }
    }

  });
