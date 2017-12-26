'use strict';

/**
 * @ngdoc service
 * @name notificacionesApp.notificacion
 * @description
 * # notificacion
 * Factory in the notificacionesApp.
 */
 //10.20.0.254/notificacion_api/register?id=1&profile=admin

angular.module('ssClienteApp')
  .factory('notificacion', function($websocket) {
    var dataStream = $websocket("ws://localhost:8080/register?id=2&profile=admin");
    var log = [];
    dataStream.onMessage(function(message) {
      log.unshift(JSON.parse(message.data));
    });

    var methods = {
      id : -1,
      log: log,
      get: function() {
        dataStream.send(JSON.stringify({
          action: 'get'
        }));
      },
      no_vistos: function() {
        var j = 0;
        angular.forEach(methods.log, function(notificiacion) {
          if (!notificiacion.viewed) {
            j += 1;
          }
        });
        return j;
    }

    };
    return methods;
  });
