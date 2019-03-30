'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.agoraservice
 * @description
 * # agoraservice
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('agoraService', function ($http, CONF, token_service) {

    // var path = 'http://10.20.0.254/administrativa_amazon_api/v1/';
    var path = CONF.GENERAL.AGORA_SERVICE;
    
    // Public API here
    return {
      getServicio: function(servicio, parametro) {
        return $http.get(path+servicio+"/"+parametro, token_service.getHeader());
      },
      get: function (tabla,params) {
        return $http.get(path+tabla+"/?"+params, token_service.getHeader());
      },
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento, token_service.getHeader());
      },
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento, token_service.getHeader());
      },
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id, token_service.getHeader());
      }
    };
  });
