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
            { name: 'NumDocumento', headerCellTemplate: '<div align="center">Documento</div>'},
            { name: 'PrimerNombre', headerCellTemplate: '<div align="center">Nombre</div>'},
            { name: 'PrimerApellido', headerCellTemplate: '<div align="center">Apellido</div>'},
            { name: 'TipoUpc.Valor',
              headerCellTemplate: '<div align="center">Valor</div>',
              cellTemplate: '<div align="right">{{row.entity.TipoUpc.Valor | currency}}</div>' }
          ]
        };

        $scope.$watch("persona", function() {
          seguridadSocialCrudService.get('upc_adicional','limit=0&query=Activo:true,PersonaAsociada:'+$scope.persona.IdProveedor)
            .then( function(response) {
              self.gridOptions.data = response.data;
            });
        });

      },
      controllerAs:'d_upcDetalleActivos'
    };
  });
