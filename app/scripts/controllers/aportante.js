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
        seguridadSocialCrudService.put('aportante', infoActual.Id, infoActual).then(function(response) {
          swal(
            'Registro Exitoso',
            'Información Actualizada',
            'success'
          )
        });
      }

      if (nuevaInfo != null) {
        nuevaInfo.Activo = false;
        seguridadSocialCrudService.put('aportante', nuevaInfo.Id, nuevaInfo).then(function(response) {
          infoActual = null;
          swal(
            'Registro Exitoso',
            'Información Guardada',
            'success'
          )
        });
      }

      //Guarda la nueva información de self.infoAportante
      self.infoAportante.Id = null; //Se establece a null para que al agregar no encuentre un id repetido
      seguridadSocialCrudService.post('aportante',self.infoAportante).then(function(response) {
        if (typeof response.data === 'object') {
          nuevaInfo = response.data;
          infoActual = null;
          swal(
            'Registro Exitoso',
            'Información Guardada',
            'success'
          )
        } else {
          nuevaInfo = null;
        };
      });
    };

  });
