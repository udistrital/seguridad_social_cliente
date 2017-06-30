'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:VistaPruebaCtrl
 * @description
 * # VistaPruebaCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('VistaPruebaCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var self = this;

    self.saludo = "Hola";
  });
