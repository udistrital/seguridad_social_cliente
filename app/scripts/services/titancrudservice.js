'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.titanCrudService
 * @description
 * # titanCrudService
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('titanCrudService', function ($http, CONF, token_service) {

    var path = CONF.GENERAL.TITAN_CRUD_SERVICE;

    return {
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
