'use strict';

/**
* @ngdoc directive
* @name ssClienteApp.directive:conceptoPorPersona
* @description
* # conceptoPorPersona
*/
angular.module('ssClienteApp')
  .directive('conceptoPorPersona', function () {
    return {
      restrict: 'E',
      scope: {
        persona: '=',
        preliquidacion: '='
      },
      templateUrl: 'views/directives/concepto-por-persona.html',
      controller: function (titanCrudService, $scope, $translate) {
        var self = this;

        self.gridOptions = {
          enableFiltering: false,
          enableSorting: true,
          treeRowHeaderAlwaysVisible: false,
          showTreeExpandNoChildren: false,

          columnDefs: [
            { field: 'Persona', visible: false },
            { field: 'Naturaleza', visible: false },
            {
              field: 'Concepto.AliasConcepto', visible: true, displayName: 'Novedad', width: '30%',
              cellTooltip: function (row, col) {
                return row.entity.AliasConcepto;
              },
            },
            {
              field: 'ValorNovedad', vislble: false, displayName: $translate.instant('CONCEPTO_PERSONA.VALOR_NOVEDAD'),
              cellTemplate: '<div align="right">{{row.entity.ValorNovedad | currency}}</div>', cellFilter: 'currency'
            },
            {
              field: 'FechaDesde', visible: true, displayName: $translate.instant('CONCEPTO_PERSONA.FECHA_DESDE'),
              cellTemplate: '<div align="right"><span>{{row.entity.FechaDesde | date:"yyyy-MM-dd":"+0900"}}</span></div>'
            },
            {
              field: 'FechaHasta', visible: true, displayName: $translate.instant('CONCEPTO_PERSONA.FECHA_HASTA'),
              cellTemplate: '<div align="right"><span>{{row.entity.FechaHasta | date:"yyyy-MM-dd":"+0900"}}</span></div>'
            }
          ]
        };


        //se realiza cuando persona tiene un cambio de valor
        $scope.$watch("persona", function () {
          // self.noData = true;
          titanCrudService.get('detalle_preliquidacion', 'fields=Concepto&query=Concepto.NaturalezaConcepto.Nombre:seguridad_social,Persona:' + $scope.persona.IdProveedor).then(function (response) {

            angular.forEach(response.data, function (data) {
              if (data.Concepto.NombreConcepto !== 'ibc_liquidado') {
                titanCrudService.get('concepto_nomina_por_persona', 'query=Concepto.NaturalezaConcepto.Nombre:seguridad_social,Concepto.EstadoConceptoNomina.Nombre:activo,Persona:' + $scope.persona.IdProveedor).then(function (responseConcepto) {
                  self.gridOptions.data = responseConcepto.data;
                  if(responseConcepto.data === null) {
                    self.noData = true;
                  } else {
                    self.noData = false;
                  }
                }).catch(function() {
                  self.noData = true;
                });
              } else {
                self.gridOptions.data = null;
              }
            });
          });
        });
      },
      controllerAs: 'd_novedadPersona'
    };
  });
