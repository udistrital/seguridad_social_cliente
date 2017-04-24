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
    controller:function(seguridadSocialService, titanCrudService, $scope){
      var self = this;

      self.gridOptions = {
        enableFiltering : false,
        enableSorting : true,
        treeRowHeaderAlwaysVisible : false,
        showTreeExpandNoChildren : false,

        columnDefs : [
          { field: 'Persona', visible: false },
          { field: 'Naturaleza', visible: false},
          { field: 'AliasConcepto', visible: true, displayName: 'Novedad' },
          { field: 'ValorCalculado', vislble: false, displayName: 'Valor', cellFilter: 'currency' },
          { field: 'FechaDesde', visible: true, displayName: 'Fecha de Inicio',
          cellTemplate: '<span>{{row.entity.FechaDesde | date:"yyyy-MM-dd":"+0900"}}</span>' },
          { field: 'FechaHasta', visible: true, displayName: 'Fecha de Finlización',
          cellTemplate: '<span>{{row.entity.FechaHasta | date:"yyyy-MM-dd":"+0900"}}</span>' }
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
