'use strict';

/**
 * @ngdoc directive
 * @name ssClienteApp.directive:upcDetalleActivos
 * @description
 * # upcDetalleActivos
 */
angular.module('ssClienteApp')
  .directive('upcDetalleActivos', function () {
    return {
      restrict: 'E',
      scope:{
          persona:'='
        },

      templateUrl: 'views/directives/upc-detalle-activos.html',
      controller:function(seguridadSocialCrudService, $scope){
        var self = this;

        self.gridOptions = {
          enableFiltering: false,
          enableSorting: true,
          treeRowHeaderAlwaysVisible: false,
          showTreeExpandNoChildren: false,

          columnDefs: [
            { name: 'Documento', headerCellTemplate: '<div align="center">Documento</div>'},
            { name: 'Nombre', headerCellTemplate: '<div align="center">Nombre</div>'},
            { name: 'Apellido', headerCellTemplate: '<div align="center">Apellido</div>'},
            { name: 'IdTipoUpc.Valor',
              headerCellTemplate: '<div align="center">Valor</div>',
              cellTemplate: '<div align="right">{{row.entity.IdTipoUpc.Valor | currency}}</div>' }
          ]
        }

        $scope.$watch("persona", function() {
          seguridadSocialCrudService.get('upc_adicional','limit=0&query=Estado:Activo,PersonaAsociada:'+$scope.persona.Persona)
            .then( function(response) {
              self.gridOptions.data = response.data;
            }
          )
            console.log($scope.persona);
        });

      },
      controllerAs:'d_upcDetalleActivos'
    };
  });
