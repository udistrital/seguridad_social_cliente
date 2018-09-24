'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:VerUpcCtrl
* @description
* # VerUpcCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
  .controller('VerUpcCtrl', function (seguridadSocialCrudService, $scope, administrativaAmazonService) {
    var self = this;

    self.init = function () {
      cargarGrilla();
    }

    self.gridOptions = {
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFiltering: true,
      paginationPageSize: 20,
      columnDefs: [
        { field: 'Id', visible: false },
        { field: 'ParametroEstandar', name:"Tipo Documento", enableFiltering: false },
        { field: 'NumDocumento', name: "Documento" },
        { field: 'PrimerNombre', 
          cellTemplate: '<div align="left" class="ui-grid-cell-contents">{{row.entity.PrimerNombre}} {{row.entity.SegundoNombre}}</div>' },
        { field: 'PrimerApellido', cellTemplate: '<div align="left">{{row.entity.PrimerApellido}} {{row.entity.SegundoApellido}}</div>' },
        { field: 'TipoUpc.Valor', name: "Valor", cellTemplate: '<div align="right">{{row.entity.TipoUpc.Valor | currency:"$":0}}</div>' },
        {
          name: 'Opciones',
          cellTemplate:
            '<center>' +
            '<a class="ver" ng-click="grid.appScope.d_opListarTodas.op_detalle(row,\'ver\')" >' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="Ver"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.TiposAvance.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="Editar" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '<a class="borrar" ng-click="grid.appScope.verUpc.load_row(row,\'desactivar\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="Borrar" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>' +
            '</center>',
            enableFiltering: false
        }
      ]
    };

    self.load_row = function (row, opcion) {

      switch (opcion) {
        case 'desactivar':
          swal({
            title: '¿Eliminar a ' + row.entity.Nombre + ' ' + row.entity.Apellido + '?',
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
            seguridadSocialCrudService.put('upc_adicional', upcAdicional.Id, upcAdicional).then(function (response) {
              console.log(response.data);
              if (response.data === 'OK') {
                swal(
                  'Eliminado',
                  upcAdicional.Nombre + ' ' + upcAdicional.Apellido + ' ha sido eliminado.',
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
      seguridadSocialCrudService.get('upc_adicional', 'limit=-1&query=Activo:true').then(function (response) {
        var aux = response.data;
        administrativaAmazonService.get('parametro_estandar', 'query=ClaseParametro:Tipo%20Documento&limit=-1').then(function (response) {
          self.tipoDocumento = response.data;
          for (var i = 0; i < aux.length; i++) {
            for (var j = 0; j < self.tipoDocumento.length; j++) {
              if (aux[i].ParametroEstandar === self.tipoDocumento[j].Id) {
                aux[i].ParametroEstandar = self.tipoDocumento[j].Abreviatura;
                break;
              }
            }
          }
          self.gridOptions.data = aux;
        });
      });
    }
  });
