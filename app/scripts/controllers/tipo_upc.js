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
              { name: 'Valor', cellTemplate: '<div align="center">{{row.entity.Valor | currency:"$":0}}</div>', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.VALOR\' | translate }} </h5></div>'},
              { name: 'RangoEdadUpc.EdadMin', cellTemplate: '<div align="center">{{row.entity.RangoEdadUpc.EdadMin}}</div>', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.EDAD_MINIMA\' | translate }} </h5></div>'},
              { name: 'RangoEdadUpc.EdadMax', cellTemplate: '<div align="center">{{row.entity.RangoEdadUpc.EdadMax}}</div>', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.EDAD_MAXIMA\' | translate }} </h5></div>'},
              { name: 'RangoEdadUpc.AplicaGenero', cellTemplate: '<div align="center" ng-if="row.entity.RangoEdadUpc.AplicaGenero.length === 0">No</div><div align="center" ng-if="row.entity.RangoEdadUpc.AplicaGenero.length !== 0">{{row.entity.RangoEdadUpc.AplicaGenero}}</div>', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.APLICA_GENERO\' | translate }} </h5></div>'}
            ]};

            seguridadSocialCrudService.get('tipo_upc','?limit=-1&query=ZonaUpc:' + row.entity.Id)
              .then(function(response) {
                row.entity.subGridOptions.data = response.data;
            });
          }
        });
      }
    };

    self.gridOptions.columnDefs = [
      {field: 'Id', visible : false},
      {field: 'Nombre', visible: true, cellTemplate: '<div class="col-xs-offset-1"><label>{{row.entity.Nombre}}</label></div>',headerCellTemplate: '<div align="center"><h5>Zonas</h5></div>'},
    ];

    seguridadSocialCrudService.get('zona_upc','limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
    });
  });
