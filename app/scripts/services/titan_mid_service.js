'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.titanMidService
 * @description
 * # titanMidService
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('titanMidService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var path = 'http://10.20.0.254/titan_api_mid/v1/';
    // var path = 'http://localhost:8082/v1/';


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
