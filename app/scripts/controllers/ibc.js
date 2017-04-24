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

  seguridadSocialService.get('seg_social/ConceptosIbc', '').then(function(response) {
    var conceptosIbc = response.data;
    self.conceptosActivos = conceptosIbc;
  });

  /*  Conceptos de IBC salud
  2,7,8,11,18,29,39,51,52,57,58,60,61,68,74,76,78,174,177,179,195,201,202,206,209,213,214,
  225,226,227,230,232, 239,240,242,245,248,249,250,251,252,253,254,257
  */

  //Se ejecuta despues de cargado el doom
  $scope.$$postDigest( function() {
    //seleccionados();
  });

  /*
  Le asigna el atributo checked a todos los objetos del arreglo conceptosActivos
  con el estado 1 para que aparezcan seleccionados al cargar la pagina
  */
  var seleccionados = function() {
    for (var i = 0; i < conceptosActivos.length; i++) {
      if (conceptosActivos[i].estado === 1) {
        document.getElementById(conceptosActivos[i].id).checked = true;
      }
    }
  };

  self.select = function(item) {
    console.log(item);
    var encontrado = buscarConcepto(item);
    console.log(encontrado);
    if (encontrado <= 0) {
      conceptos.push(item);
    } else {
      conceptos.splice(encontrado,1);
    }
    console.log(conceptos);
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
    swal(
      'The Internet?',
      'That thing is still around?',
      'question'
    )
  }
});
