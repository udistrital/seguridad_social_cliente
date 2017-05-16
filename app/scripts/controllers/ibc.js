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
  var conceptos = [];
  var conceptosActivos = [];

  /*  Conceptos de IBC salud
  2,7,8,11,18,29,39,51,52,57,58,60,61,68,74,76,78,174,177,179,195,201,202,206,209,213,214,
  225,226,227,230,232, 239,240,242,245,248,249,250,251,252,253,254,257
  */

  seguridadSocialService.get('desc_seguridad_social/ConceptosIbc', '').then(function(response) {
    angular.forEach(response.data, function(data){
      conceptosActivos.push(data)
    });
    //Se ejecuta despues de cargado el doom
    $scope.$$postDigest( function() {
      bloquearConceptos();
    });
    self.conceptosActivos = conceptosActivos;
  });

  /*
  Le asigna el atributo checked a todos los objetos del arreglo conceptosActivos
  con el estado 1 para que aparezcan seleccionados al cargar la pagina
  */
  var bloquearConceptos = function() {
    for (var i = 0; i < conceptosActivos.length; i++) {
      document.getElementById(conceptosActivos[i].Id).disabled = true;
    }
  };

  self.select = function(item) {
    //console.log(item);
    var encontrado = buscarConcepto(item);
    //console.log(encontrado);
    if (encontrado <= 0) {
      conceptos.push(item);
    } else {
      conceptos.splice(encontrado,1);
    }
    console.log(conceptos);
    self.conceptos = conceptos;
  };


  function buscarConcepto(item) {
    if (conceptos.length == 0) {
      return 0;
    } else {
      var searchTerm = item.Id,
      index = -1;
      for(var i = 0; i < conceptos.length; i++) {
        if (conceptos[i].Id === searchTerm) {
          index = i;
          break;
        }
      }
      return index;
    }
  }

  self.guardar = function() {
    swal('Conceptos registrados exitosamente')
  }

  self.habilitarEdicion = function() {
    swal('¿Continuar con la edición?')
    for (var i = 0; i < conceptosActivos.length; i++) {
      document.getElementById(conceptosActivos[i].Id).disabled = false;
    }
  }
});
