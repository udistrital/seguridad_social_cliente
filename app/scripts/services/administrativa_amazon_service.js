'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.administrativaAmazonService
 * @description
 * # administrativaAmazonService
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('administrativaAmazonService', function ($http) {
    
    var path = 'http://10.20.0.254/administrativa_amazon_api/v1/';

    return {
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
