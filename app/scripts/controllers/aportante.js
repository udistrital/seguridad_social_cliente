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
    var infoActual;
    var nuevaInfo;

    self.infoAportante = {
      Nombre: '',
      CodArl: '',
      Identificacion: '',
      CodDepartamento: '',
      CodMunicipio: '',
      Activo: true,
      Id: null
    };

    seguridadSocialCrudService.get('aportante', 'limit=1&query=Activo:true').then(function(response) {
      if (response.data == null) {
        infoActual == null;
        nuevaInfo == null;
      } else {
        infoActual = angular.copy(response.data[0]);
        self.infoAportante = response.data[0];
      }
    });

    self.guardar = function() {
      if (infoActual != null) {
        infoActual.Activo = false;
        console.log(infoActual);
        seguridadSocialCrudService.put('aportante', infoActual.Id, infoActual).then(function(response) {
          console.log('Actualizada info actual');
        });
      }

      if (nuevaInfo != null) {
        nuevaInfo.Activo = false;
        console.log(nuevaInfo);
        seguridadSocialCrudService.put('aportante', nuevaInfo.Id, nuevaInfo).then(function(response) {
          infoActual = null;
          console.log('Actualizada nuevaInfo');
        });
      }

      //Guarda la nueva información de self.infoAportante
      self.infoAportante.Id = null; //Se establece a null para que al agregar no encuentre un id repetido
      seguridadSocialCrudService.post('aportante',self.infoAportante).then(function(response) {
        if (typeof response.data === 'object') {
          nuevaInfo = response.data;
          infoActual = null;
        } else {
          nuevaInfo = null;
        };
      });
    };

  });
