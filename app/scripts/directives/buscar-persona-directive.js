'use strict';

/**
 * @ngdoc directive
 * @name ssClienteApp.directive:buscarPersonaDirective
 * @description
 * # buscarPersonaDirective
 */
angular.module('ssClienteApp')
  .directive('buscarPersonaDirective', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'add-view.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_buscarPersonaDirective'
    };
  });
