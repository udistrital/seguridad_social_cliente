'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:TipoUpcCtrl
* @description
* # TipoUpcCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('TipoUpcCtrl', function (seguridadSocialCrudService, $scope) {
  var self = this;


  self.gridOptions = {
    enableRowHeaderSelection: false,
    enableRowSelection: true,
    multiSelect: false,
    expandableRowTemplate: 'expandableRowUpc.html',
    expandableRowHeight: 250,
    onRegisterApi: function (gridApi) {
      gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
        if (row.isExpanded) {
          row.entity.subGridOptions = {
            columnDefs: [
              { name: 'Id', visible: false},
              { name: 'Valor', cellTemplate: '<div align="center">{{row.entity.Valor | currency:"$":0}}</div>', headerCellTemplate: '<div align="center"><h5>Valor</h5></div>'},
              { name: 'RangoEdadUpc.EdadMin', cellTemplate: '<div align="center">{{row.entity.IdEdadUpc.EdadMin}}</div>', headerCellTemplate: '<div align="center"><h5>Edad Mínima</h5></div>'},
              { name: 'RangoEdadUpc.EdadMax', cellTemplate: '<div align="center">{{row.entity.IdEdadUpc.EdadMax}}</div>', headerCellTemplate: '<div align="center"><h5>Edad Máxima</h5></div>'},
              { name: 'RangoEdadUpc.AplicaGenero', cellTemplate: '<div align="center">{{row.entity.IdEdadUpc.AplicaGenero}}</div>', headerCellTemplate: '<div align="center"><h5>Aplica Genero</h5></div>'}
            ]};

            seguridadSocialCrudService.get('tipo_upc','?limit=-1&query=ZonaUpc:' + row.entity.Id)
              .then(function(response) {
                console.log(response.data);
                row.entity.subGridOptions.data = response.data;
            });
          }
        });
      }
    }

    self.gridOptions.columnDefs = [
      {field: 'Id', visible : false},
      {field: 'Nombre', visible: true, cellTemplate: '<div class="col-xs-offset-1"><label>{{row.entity.Nombre}}</label></div>',headerCellTemplate: '<div align="center"><h5>Zonas</h5></div>'},
    ];

    seguridadSocialCrudService.get('zona_upc','limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
    });
  });
