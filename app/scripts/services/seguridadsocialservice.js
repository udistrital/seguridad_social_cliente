'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.seguridadSocialService
 * @description
 * # seguridadSocialService
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('seguridadSocialService', function ($http, CONF, token_service) {

    var path = CONF.GENERAL.SS_MID_SERVCE;

    return {
      getServicio: function(servicio, parametro) {
        return $http.get(path+servicio+"/"+parametro, token_service.getHeader());
      },
      get: function (tabla,params) {
        return $http.get(path+tabla+"?"+params, token_service.getHeader());
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
