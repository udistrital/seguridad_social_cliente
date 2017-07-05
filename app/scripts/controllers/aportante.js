'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:AportanteCtrl
 * @description
 * # AportanteCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('AportanteCtrl', function (seguridadSocialCrudService) {
    var self = this;
    var infoActual = {};

    self.infoAportante = {
      Nombre: '',
      CodArl: '',
      Identificacion: '',
      CodDepartamento: '',
      CodMunicipio: '',
      Activo: true
    };

    seguridadSocialCrudService.get('aportante','limit=1&query=activo:true').then(function(response) {
      if(response.data != null) {
        infoActual = response.data[0];
      } else {
        infoActual = null;
      }
    });

    self.guardar = function() {
      if(infoActual != null) {
        infoActual.Activo = false;
        //console.log(infoActual);
        seguridadSocialCrudService.put('aportante', infoActual.Id).then(function(response) {
          console.log(infoActual);
          console.log(response.data);
        });
      }
/*
      seguridadSocialCrudService.post('aportante',self.infoAportante).then(function(response) {
        if (typeof response.data == 'object') {
          console.log('registro!');
        } else {
          console.log(response.data);
        }
      });
      */
    }
  });
