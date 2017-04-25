'use strict';

/**
* @ngdoc directive
* @name ssClienteApp.directive:ingresosDeCotizacion
* @description
* # ingresosDeCotizacion
*/
angular.module('ssClienteApp')
.directive('ingresosDeCotizacion', function () {
  return {
    restrict: 'E',
    scope:{
      persona:'=',
      liquidacion: '='
    },
    templateUrl: 'views/directives/ingresos-de-cotizacion.html',
    controller:function(uigridservice, titanCrudService, $scope){
      var self = this;

      self.gridOptions = {
        enableFiltering: false,
        enableSorting: true,
        treeRowHeaderAlwaysVisible: false,
        showTreeExpandNoChildren: false,

        columnDefs: [
          {field: 'Concepto.AliasConcepto', visible: true, displayName: 'Concepto',
            cellTooltip: function(row, col) {
                return row.entity.Concepto.AliasConcepto;
              }},
          {field: 'Persona.Id', visible: false, displayName: 'Persona'},
          {field: 'ValorCalculado', visible: true, displayName: 'Valor', cellFilter: 'currency'},
          {field: 'DiasLiquidados', visible: true, displayName: 'Días Liquidades'}
        ]};

        $scope.$watch("persona", function(){
          titanCrudService.get('detalle_liquidacion','limit=0&query=Persona:'+$scope.persona.Persona+',Concepto.Naturaleza:seguridad_social,Liquidacion.Id:'+$scope.liquidacion+'&fields=Concepto,ValorCalculado,DiasLiquidados')
          .then(function(response) {
            var detalle_liquidacion = response.data;
            detalle_liquidacion.push(
              {
                Concepto: { AliasConcepto: 'Salud Empleador' },
                ValorCalculado: $scope.persona.SaludUd
              },
              {
                Concepto: { AliasConcepto: 'Pensión Empleador'},
                ValorCalculado: $scope.persona.PensionUd
              });              
            self.gridOptions.data = detalle_liquidacion;
          });
        });
      },
      controllerAs:'d_ingresosDeCotizacion'
    };
  });
