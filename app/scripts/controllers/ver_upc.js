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

  self.init = function() {
    cargarGrilla();
  }


  self.gridOptions = {
    enableRowHeaderSelection: false,
    enableRowSelection: true,
    columnDefs: [
      { field: 'Id', visible: false},
      { name: 'TipoDocumento', cellTemplate: '<div align="center">{{row.entity.TipoDocumento}}</div>', headerCellTemplate: '<div align="center"><h5> Tipo Documento </h5></div>' },
      { field: 'Documento', cellTemplate: '<div align="center">{{row.entity.Documento}}</div>', headerCellTemplate: '<div align="center"><h5> Documento </h5></div>' },
      { field: 'Nombre', cellTemplate: '<div align="center">{{row.entity.Nombre}}</div>', headerCellTemplate: '<div align="center"><h5> Nombre </h5></div>' },
      { field: 'Apellido', cellTemplate: '<div align="center">{{row.entity.Apellido}}</div>', headerCellTemplate: '<div align="center"><h5> Apellido </h5></div>' },
      { field: 'TipoUpc.Valor',  cellTemplate: '<div align="center">{{row.entity.IdTipoUpc.Valor | currency:"$":0}}</div>', headerCellTemplate: '<div align="center"><h5> Valor </h5></div>'},
      { name: 'Opciones',
      cellTemplate:
      '<center>' +
      '<a class="ver" ng-click="grid.appScope.d_opListarTodas.op_detalle(row,\'ver\')" >'+
      '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="Ver"></i></a> ' +
      '<a class="editar" ng-click="grid.appScope.TiposAvance.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">'+
      '<i data-toggle="tooltip" title="Editar" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> '+
      '<a class="borrar" ng-click="grid.appScope.verUpc.load_row(row,\'desactivar\');" data-toggle="modal" data-target="#myModal">'+
      '<i data-toggle="tooltip" title="Borrar" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>'+
      '</center>'
    }
  ]
};

self.load_row = function(row,opcion) {

  switch (opcion) {
    case 'desactivar':
    swal({
      title: '¿Eliminar a ' + row.entity.Nombre + ' ' + row.entity.Apellido +'?',
      text: 'No podrás revertir esto',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
}).then(function () {
    var upcAdicional = row.entity;
    upcAdicional.Activo = false;
    seguridadSocialCrudService.put('upc_adicional',upcAdicional.Id,upcAdicional).then(function(response) {
      console.log(response.data);
      if(response.data === 'OK') {
        swal(
          'Eliminado',
          upcAdicional.Nombre + ' ' + upcAdicional.Apellido +' ha sido eliminado.',
          'success'
        )
        cargarGrilla();
      }
    })
  });

    break;
    case 'editar':
    break;
    default:
    break;

  }
};

function cargarGrilla() {
  seguridadSocialCrudService.get('upc_adicional','limit=-1&query=Activo:true').then(function(response) {
    self.gridOptions.data = response.data;
  });
}

});
