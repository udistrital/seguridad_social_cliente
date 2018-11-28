'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.administrativaAmazonService
 * @description
 * # administrativaAmazonService
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('administrativaAmazonService', function ($http, CONF, token_service) {
    
    var path = CONF.GENERAL.ADMINISTRATIVA_AMAZON_SERVICE;

    return {
      get: function (tabla,params) {
        console.log(token_service);
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
