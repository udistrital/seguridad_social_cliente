'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:ActivosCtrl
* @description
* # ActivosCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('ActivosCtrl', function (seguridadSocialService, titanCrudService, $q) {
  var self = this;

  self.novedadesDiv = false;
  self.activosDiv = false;
  self.nomina = 0;

  self.anioPeriodo = new Date().getFullYear();
  self.mesPeriodo = new Date().getMonth();

  var fechaActual = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()
  //console.log(fechaActual);

  self.nominaSeleccionada = function() {
    seguridadSocialService.getServicio("seg_social/CalcularSegSocial",self.nomina).then(function(response) {
      var pagos = response.data;
      angular.forEach(pagos,function(data){
        titanCrudService.get('informacion_proveedor', 'limit=-1&fields=Id,NomProveedor&query=Id:' + data.Persona).then(function(response) {
            self.nombre = response.data[0].NomProveedor;
            self.gridOptions.data.push({
              Persona: data.Persona,
              Nombre: self.nombre,
              SaludTotal: data.SaludTotal,
              PensionTotal: data.PensionTotal,
              Arl: data.Arl });
          });
        });
      });
      self.activosDiv = true;
    };

    titanCrudService.get('liquidacion','fields=Nomina,Id').then(function(response) {
      self.nominas = response.data;
      console.log(response.data);
    });

    self.gridOptions = {
      enableFiltering : false,
      enableSorting : true,
      treeRowHeaderAlwaysVisible : false,
      showTreeExpandNoChildren : false,

      columnDefs : [
        {field: 'Persona', visible : false},
        {field: 'Nombre', visible: true},
        {field: 'SaludTotal', visible: true, displayName : 'Salud' , cellFilter : 'currency'},
        {field: 'PensionTotal', visible: true, displayName : 'Pensión', cellFilter : 'currency'},
        {field: 'Arl', visible: true, displayName : 'ARL', cellFilter : 'currency'},
        {field: 'Novedades', cellTemplate: '<button class="btn btn-success" ng-click="grid.appScope.activos.novedad(row)"> Ver Detalle </button>' }
      ]
    };

    self.novedad = function(row) {
      self.novedadesDiv = false;
      self.novedadesDiv = true;
      self.persona = row.entity;
    };

  });
