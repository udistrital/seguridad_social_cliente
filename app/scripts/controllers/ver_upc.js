'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:VerUpcCtrl
 * @description
 * # VerUpcCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('VerUpcCtrl', function (seguridadSocialCrudService) {
    var self = this;

    self.gridOptions = {
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      columnDefs: [
        { field: 'Id', visible: false},
        { name: 'TipoDocumento', cellTemplate: '<div align="center">{{row.entity.TipoDocumento}}</div>', headerCellTemplate: '<div align="center"><h5> Tipo Documento </h5></div>' },
        { field: 'Documento', cellTemplate: '<div align="center">{{row.entity.Documento}}</div>', headerCellTemplate: '<div align="center"><h5> Documento </h5></div>' },
        { field: 'Nombre', cellTemplate: '<div align="center">{{row.entity.Nombre}}</div>', headerCellTemplate: '<div align="center"><h5> Nombre </h5></div>' },
        { field: 'Apellido', cellTemplate: '<div align="center">{{row.entity.Apellido}}</div>', headerCellTemplate: '<div align="center"><h5> Apellido </h5></div>' },
        { field: 'IdTipoUpc.Valor',  cellTemplate: '<div align="center">{{row.entity.IdTipoUpc.Valor | currency:"$":0}}</div>', headerCellTemplate: '<div align="center"><h5> Valor </h5></div>'},
        { name: 'Opciones',
        cellTemplate:
            '<center>' +
            '<a class="ver" ng-click="grid.appScope.d_opListarTodas.op_detalle(row,\'ver\')" >'+
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.TiposAvance.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">'+
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> '+
            '<a class="borrar" ng-click="grid.appScope.TiposAvance.load_row(row,\'delete\');" data-toggle="modal" data-target="#myModal">'+
            '<i data-toggle="tooltip" title="{{\'BTN.BORRAR\' | translate }}" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>'+
            '</center>'
          }
      ]
    };

    seguridadSocialCrudService.get('upc_adicional','limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
    });
  });
