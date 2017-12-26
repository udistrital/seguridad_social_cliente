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
      preliquidacion: '='
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
          {field: 'Concepto.AliasConcepto', visible: true, displayName: 'Concepto', width: '50%',
            cellTooltip: function(row, col) {
                return row.entity.Concepto.AliasConcepto;
              }},
          {
            field: 'Persona.Id', visible: false, displayName: 'Persona'
          },
          {
            field: 'ValorCalculado', visible: true, displayName: 'Valor',
            cellFilter: 'currency', cellTemplate: '<div align="right">{{row.entity.ValorCalculado | currency}}</div>'
          },
          {
            field: 'DiasLiquidados', visible: true, displayName: 'Días Liquidados',
            cellTemplate: '<div align="center">{{row.entity.DiasLiquidados}}</div>'
          }
        ]};

        $scope.$watch("persona", function(){
          titanCrudService.get('detalle_preliquidacion','limit=0&query=NumeroContrato:'+$scope.persona.Persona+',Concepto.TipoConcepto.Nombre:seguridad_social,Preliquidacion.Id:'+JSON.parse($scope.preliquidacion).Id+'&fields=Concepto,ValorCalculado,DiasLiquidados')
          .then(function(response) {
            var detalle_liquidacion = response.data;
            detalle_liquidacion.push(
              {
                Concepto: { AliasConcepto: 'Salud Universidad' },
                ValorCalculado: $scope.persona.SaludUd
              },
              {
                Concepto: { AliasConcepto: 'Pensión Universidad'},
                ValorCalculado: $scope.persona.PensionUd
              });
            self.gridOptions.data = detalle_liquidacion;
          });
        });
      },
      controllerAs:'d_ingresosDeCotizacion'
    };
  });
