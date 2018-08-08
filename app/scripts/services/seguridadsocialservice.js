'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.seguridadSocialService
 * @description
 * # seguridadSocialService
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('seguridadSocialService', function ($http) {

    var path = "http://localhost:8085/v1/";
    // var path = "http://10.20.2.254/ss_mid_api/v1/";
    // var path = 'http://10.20.2.126:8085/v1/';

    return {
      getServicio: function(servicio, parametro) {
        return $http.get(path+servicio+"/"+parametro);
      },
      get: function (tabla,params) {
        return $http.get(path+tabla+"/?"+params);
      },
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento);
      },
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento);
      },
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id);
      }
    };
  });
