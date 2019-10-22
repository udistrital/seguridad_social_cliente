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
    self.opciones = ["Beneficiarios Adicionales", "Beneficiarios"];

    self.init = function () {
      cargarGrilla();
      cargarGrillaBeneficiarios();
    };

    self.gridBeneficiariosOp = {
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFiltering: true,
      paginationPageSize: 20,
      columnDefs: [
        { field: 'Id', visible: false },
        { field: 'AbreviaturaDocumento', name: "Tipo Documento", enableFiltering: false, enableCellEdit: false },
        { field: 'NumDocumento', name: "Documento" },
        { field: 'PrimerNombre', name: "Primer Nombre" },
        { field: 'SegundoNombre', name: "Segundo Nombre" },
        { field: 'PrimerApellido', name: "Primer Apellido" },
        { field: 'SegundoApellido', name: "Segundo Apellido" },
        { 
          field: 'Activo', name: 'Estado', enableCellEdit: false,
          cellTemplate: '<div align="right" >{{row.entity.Activo}}</div>' 
        },
        {
          name: 'Opciones',
          enableCellEdit: false,
          cellTemplate:
            '<center>' +
            '<a class="ver" ng-click="grid.appScope.verUpc.load_row(row,\'ver\')" >' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="Ver"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.verUpc.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="Editar" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '<a class="borrar" ng-click="grid.appScope.verUpc.load_row(row,\'desactivar\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="Borrar" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>' +
            '</center>',
          enableFiltering: false
        }
      ]
    };

    self.gridOptions = {
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      enableFiltering: true,
      paginationPageSize: 20,
      columnDefs: [
        { field: 'Id', visible: false },
        { field: 'AbreviaturaDocumento', name: "Tipo Documento", enableFiltering: false, enableCellEdit: false, },
        { field: 'NumDocumento', name: "Documento" },
        { field: 'PrimerNombre', name: "Primer Nombre" },
        { field: 'SegundoNombre', name: "Segundo Nombre" },
        { field: 'PrimerApellido', name: "Primer Apellido"},
        { field: 'SegundoApellido', name: "Segundo Apellido" },
        { field: 'TipoUpc.Valor', name: "Valor", enableCellEdit: false,
          cellTemplate: '<div align="right">{{row.entity.TipoUpc.Valor | currency:"$":0}}</div>' 
        },
        {
          name: 'Opciones',
          enableCellEdit: false,
          cellTemplate:
            '<center>' +
            '<a class="ver" ng-click="grid.appScope.verUpc.load_row(row,\'ver\')" >' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="Ver"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.verUpc.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="Editar" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '<a class="borrar" ng-click="grid.appScope.verUpc.load_row(row,\'desactivar\');" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="Borrar" class="fa fa-trash fa-lg" aria-hidden="true"></i></a>' +
            '</center>',
          enableFiltering: false
        }
      ]
    };

    self.load_row = function (row, opcion) {
      
      var entity = row.entity;
      var nombreCompleto = entity.PrimerNombre +' '+ entity.SegundoNombre +' '+ entity.PrimerApellido +' '+ entity.SegundoApellido;
      switch (opcion) {
        case 'desactivar':
          swal({
            title: '¿Eliminar a '+ nombreCompleto + '?',
            text: 'No podrás revertir esto',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then(function (result) {
            var beneficiario = entity;
            beneficiario.Activo = false;
            
            if (result.value) {
              if (self.opVista === 'Beneficiarios') {
                seguridadSocialCrudService.put('beneficiarios', beneficiario.Id, beneficiario).then(function (response) {
                  if (response.data === 'OK') {
                    swal(
                      'Eliminado',
                      nombreCompleto + ' ha sido eliminado.',
                      'success'
                    )
                    cargarGrillaBeneficiarios();
                  }
                });
              } else {
                var beneficiarioAd = beneficiario;
                seguridadSocialCrudService.put('upc_adicional', beneficiarioAd.Id, beneficiarioAd).then(function (response) {
                  if (response.data === 'OK') {
                    swal(
                      'Eliminado',
                      nombreCompleto + ' ha sido eliminado.',
                      'success'
                    )
                    cargarGrilla();
                  }
                });
              }
            }
          });
          break;

        case 'edit':
            swal({
              title: '¿Acutalizar la información?',
              text: 'No podrás revertir esto',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Confirmar',
              cancelButtonText: 'Cancelar'
            }).then(function(result) {
              if(result.value) {
                actualizarInformacion(entity);
              }

            });
          break;

        default:
          break;

      }
    };

    function actualizarInformacion(beneficiario) {
      var swalUpdateMessage = swal(
        'Actualizado',
         'Información actualizada',
        'success'
      );

      if (self.opVista === 'Beneficiarios') {
        seguridadSocialCrudService.put('beneficiarios', beneficiario.Id, beneficiario).then(function (response) {
          if (response.data.Id !== undefined) {
            swalUpdateMessage();
            cargarGrillaBeneficiarios();
          }
        });
      } else {
        seguridadSocialCrudService.put('upc_adicional', beneficiario.Id, beneficiario).then(function (response) {
          if (response.data.Id !== undefined) {
            swalUpdateMessage();
            cargarGrilla();
          }
        });
      }
    }

    function cargarGrillaBeneficiarios() {
      seguridadSocialCrudService.get('beneficiarios', 'limit=-1&query=Activo:true').then(function (response) {
        var aux = response.data;
        administrativaAmazonService.get('parametro_estandar', 'query=ClaseParametro:Tipo%20Documento&limit=-1').then(function (response) {
          self.tipoDocumento = response.data;
          for (var i = 0; i < aux.length; i++) {
            for (var j = 0; j < self.tipoDocumento.length; j++) {
              if (aux[i].ParametroEstandar === self.tipoDocumento[j].Id) {
                aux[i].AbreviaturaDocumento = self.tipoDocumento[j].Abreviatura;
                break;
              }
            }
          }
          self.gridBeneficiariosOp.data = aux;
        });
      });
    }

    function cargarGrilla() {
      seguridadSocialCrudService.get('upc_adicional', 'limit=-1&query=Activo:true').then(function (response) {
        var aux = response.data;
        administrativaAmazonService.get('parametro_estandar', 'query=ClaseParametro:Tipo%20Documento&limit=-1').then(function (response) {
          self.tipoDocumento = response.data;
          for (var i = 0; i < aux.length; i++) {
            for (var j = 0; j < self.tipoDocumento.length; j++) {
              if (aux[i].ParametroEstandar === self.tipoDocumento[j].Id) {
                aux[i].AbreviaturaDocumento = self.tipoDocumento[j].Abreviatura;
                break;
              }
            }
          }
          self.gridOptions.data = aux;
        });
      });
    }
  });
