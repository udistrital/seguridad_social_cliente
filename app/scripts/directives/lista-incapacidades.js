'use strict';

/**
 * @ngdoc directive
 * @name ssClienteApp.directive:listaIncapacidades
 * @description
 * # listaIncapacidades
 */
angular.module('ssClienteApp')
  .directive('listaIncapacidades', function () {
    return {
      restrict: 'E',
      scope:{
        contrato:'=?',
        incapacidad: '=?'
      },
      
      templateUrl: 'views/directives/lista-incapacidades.html',
      controller:function($scope, $q, titanCrudService, seguridadSocialService){
        var self = this;

        self.gridOptions = {
          enableRowHeaderSelection: false,
          enableRowSelection: true,
          columnDefs: 
          [
            { field: 'Concepto.AliasConcepto', name: 'Tipo de Incapacidad'},
            { field: 'FechaDesde', name: 'Fecha de inicio', cellTemplate: '<div align="center">{{row.entity.FechaDesde | date:"dd-MM-yyyy"}}</div>' },
            { field: 'FechaHasta', name: 'Fecha de fin', cellTemplate: '<div align="center">{{row.entity.FechaHasta | date:"dd-MM-yyyy"}}</div>' },
            { field: 'FechaRegistro', name: 'Fecha de registro', cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"dd-MM-yyyy"}}</div>' },
            { filed: 'NumeroContrato', name: 'NumeroContrato' },
            { field: 'VigenciaContrato', name: 'Vigencia' },
            { field :'Codigo', name: 'Codigo'},
            { name: 'Seleccionar', cellTemplate: '<div align="center"><span class="glyphicon glyphicon-ok" ng-click="grid.appScope.d_listaIncapacidades.select(row.entity)"></span></div>'}
          ]
        };

        self.select = function(row) {
          $scope.incapacidad = row;
        }

        seguridadSocialService.get('incapacidades/incapacidadesPersona/'+$scope.contrato.numContrato+'/'+$scope.contrato.vigContrato, '').then(function(response) {
          self.gridOptions.data = response.data;
        });

      },
      controllerAs:'d_listaIncapacidades'
    };
  });
