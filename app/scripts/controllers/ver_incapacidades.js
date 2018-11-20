'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:VerIncapacidadesCtrl
* @description
* # VerIncapacidadesCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('VerIncapacidadesCtrl', function (titanCrudService, administrativaAmazonService) {
  var self = this;

    titanCrudService.get('concepto_nomina_por_persona','query=Concepto.NaturalezaConcepto.Nombre:seguridad_social,Concepto.NombreConcepto__startswith:incapacidad')
    .then(function(response) {
      var concepto_por_persona = response.data;

      angular.forEach(concepto_por_persona,function(data){
        administrativaAmazonService.get('contrato_general/'+data.NumeroContrato, '').then(function(response) {
          administrativaAmazonService.get('informacion_proveedor/'+response.data.Contratista, '').then(function(response) {
            console.log("response: ", response.data);
          
          self.gridOptions.data.push({
            Contrato: data.NumeroContrato,
            Nombre: response.data.NomProveedor,
            Concepto: data.Concepto,
            FechaDesde: data.FechaDesde,
            FechaHasta: data.FechaHasta});
          })

          });
        });
        console.log("data: ",self.gridOptions.data);
      });

      self.gridOptions = {
        enableFiltering : false,
        enableSorting : true,
        treeRowHeaderAlwaysVisible : false,
        showTreeExpandNoChildren : false,

        columnDefs : [
          {field: 'Contrato', headerCellTemplate: '<div align="center">Número de Contrato</div>'},
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
