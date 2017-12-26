'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:CalculosCtrl
 * @description
 * # CalculosCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('CalculosCtrl', function () {
    var self = this;

    self.guardar = function() {
      swal(
        'Registro',
        'Información Guardada',
        'success'
      )
    }
  });
