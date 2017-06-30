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
          { field: 'ValorCalculado', vislble: false, displayName: 'Valor', cellTemplate: '<div align="right">{{row.entity.ValorCalculado | currency}}</div>', cellFilter: 'currency' },
          { field: 'FechaDesde', visible: true, displayName: 'Fecha Inicio',
          cellTemplate: '<div align="right"><span>{{row.entity.FechaDesde | date:"yyyy-MM-dd":"+0900"}}</span></div>' },
          { field: 'FechaHasta', visible: true, displayName: 'Fecha Finalización',
          cellTemplate: '<div align="right"><span>{{row.entity.FechaHasta | date:"yyyy-MM-dd":"+0900"}}</span></div>' }
        ]};


        //se realiza cuando persona tiene un cambio de valor
        $scope.$watch("persona", function(){
          var novedades = [];
          self.noData = true;

          titanCrudService.get('concepto/get_conceptos_ss/'+ $scope.persona.Persona, '')
          .then(function(response) {
            if (response.statusText === "OK") {
              novedades.push(response.data);
              self.gridOptions.data = novedades;
              self.noData = false;
            }
          });
        });
      },
      controllerAs:'d_novedadPersona'
    };
  });
