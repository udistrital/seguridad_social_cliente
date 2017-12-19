'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:loading
 * @description
 * # loading
 */
angular.module('ssClienteApp')
    .directive('loadingcircle', function() {
        return {
            restrict: 'E',
            scope: {
                load: '=?',
            },
            templateUrl: 'views/directives/loading.html',
            controller: function($scope, $interval, cfpLoadingBar, $translate) {
                $scope.options = {
                    unit: "%",
                    readOnly: true,
                    subText: {
                        enabled: true,
                        text: $translate.instant('CARGANDO'),
                        color: 'gray',
                        font: 'auto'
                    },
                    trackWidth: 30,
                    barWidth: 10,
                    trackColor: '#656D7F',
                    barColor: '#003e65'
                };
                $interval(function() {
                    $scope.loading = parseInt(cfpLoadingBar.status() * 100);
                    if ($scope.loading === 0 || $scope.loading === 100) {
                        $scope.load = false;
                    } else {
                        $scope.load = true;
                    }
                }, 5);
            }
        };
    });
