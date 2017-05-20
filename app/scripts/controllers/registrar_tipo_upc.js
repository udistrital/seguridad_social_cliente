'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:RegistrarTipoUpcCtrl
* @description
* # RegistrarTipoUpcCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('RegistrarTipoUpcCtrl', function (seguridadSocialCrudService, $scope) {

  var self = this;
  var zona = [];

  self.gridOptions = {
    enableRowHeaderSelection: false,
    enableRowSelection: true,
    multiSelect: false,
    expandableRowTemplate: 'expandableRowEdades.html',
    expandableRowHeight: 250,
    onRegisterApi: function(gridApi) {
      gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
        if(row.isExpanded) {
          row.entity.subGridOptions = {
            enableRowSelection: true,
            multiSelect: false,
            enableCellEditOnFocus: true,
            columnDefs: [
              { name: 'Id', visible: false},
              { name: 'Valor', enableCellEdit: true,
                cellTemplate: '<div ng-init="row.entity.Valor=0">{{row.entity.Valor | currency:undefined:0}}</div>',
                headerCellTemplate: '<div align="center"><h5>Valor</h5></div>'},
              { name: 'EdadMin', cellTemplate: '<div align="center">{{row.entity.EdadMin}}</div>', headerCellTemplate: '<div align="center"><h5>Edad Mínima</h5></div>'},
              { name: 'EdadMax', cellTemplate: '<div align="center">{{row.entity.EdadMax}}</div>', headerCellTemplate: '<div align="center"><h5>Edad Máxima</h5></div>'},
              { name: 'IdEdadUpc.AplicaGenero', enableCellEdit: false, cellTemplate: '<div align="center">{{row.entity.AplicaGenero}}</div>', headerCellTemplate: '<div align="center"><h5>Aplica Genero</h5></div>'}
          ]};

          seguridadSocialCrudService.get('edad_upc','limit=-1').then(function(response) {
            row.entity.subGridOptions.data = response.data;
            zona += row.entity.subGridOptions.data;
          });
        }
      });
    }
  };

  self.gridOptions.columnDefs = [
    {name: 'Id', visible: false},
    {name: 'Nombre', cellTemplate: '<div align="center">{{row.entity.Nombre}}</div>', headerCellTemplate: '<div align="center"><h5>Nombre de la Zona</h5></div>'}
  ];

  seguridadSocialCrudService.get('tipo_zona_upc','limit=0').then(function(response) {
    //self.zonas = response.data;
    self.gridOptions.data = response.data;
  });

  self.guardar = function() {
    console.log(zona);
  }

});
