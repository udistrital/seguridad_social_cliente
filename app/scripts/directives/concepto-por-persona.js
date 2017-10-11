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
    scope:{
      persona:'='
    },
    templateUrl: 'views/directives/concepto-por-persona.html',
    controller:function(titanCrudService, $scope){
      var self = this;

      self.gridOptions = {
        enableFiltering : false,
        enableSorting : true,
        treeRowHeaderAlwaysVisible : false,
        showTreeExpandNoChildren : false,

        columnDefs : [
          { field: 'Persona', visible: false },
          { field: 'Naturaleza', visible: false},
          { field: 'AliasConcepto', visible: true, displayName: 'Novedad', width: '30%',
            cellTooltip: function(row, col) {
              return row.entity.AliasConcepto;
            },},
          { field: 'ValorNovedad', vislble: false, displayName: 'Valor', cellTemplate: '<div align="right">{{row.entity.ValorNovedad | currency}}</div>', cellFilter: 'currency' },
          { field: 'FechaDesde', visible: true, displayName: 'Fecha Inicio',
          cellTemplate: '<div align="right"><span>{{row.entity.FechaDesde | date:"yyyy-MM-dd":"+0900"}}</span></div>' },
          { field: 'FechaHasta', visible: true, displayName: 'Fecha Finalización',
          cellTemplate: '<div align="right"><span>{{row.entity.FechaHasta | date:"yyyy-MM-dd":"+0900"}}</span></div>' }
        ]};


        //se realiza cuando persona tiene un cambio de valor
        $scope.$watch("persona", function(){
          var novedades = [];
          self.noData = true;

          titanCrudService.get('detalle_preliquidacion','fields=Concepto&query=Concepto.NaturalezaConcepto.Nombre:seguridad_social').then(function(response) {
            self.conceptos = response.data;
            angular.forEach(response.data,function(data) {
              if (data.Concepto.NombreConcepto !== 'ibc_liquidado' && data.Concepto.NombreConcepto !== 'ibc_novedad') {
                titanCrudService.get('concepto_nomina_por_persona','?query=Concepto.Id:'+data.Id).then(function(response) {
                  self.gridOptions.push(response.data);
                });
              } else {
                self.gridOptions.data = null;
              }
            });
          });
        });
      },
      controllerAs:'d_novedadPersona'
    };
  });
