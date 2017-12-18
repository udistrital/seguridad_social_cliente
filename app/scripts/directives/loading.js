'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:loading
 * @description
 * # loading
 */
angular.module('ssClienteApp')
    .directive('loading', function() {
        return {
            restrict: 'E',
            scope: {
                load: '=',
                tam: '=?',
                clase: "="
            },
            template: '<div class="loading" ng-show="load">' +
                '<i class="{{clase.clase}} fa-spin fa-{{tam}}x {{clase.animacion}}" aria-hidden="true" ></i>' +
                '</div>',
            controller: function($scope) {
                if ($scope.tam === undefined) {
                    $scope.tam = 5;
                }
                if ($scope.clase === undefined) {
                    $scope.clase = {
                        clase: "fa fa-clock-o",
                        animacion: "faa-burst animated"
                    };
                }
            }
        };
    });