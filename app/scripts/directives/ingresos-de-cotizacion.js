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
      scope: {
        persona: '=',
        preliquidacion: '='
      },
      templateUrl: 'views/directives/ingresos-de-cotizacion.html',
      controller: function (titanCrudService, $scope) {
        var self = this;

        self.gridOptions = {
          enableFiltering: false,
          enableSorting: true,
          treeRowHeaderAlwaysVisible: false,
          showTreeExpandNoChildren: false,

          columnDefs: [
            {
              field: 'Concepto.AliasConcepto', visible: true, displayName: 'Concepto', width: '70%',
              cellTooltip: function (row) {
                return row.entity.Concepto.AliasConcepto;
              }
            },
            {
              field: 'Persona.Id', visible: false, displayName: 'Persona'
            },
            {
              field: 'ValorCalculado', visible: true, displayName: 'Valor', width: '18%',
              cellFilter: 'currency', cellTemplate: '<div align="right">{{row.entity.ValorCalculado | currency}}</div>'
            },
            {
              field: 'DiasLiquidados', visible: true, displayName: 'Días',
              cellTemplate: '<div align="center">{{row.entity.DiasLiquidados}}</div>'
            }
          ]
        };

        $scope.$watch("persona", function () {
          titanCrudService.get('detalle_preliquidacion', 'limit=0&query=Persona:' + $scope.persona.IdProveedor +
            ',Concepto.TipoConcepto.Nombre:seguridad_social,Preliquidacion.Id:' + JSON.parse($scope.preliquidacion).Id +
            '&fields=Persona,Concepto,ValorCalculado,DiasLiquidados')


            .then(function (response) {
              var ingresos_cotizacion = {};
              var detalle_liquidacion = [];

              for (var i = 0; i < response.data.length; i++) {
                if (ingresos_cotizacion.hasOwnProperty(response.data[i].Concepto.NombreConcepto)) {
                  ingresos_cotizacion[response.data[i].Concepto.NombreConcepto].ValorCalculado += response.data[i].ValorCalculado;
                } else {
                  ingresos_cotizacion[response.data[i].Concepto.NombreConcepto] =
                    {
                      Concepto: { AliasConcepto: response.data[i].Concepto.AliasConcepto },
                      ValorCalculado: response.data[i].ValorCalculado,
                      DiasLiquidados: response.data[i].DiasLiquidados
                    };
                }
              }
              
              for (var key in ingresos_cotizacion) {
                if (ingresos_cotizacion.hasOwnProperty(key)) {
                  detalle_liquidacion.push(ingresos_cotizacion[key]);
                }
              }

              detalle_liquidacion.push(
                {
                  Concepto: { AliasConcepto: 'Valor correspondiente a la UD por salud' },
                  ValorCalculado: $scope.persona.SaludUd
                },
                {
                  Concepto: { AliasConcepto: 'Valor correspondiente al trabajador por salud' },
                  ValorCalculado: $scope.persona.SaludTotal - $scope.persona.SaludUd
                },
                {
                  Concepto: { AliasConcepto: 'Valor correspondiente a la UD por pensión' },
                  ValorCalculado: $scope.persona.PensionUd
                },
                {
                  Concepto: { AliasConcepto: 'Valor correspondiente al trabajador por pensión' },
                  ValorCalculado: $scope.persona.PensionTotal - $scope.persona.PensionUd
                },
                {
                  Concepto: { AliasConcepto: 'Fondo de Solidaridad' },
                  ValorCalculado: $scope.persona.FondoSolidaridad
                },
                {
                  Concepto: { AliasConcepto: 'ARL' },
                  ValorCalculado: $scope.persona.Arl
                },
                {
                  Concepto: { AliasConcepto: 'Caja de compensación' },
                  ValorCalculado: $scope.persona.Caja
                },
                {
                  Concepto: { AliasConcepto: 'ICBF' },
                  ValorCalculado: $scope.persona.Icbf
                }
              );
              self.gridOptions.data = detalle_liquidacion;
            });
        });
      },
      controllerAs: 'd_ingresosDeCotizacion'
    };
  });
