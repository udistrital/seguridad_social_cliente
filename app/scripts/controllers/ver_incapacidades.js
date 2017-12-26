'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:VerIncapacidadesCtrl
* @description
* # VerIncapacidadesCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('VerIncapacidadesCtrl', function (titanCrudService) {
  var self = this;
    titanCrudService.get('concepto_por_persona','query=Concepto.naturaleza:seguridad_social,Concepto.NombreConcepto__startswith:incapacidad')
    .then(function(response) {
      var concepto_por_persona = response.data;

      angular.forEach(concepto_por_persona,function(data){
        titanCrudService.get('informacion_proveedor', 'limit=-1&fields=Id,NomProveedor&query=Id:' + data.Persona.Id).then(function(response) {
          self.nombre = response.data[0].NomProveedor;
          self.gridOptions.data.push({
            Persona: data.Persona.Id,
            Nombre: self.nombre,
            Concepto: data.Concepto,
            FechaDesde: data.FechaDesde,
            FechaHasta: data.FechaHasta});
          });
        });
      });

      self.gridOptions = {
        enableFiltering : false,
        enableSorting : true,
        treeRowHeaderAlwaysVisible : false,
        showTreeExpandNoChildren : false,

        columnDefs : [
          {field: 'Persona', visible : false},
          {field: 'Nombre', visible: true, width: '30%', headerCellTemplate: '<div align="center">Nombre</div>'},
          {field: 'Concepto.AliasConcepto', visible: true,  headerCellTemplate: '<div align="center">Tipo</div>'},
          {
            field: 'FechaDesde', visible: true, displayName: 'Fecha Inicio',
            cellTemplate: '<div align="right"><span>{{row.entity.FechaDesde | date:"yyyy-MM-dd":"+0900"}}</span></div>'
          },
          {
            field: 'FechaHasta', visible: true, displayName: 'Fecha Finlización',
            cellTemplate: '<div align="right"><span>{{row.entity.FechaHasta | date:"yyyy-MM-dd":"+0900"}}</span></div>'
          }]
        };
});
