'use strict';

/**
 * @ngdoc service
 * @name ssClienteApp.seguridadSocialCrudService
 * @description
 * # seguridadSocialCrudService
 * Service in the ssClienteApp.
 */
angular.module('ssClienteApp')
  .service('seguridadSocialCrudService', function ($http) {

    var path = 'http://localhost:8086/v1/';
    // var path = 'http://10.20.0.254/ss_crud_api/v1/';
    // var path = 'http://10.20.2.126:8086/v1/';

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
